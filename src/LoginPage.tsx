import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, signIn, signUp } from "./api";

export type AuthMode = "login" | "signup";

function DocumentIllustration() {
  return (
    <div className="login-illustration" aria-hidden="true">
      <span className="login-art-spark login-spark-a">✦</span>
      <span className="login-art-spark login-spark-b">✦</span>
      <span className="login-art-orbit" />
      <div className="login-document login-document-pdf"><b>PDF</b><i /><i /></div>
      <div className="login-document login-document-word"><b>W</b><i /><i /></div>
      <div className="login-document login-document-sheet"><b>X</b><i /><i /></div>
      <div className="login-chat-card">
        <div className="login-chat-question">What are the key findings from this report?</div>
        <div className="login-chat-answer">
          <span className="login-mini-bot"><Sparkles size={14} /></span>
          <div>
            <strong>Based on your document, the key findings are:</strong>
            <ol>
              <li>Sales increased compared to last quarter.</li>
              <li>Customer retention improved across key segments.</li>
              <li>New opportunities are identified in the report.</li>
            </ol>
            <span className="login-source-chip"><FileText size={10} /> Sales_Report.pdf <b>Page 4</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void getCurrentUser()
      .then((user) => {
        if (active && user) window.location.replace("/workspace");
      })
      .catch(() => {
        if (active) setError("Unable to check your session. Please try again.");
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      window.location.assign("/workspace");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Account request failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice("");
    setError("");
  }

  return (
    <main className="login-page">
      <a className="login-back-link" href="/" aria-label="Back to RAGMind AI landing page">
        <span className="login-brand-mark"><FileText size={25} strokeWidth={2.2} /></span>
        <span>RAGMind <b>AI</b></span>
      </a>
      <div className="login-tagline">Your Documents. Smarter Answers.<span>✦ ✦ ✦ ✦</span></div>

      <div className="login-layout">
        <section className="login-promo">
          <span className="login-eyebrow"><Sparkles size={13} /> AI-Powered Document Intelligence</span>
          <div className="login-benefits">
            <div><span><FileText size={19} /></span><strong>Multiple<br />File Formats</strong><small>PDF, DOCX, TXT<br />and more</small></div>
            <div><span><MessageCircle size={19} /></span><strong>AI-Powered<br />Answers</strong><small>Get accurate<br />insights</small></div>
            <div><span><ShieldCheck size={19} /></span><strong>Source<br />References</strong><small>See where answers<br />come from</small></div>
            <div><span><LockKeyhole size={19} /></span><strong>Secure<br />&amp; Private</strong><small>Your data stays<br />safe</small></div>
          </div>
          <DocumentIllustration />
        </section>

        <section className="auth-card" aria-label="Account access">
          <div className="auth-tabs" role="tablist" aria-label="Account options">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "selected" : ""}
              onClick={() => changeMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "selected" : ""}
              onClick={() => changeMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-heading">
            <h2>{mode === "login" ? "Welcome Back" : "Create Your Account"}</h2>
            <p>{mode === "login" ? "Sign in to your RAGMind AI account" : "Get started with your document workspace"}</p>
          </div>

          <form className="auth-form" onSubmit={(event) => void submit(event)}>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Your Name</span>
                <span className="auth-input-wrap">
                  <input type="text" name="name" autoComplete="name" placeholder="Enter your name" required />
                </span>
              </label>
            )}

            <label className="auth-field">
              <span>Email Address</span>
              <span className="auth-input-wrap">
                <Mail size={16} />
                <input type="email" name="email" autoComplete="email" placeholder="Enter your email" required />
              </span>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className="auth-input-wrap">
                <LockKeyhole size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                  minLength={mode === "login" ? 1 : 12}
                  maxLength={128}
                  required
                />
                <button
                  type="button"
                  className="password-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {mode === "signup" && (
              <p className="password-hint">Use at least 12 characters for your password.</p>
            )}

            {error && <p role="alert" className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting
                ? mode === "login" ? "Signing in..." : "Creating account..."
                : mode === "login" ? "Sign In" : "Create Account"}
              {!submitting && <ArrowRight size={17} />}
            </button>
          </form>

          {notice && (
            <div className="auth-notice" role="status">
              <ShieldCheck size={16} />
              <span>{notice}</span>
            </div>
          )}

          <p className="auth-switch">
            {mode === "login" ? "Don’t have an account?" : "Already have an account?"}
            <button
              type="button"
              className="auth-text-button"
              onClick={() => changeMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
