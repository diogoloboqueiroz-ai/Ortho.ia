import Link from "next/link";
import { signIn } from "@/auth";
import { OrthoLogo } from "@/components/ortho-logo";

const PLACEHOLDER_TOKENS = ["placeholder", "SEU_GOOGLE_CLIENT_ID", "SEU_GOOGLE_CLIENT_SECRET"];

function hasRealGoogleOAuthConfig() {
  const clientId = process.env.AUTH_GOOGLE_ID ?? "";
  const clientSecret = process.env.AUTH_GOOGLE_SECRET ?? "";

  if (!clientId || !clientSecret) {
    return false;
  }

  return !PLACEHOLDER_TOKENS.some(
    (token) => clientId.includes(token) || clientSecret.includes(token)
  );
}

export default function LoginPage() {
  const googleAuthConfigured = hasRealGoogleOAuthConfig();

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-hero">
          <div>
            <OrthoLogo tone="light" />
            <h1>Entrar na ORTHO.AI</h1>
            <p>
              Acesse o cockpit clínico da sua operação ortopédica com identidade visual
              consistente, contexto seguro e fluxos preparados para consulta, laudo e decisão.
            </p>
          </div>

          <div className="auth-metrics">
            <div>
              <strong>7 dias</strong>
              <span>Trial liberado sem cartão</span>
            </div>
            <div>
              <strong>LGPD</strong>
              <span>Camada segura para documentos</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>OrthoBrain Engine™ ativo</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <OrthoLogo tone="dark" subtitle={false} />
          <h2>Bem-vindo de volta</h2>
          <p>Escolha o método de acesso preferido para continuar para o console clínico.</p>

          {googleAuthConfigured ? (
            <form action={signInWithGoogle}>
              <button type="submit" className="button button--light auth-google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21.81 12.23C21.81 11.5 21.75 10.97 21.62 10.42H12V14.13H17.65C17.53 15.05 16.88 16.44 15.43 17.37L15.41 17.49L18.42 19.77L18.63 19.79C20.56 18.05 21.81 15.49 21.81 12.23Z" fill="#4285F4" />
                  <path d="M12 22C14.76 22 17.08 21.11 18.63 19.79L15.43 17.37C14.58 17.95 13.43 18.36 12 18.36C9.3 18.36 7.01 16.62 6.2 14.22L6.08 14.23L2.95 16.6L2.91 16.71C4.45 19.7 7.98 22 12 22Z" fill="#34A853" />
                  <path d="M6.2 14.22C5.99 13.67 5.87 13.07 5.87 12.45C5.87 11.83 5.99 11.23 6.19 10.68L6.18 10.55L3.01 8.14L2.91 8.18C2.28 9.42 1.92 10.8 1.92 12.45C1.92 14.11 2.28 15.48 2.91 16.71L6.2 14.22Z" fill="#FBBC05" />
                  <path d="M12 6.54C13.81 6.54 15.03 7.3 15.73 7.94L18.69 5.12C17.07 3.66 14.76 2.91 12 2.91C7.98 2.91 4.45 5.21 2.91 8.18L6.19 10.68C7.01 8.28 9.3 6.54 12 6.54Z" fill="#EA4335" />
                </svg>
                Entrar com Google
              </button>
            </form>
          ) : (
            <>
              <button type="button" className="button button--light auth-google" disabled aria-disabled="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21.81 12.23C21.81 11.5 21.75 10.97 21.62 10.42H12V14.13H17.65C17.53 15.05 16.88 16.44 15.43 17.37L15.41 17.49L18.42 19.77L18.63 19.79C20.56 18.05 21.81 15.49 21.81 12.23Z" fill="#4285F4" />
                  <path d="M12 22C14.76 22 17.08 21.11 18.63 19.79L15.43 17.37C14.58 17.95 13.43 18.36 12 18.36C9.3 18.36 7.01 16.62 6.2 14.22L6.08 14.23L2.95 16.6L2.91 16.71C4.45 19.7 7.98 22 12 22Z" fill="#34A853" />
                  <path d="M6.2 14.22C5.99 13.67 5.87 13.07 5.87 12.45C5.87 11.83 5.99 11.23 6.19 10.68L6.18 10.55L3.01 8.14L2.91 8.18C2.28 9.42 1.92 10.8 1.92 12.45C1.92 14.11 2.28 15.48 2.91 16.71L6.2 14.22Z" fill="#FBBC05" />
                  <path d="M12 6.54C13.81 6.54 15.03 7.3 15.73 7.94L18.69 5.12C17.07 3.66 14.76 2.91 12 2.91C7.98 2.91 4.45 5.21 2.91 8.18L6.19 10.68C7.01 8.28 9.3 6.54 12 6.54Z" fill="#EA4335" />
                </svg>
                Entrar com Google
              </button>
              <p className="auth-note">
                Login Google indisponível neste ambiente. Configure `AUTH_GOOGLE_ID` e
                `AUTH_GOOGLE_SECRET` reais para habilitar o OAuth.
              </p>
            </>
          )}

          <div className="auth-divider">ou continue com e-mail</div>

          <form className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" placeholder="nome@clinica.com.br" />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" placeholder="Digite sua senha" />
            </div>
            <button type="submit" className="button button--primary auth-submit">
              Acessar plataforma
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/">Voltar para a landing</Link>
            <a href="mailto:diogo.lobo.queiroz@gmail.com?subject=Criar%20conta%20ORTHO.AI">
              Criar conta
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
