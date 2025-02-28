import express from "express";
import { auth, requiresAuth } from "express-openid-connect";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import usersRouter from "./route/users";
import postsRouter from "./route/posts";
import asyncRouter from "./route/async";
import { authMiddleware } from "./middleware/authentication";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/callback", (req: any, res: any) => {
  const { id_token } = req.query;
  if (id_token) {
    try {
      const { id_token } = req.query;
      const decodedToken = jwt.decode(id_token, { complete: true });

      console.log("Decoded ID Token:", decodedToken);

      return res.json({
        message: "Login successful",
        id_token,
        user: decodedToken?.payload,
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      return res.status(400).json({ error: "Invalid id_token" });
    }
  } else {
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Processing Login...</title>
            <script>
                window.onload = function() {
                    const fragment = new URLSearchParams(window.location.hash.substring(1));
                    const id_token = fragment.get("id_token");
  
                    if (id_token) {
                        console.log("ID Token:", id_token);
                        window.location.href = "/callback?id_token=" + encodeURIComponent(id_token);
                    } else {
                        document.body.innerHTML = "<h1>Error: ID Token not found</h1>";
                    }
                };
            </script>
        </head>
        <body>
            <h1>Processing Login...</h1>
        </body>
        </html>
      `);
  }
});

app.use(authMiddleware);
app.get("/", (req, res) => {
  console.log(req.oidc.idToken)
  res.send(req.oidc.isAuthenticated() ? "🔐 Logged in" : "🔓 Logged out");
});

app.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/" });
});

app.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: "/" });
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.json({
    user: req.oidc.user, 
    id_token: req.oidc.idToken, 
  });
});


app.get("/api/protected", requiresAuth(), (req, res) => {
  res.json({ message: "คุณสามารถเข้าถึง API นี้ได้เพราะคุณล็อกอินแล้ว!" });
});

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/async", asyncRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
