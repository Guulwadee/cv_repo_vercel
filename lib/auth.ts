import { AuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { ZodError, z } from 'zod';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const parsed = z
            .object({ email: z.string().email(), password: z.string().min(8) })
            .parse(credentials);
          const user = await prisma.user.findUnique({ where: { email: parsed.email } });
          if (!user?.passwordHash) return null;
          const valid = await bcrypt.compare(parsed.password, user.passwordHash);
          if (!valid) return null;
          // Require email verification
          if (!user.emailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED');
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          };
        } catch (e) {
          if (e instanceof ZodError) return null;
          throw e;
        }
      }
    })
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/en/auth/signin' // default
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const getSession = () => getServerSession(authOptions);
