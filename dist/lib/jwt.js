"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_OPTIONS = void 0;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: JWT_SECRET must be set in environment variables for production');
    }
    console.warn('WARNING: JWT_SECRET not set. Using insecure default for development only.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
function getSecret() {
    if (!JWT_SECRET) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('FATAL: JWT_SECRET required in production');
        }
        return 'dev-secret-change-me';
    }
    return JWT_SECRET;
}
function signToken(payload) {
    const secret = getSecret();
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    const secret = getSecret();
    return jsonwebtoken_1.default.verify(token, secret);
}
// Use FRONTEND_URL to detect production — NODE_ENV may not be set if .env isn't loaded
// via dotenv. If FRONTEND_URL is an HTTPS address we're in a production context.
const isProd = (process.env.FRONTEND_URL || '').startsWith('https://');
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    // Share cookie across all subdomains (api.labs.trevoros.com → labs.trevoros.com)
    ...(isProd && { domain: '.trevoros.com' }),
};
//# sourceMappingURL=jwt.js.map