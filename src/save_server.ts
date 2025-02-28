
import express, { Request, Response } from "express";
import cors from "cors";
import { auth, requiresAuth } from "express-openid-connect";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import session from "express-session";
import usersRouter from "./route/users";
import postsRouter from "./route/posts";
import asyncRouter from "./route/async";
dotenv.config();

const app = express();

app.use(
  session({
    name: "myapp_session",
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
const config = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: process.env.ISSUER_BASE_URL || "https://dev-yg.us.auth0.com",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  clientID: process.env.CLIENT_ID || "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA",
  clientSecret: process.env.CLIENT_SECRET,

  secret: process.env.SESSION_SECRET || "fallback-secret",
  idpLogout: true,
  authorizationParams: {
    response_type: "id_token",
    scope: "openid profile email",
  },
};

app.use(auth(config));
const corsOption = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));
app.use(cors());

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/test", (req, res) => {
  res.send("Hello World");
});
app.get("/", requiresAuth(), (req, res) => {
  console.log("req.oidc.user =>", req.oidc.user);
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});
app.get("/profile", requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});
app.get(
  "/callback",
  (req: Request & any, res: Response & any) => {
    const idToken = req.oidc.accessToken?.id_token;
    if (!idToken) {
      console.error("id_token is missing", req.oidc.accessToken);
      return res.status(400).json({ error: "id_token not found" });
    }
    console.log("ID Token:", idToken);
    res.redirect("/");
  }
);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/async", asyncRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
