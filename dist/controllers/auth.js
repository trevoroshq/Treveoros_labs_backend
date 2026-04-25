"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const auth_1 = require("../services/auth");
const jwt_1 = require("../lib/jwt");
async function register(req, res, next) {
    try {
        const { name, email, password, phone } = req.body;
        const { user, token } = await (0, auth_1.registerUser)({ name, email, password, phone });
        res.cookie('token', token, jwt_1.COOKIE_OPTIONS);
        res.status(201).json({ message: 'Account created', user });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const { user, token } = await (0, auth_1.loginUser)(email, password);
        res.cookie('token', token, jwt_1.COOKIE_OPTIONS);
        res.json({ message: 'Login successful', user });
    }
    catch (error) {
        next(error);
    }
}
async function logout(_req, res) {
    res.clearCookie('token', { path: '/' });
    res.json({ message: 'Logged out' });
}
async function me(req, res, next) {
    try {
        const user = await (0, auth_1.getUserById)(req.user.id);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const result = await (0, auth_1.requestPasswordReset)(req.body.email);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;
        const result = await (0, auth_1.resetPassword)(token, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.js.map