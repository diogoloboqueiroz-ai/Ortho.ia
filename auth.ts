/**
 * ORTHO.AI — Autenticação
 * Google OAuth via NextAuth v5 + Supabase Adapter
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";

const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || "diogo.lobo.queiroz@gmail.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Checar se é desenvolvedor
        const isDev = session.user.email?.toLowerCase() === DEVELOPER_EMAIL.toLowerCase();
        (session.user as any).isDeveloper = isDev;

        // Carregar dados de assinatura do Supabase
        if (!isDev) {
          // O plano e trial são carregados na rota /api/user/subscription
          (session.user as any).plan = "trial";
        } else {
          (session.user as any).plan = "developer";
        }
      }
      return session;
    },

    async signIn({ user }) {
      // Sempre permitir login — trial começa automaticamente
      return true;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
