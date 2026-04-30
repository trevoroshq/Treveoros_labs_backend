"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = __importDefault(require("./prisma"));
async function getOrCreateUser(profile) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || 'User';
    if (!email)
        throw new Error('Email is required from OAuth provider');
    // 1. Check if user already linked with Google
    const existingByProvider = await prisma_1.default.user.findUnique({
        where: { googleId: profile.id },
    });
    if (existingByProvider)
        return existingByProvider;
    // 2. Check if user exists by email → link the account
    const existingByEmail = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingByEmail) {
        return prisma_1.default.user.update({
            where: { id: existingByEmail.id },
            data: { googleId: profile.id },
        });
    }
    // 3. Create brand new user
    return prisma_1.default.user.create({
        data: {
            email,
            name,
            googleId: profile.id,
        },
    });
}
// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const backendUrl = process.env.BACKEND_URL || 'https://api.labs.trevoros.com';
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${backendUrl}/api/auth/google/callback`,
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const user = await getOrCreateUser({
                id: profile.id,
                emails: profile.emails,
                displayName: profile.displayName,
            });
            done(null, user);
        }
        catch (err) {
            console.error('[Google OAuth] getOrCreateUser failed:', err.message);
            done(err);
        }
    }));
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map