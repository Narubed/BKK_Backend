"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("./route/users"));
const posts_1 = __importDefault(require("./route/posts"));
const async_1 = __importDefault(require("./route/async"));
const authentication_1 = require("./middleware/authentication");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/callback", (req, res) => {
    const { id_token } = req.query;
    if (id_token) {
        try {
            const { id_token } = req.query;
            const decodedToken = jsonwebtoken_1.default.decode(id_token, { complete: true });
            console.log("Decoded ID Token:", decodedToken);
            return res.json({
                message: "Login successful",
                id_token,
                user: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload,
            });
        }
        catch (error) {
            console.error("Error decoding token:", error);
            return res.status(400).json({ error: "Invalid id_token" });
        }
    }
    else {
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
app.use(authentication_1.authMiddleware);
app.get("/", (req, res) => {
    console.log(req.oidc.idToken);
    res.send(req.oidc.isAuthenticated() ? "🔐 Logged in" : "🔓 Logged out");
});
app.get("/login", (req, res) => {
    res.oidc.login({ returnTo: "/" });
});
app.get("/logout", (req, res) => {
    res.oidc.logout({ returnTo: "/" });
});
app.get("/profile", (0, express_openid_connect_1.requiresAuth)(), (req, res) => {
    res.json({
        user: req.oidc.user,
        id_token: req.oidc.idToken,
    });
});
app.get("/api/protected", (0, express_openid_connect_1.requiresAuth)(), (req, res) => {
    res.json({ message: "คุณสามารถเข้าถึง API นี้ได้เพราะคุณล็อกอินแล้ว!" });
});
app.use("/users", users_1.default);
app.use("/posts", posts_1.default);
app.use("/async", async_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
