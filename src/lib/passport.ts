import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './prisma';

async function getOrCreateUser(profile: {
  id: string;
  emails?: { value: string }[];
  displayName?: string;
}) {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName || 'User';

  if (!email) throw new Error('Email is required from OAuth provider');

  // 1. Check if user already linked with Google
  const existingByProvider = await prisma.user.findUnique({
    where: { googleId: profile.id },
  });
  if (existingByProvider) return existingByProvider;

  // 2. Check if user exists by email → link the account
  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: { googleId: profile.id },
    });
  }

  // 3. Create brand new user
  return prisma.user.create({
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
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await getOrCreateUser({
          id: profile.id,
          emails: profile.emails,
          displayName: profile.displayName,
        });
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  ));
}

export default passport;
