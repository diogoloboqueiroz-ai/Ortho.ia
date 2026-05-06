/**
 * ORTHO.AI - Autenticação
 * Google OAuth quando configurado + acesso desenvolvedor por código.
 */

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";

const PLACEHOLDER_TOKENS = [
  "placeholder",
  "SEU_GOOGLE_CLIENT_ID",
  "SEU_GOOGLE_CLIENT_SECRET",
  "SEUPROJETOID",
  "SUA_SERVICE_ROLE_KEY",
];

const DEVELOPER_EMAIL =
  process.env.DEVELOPER_EMAIL || "diogo.lobo.queiroz@gmail.com";

function hasRealValue(value?: string) {
  if (!value) {
    return false;
  }

  return !PLACEHOLDER_TOKENS.some((token) => value.includes(token));
}

const googleAuthConfigured =
  hasRealValue(process.env.AUTH_GOOGLE_ID) &&
  hasRealValue(process.env.AUTH_GOOGLE_SECRET);

const supabaseConfigured =
  hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  hasRealValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

const developerLoginCode = process.env.DEVELOPER_LOGIN_CODE || "";
const developerLoginConfigured = hasRealValue(developerLoginCode);

const providers: NextAuthConfig["providers"] = [
  Credentials({
    id: "developer",
    name: "Acesso Desenvolvedor",
    credentials: {
      email: { label: "E-mail", type: "email" },
      code: { label: "Código de acesso", type: "password" },
    },
    async authorize(credentials) {
      const email =
        typeof credentials?.email === "string"
          ? credentials.email.trim().toLowerCase()
          : "";
      const code =
        typeof credentials?.code === "string" ? credentials.code.trim() : "";

      if (!developerLoginConfigured) {
        return null;
      }

      if (email !== DEVELOPER_EMAIL.toLowerCase() || code !== developerLoginCode) {
        return null;
      }

      return {
        id: "developer-diogo-lobo-queiroz",
        name: "Dr. Diogo Lobo Queiroz",
        email: DEVELOPER_EMAIL,
      };
    },
  }),
];

if (googleAuthConfigured) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

const authConfig = {
  providers,
  adapter: supabaseConfigured
    ? SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      })
    : undefined,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      const isDeveloper =
        typeof token.email === "string" &&
        token.email.toLowerCase() === DEVELOPER_EMAIL.toLowerCase();

      token.isDeveloper = isDeveloper;
      token.plan = isDeveloper ? "developer" : "trial";

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || token.sub || "");
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        (session.user as any).isDeveloper = Boolean(token.isDeveloper);
        (session.user as any).plan = token.plan || "trial";
      }

      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
