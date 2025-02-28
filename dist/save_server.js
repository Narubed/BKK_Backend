"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_openid_connect_1 = require("express-openid-connect");
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const express_session_1 = __importDefault(require("express-session"));
const users_1 = __importDefault(require("./route/users"));
const posts_1 = __importDefault(require("./route/posts"));
const async_1 = __importDefault(require("./route/async"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    name: "myapp_session",
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
}));
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
app.use((0, express_openid_connect_1.auth)(config));
const corsOption = {
    origin: ["http://localhost:3000"],
};
app.use((0, cors_1.default)(corsOption));
app.use((0, cors_1.default)());
const swaggerDocument = yamljs_1.default.load("./swagger.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use("/test", (req, res) => {
    res.send("Hello World");
});
app.get("/", (0, express_openid_connect_1.requiresAuth)(), (req, res) => {
    console.log("req.oidc.user =>", req.oidc.user);
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});
app.get("/profile", (0, express_openid_connect_1.requiresAuth)(), (req, res) => {
    res.json(req.oidc.user);
});
app.get("/callback", (req, res) => {
    var _a;
    const idToken = (_a = req.oidc.accessToken) === null || _a === void 0 ? void 0 : _a.id_token;
    if (!idToken) {
        console.error("id_token is missing", req.oidc.accessToken);
        return res.status(400).json({ error: "id_token not found" });
    }
    console.log("ID Token:", idToken);
    res.redirect("/");
});
app.use("/users", users_1.default);
app.use("/posts", posts_1.default);
app.use("/async", async_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
