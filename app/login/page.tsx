"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const DEMO_EMAIL = "sehmustinte@gmail.com"
const DEMO_PASSWORD = "Sehmus1234!"
const TOKEN_KEY = "ervix_admin_token"
const USER_KEY = "ervix_admin_user"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isDisabled = useMemo(() => {
    return !email.trim() || !password.trim() || loading
  }, [email, password, loading])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const normalizedEmail = email.trim().toLowerCase()
    const rawPassword = password

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Geçerli bir e-posta gir.")
      return
    }

    if (!rawPassword) {
      setError("Şifre alanı zorunludur.")
      return
    }

    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    if (
      normalizedEmail === DEMO_EMAIL.toLowerCase() &&
      rawPassword === DEMO_PASSWORD
    ) {
      const fakeUser = {
        name: "Şehmus",
        email: DEMO_EMAIL,
        role: "ADMIN",
      }

      try {
        if (rememberMe) {
          localStorage.setItem(TOKEN_KEY, "ervix-demo-token")
          localStorage.setItem(USER_KEY, JSON.stringify(fakeUser))
          sessionStorage.removeItem(TOKEN_KEY)
          sessionStorage.removeItem(USER_KEY)
        } else {
          sessionStorage.setItem(TOKEN_KEY, "ervix-demo-token")
          sessionStorage.setItem(USER_KEY, JSON.stringify(fakeUser))
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      } catch {}

      router.replace("/dashboard")
      return
    }

    setLoading(false)
    setError("E-posta veya şifre hatalı.")
  }

  return (
    <>
      <main className="ervix-login-page">
        <div className="ervix-bg" />

        <div className="ervix-shell">
          <section className="ervix-left">
            <div className="ervix-brand">
              <div className="ervix-brand-icon">E</div>
              <div>
                <div className="ervix-brand-kicker">ERVIX</div>
                <div className="ervix-brand-title">Yönetim Paneli</div>
              </div>
            </div>

            <div className="ervix-left-content">
              <div className="ervix-pill">Kurumsal içerik yönetimi</div>

              <h1 className="ervix-heading">
                Dijital yüzünü tek merkezden yönet.
              </h1>

              <p className="ervix-subtext">
                Servis sayfaları, kurumsal içerikler, vitrin alanları ve yönetim
                akışlarını modern, güvenli ve profesyonel bir panel deneyimiyle
                kontrol et.
              </p>

              <div className="ervix-feature-grid">
                <div className="ervix-feature-card">
                  <div className="ervix-feature-number">01</div>
                  <div className="ervix-feature-title">Güvenli erişim</div>
                  <div className="ervix-feature-text">
                    Yönetim tarafına kontrollü ve sade giriş akışı.
                  </div>
                </div>

                <div className="ervix-feature-card">
                  <div className="ervix-feature-number">02</div>
                  <div className="ervix-feature-title">Hızlı yönetim</div>
                  <div className="ervix-feature-text">
                    İçerikleri ve sayfaları tek panelden kolayca yönet.
                  </div>
                </div>

                <div className="ervix-feature-card">
                  <div className="ervix-feature-number">03</div>
                  <div className="ervix-feature-title">Kurumsal görünüm</div>
                  <div className="ervix-feature-text">
                    Markanın dijital vitrini üzerinde tam kontrol sağla.
                  </div>
                </div>
              </div>
            </div>

            <div className="ervix-left-footer">
              <span>© 2026 Ervix Labs</span>
              <span>Secure Admin Access</span>
            </div>
          </section>

          <section className="ervix-right">
            <div className="ervix-card">
              <div className="ervix-card-top">
                <div>
                  <div className="ervix-card-kicker">Ervix Yönetim Paneli</div>
                  <h2 className="ervix-card-title">Hoş geldin</h2>
                  <p className="ervix-card-text">
                    Panele erişmek için giriş bilgilerini kullan.
                  </p>
                </div>

                <div className="ervix-shield">◆</div>
              </div>

              <form onSubmit={handleSubmit} className="ervix-form">
                {error ? <div className="ervix-error">{error}</div> : null}

                <div className="ervix-field">
                  <label className="ervix-label">E-posta</label>
                  <div className="ervix-input-wrap">
                    <span className="ervix-input-icon">✉</span>
                    <input
                      className="ervix-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@ervix.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="ervix-field">
                  <div className="ervix-label-row">
                    <label className="ervix-label">Şifre</label>
                    <a className="ervix-forgot" href="#">
                      Şifremi unuttum
                    </a>
                  </div>

                  <div className="ervix-input-wrap">
                    <span className="ervix-input-icon">🔒</span>
                    <input
                      className="ervix-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="ervix-eye-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label="Şifreyi göster veya gizle"
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>

                <div className="ervix-row">
                  <label className="ervix-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Beni hatırla</span>
                  </label>

                  <span className="ervix-row-note">Yalnızca yetkili kullanıcılar</span>
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="ervix-submit"
                >
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>

                <div className="ervix-bottom-row">
                  <span>Yetkisiz erişim engellenir.</span>
                  <a href="/" className="ervix-back-link">
                    Siteye dön
                  </a>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #081120;
        }

        .ervix-login-page,
        .ervix-login-page * {
          box-sizing: border-box;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .ervix-login-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          color: #ffffff;
          background:
            radial-gradient(circle at top left, rgba(34, 211, 238, 0.12), transparent 24%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 26%),
            linear-gradient(135deg, #07111f 0%, #0a1930 35%, #0f2d57 100%);
        }

        .ervix-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 44px 44px;
          opacity: 0.18;
          pointer-events: none;
        }

        .ervix-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 100vh;
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 28px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 36px;
          align-items: center;
        }

        .ervix-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 720px;
          padding: 12px 8px 12px 8px;
        }

        .ervix-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ervix-brand-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
          color: white;
          font-size: 24px;
          font-weight: 800;
          box-shadow: 0 20px 40px rgba(34, 211, 238, 0.18);
        }

        .ervix-brand-kicker {
          font-size: 11px;
          letter-spacing: 0.36em;
          color: rgba(255, 255, 255, 0.68);
          font-weight: 700;
        }

        .ervix-brand-title {
          margin-top: 4px;
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .ervix-left-content {
          max-width: 700px;
        }

        .ervix-pill {
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          padding: 0 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #dbeafe;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(14px);
        }

        .ervix-heading {
          margin: 24px 0 0 0;
          font-size: 64px;
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          max-width: 720px;
        }

        .ervix-subtext {
          margin: 22px 0 0 0;
          max-width: 620px;
          font-size: 19px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.74);
        }

        .ervix-feature-grid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          max-width: 760px;
        }

        .ervix-feature-card {
          border-radius: 28px;
          padding: 22px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(18px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
        }

        .ervix-feature-number {
          font-size: 30px;
          font-weight: 800;
          color: #67e8f9;
        }

        .ervix-feature-title {
          margin-top: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .ervix-feature-text {
          margin-top: 8px;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
        }

        .ervix-left-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .ervix-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ervix-card {
          width: 100%;
          max-width: 540px;
          border-radius: 34px;
          padding: 34px;
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(22px);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .ervix-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .ervix-card-kicker {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.66);
          font-weight: 500;
        }

        .ervix-card-title {
          margin: 8px 0 0 0;
          font-size: 40px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .ervix-card-text {
          margin: 12px 0 0 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.72);
        }

        .ervix-shield {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.22), rgba(59, 130, 246, 0.22));
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #67e8f9;
          font-size: 18px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .ervix-form {
          margin-top: 28px;
        }

        .ervix-error {
          margin-bottom: 16px;
          border-radius: 18px;
          padding: 14px 16px;
          background: rgba(239, 68, 68, 0.14);
          border: 1px solid rgba(239, 68, 68, 0.26);
          color: #fecaca;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 600;
        }

        .ervix-field + .ervix-field {
          margin-top: 18px;
        }

        .ervix-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .ervix-label {
          display: block;
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.78);
        }

        .ervix-forgot {
          color: #93c5fd;
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
        }

        .ervix-forgot:hover {
          color: #dbeafe;
        }

        .ervix-input-wrap {
          width: 100%;
          min-height: 60px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 20px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.18s ease;
        }

        .ervix-input-wrap:focus-within {
          border-color: rgba(103, 232, 249, 0.62);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
          background: rgba(255, 255, 255, 0.08);
        }

        .ervix-input-icon {
          width: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.62);
          flex-shrink: 0;
        }

        .ervix-input {
          appearance: none;
          border: none;
          outline: none;
          box-shadow: none;
          background: transparent;
          width: 100%;
          height: 58px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
        }

        .ervix-input::placeholder {
          color: rgba(255, 255, 255, 0.34);
        }

        .ervix-eye-btn {
          appearance: none;
          border: none;
          outline: none;
          background: transparent;
          color: #93c5fd;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
        }

        .ervix-row {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .ervix-checkbox {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.78);
          cursor: pointer;
        }

        .ervix-checkbox input {
          width: 16px;
          height: 16px;
          accent-color: #22d3ee;
          cursor: pointer;
        }

        .ervix-row-note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.48);
          text-align: right;
        }

        .ervix-submit {
          appearance: none;
          border: none;
          outline: none;
          width: 100%;
          height: 60px;
          margin-top: 22px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.01em;
          color: #ffffff;
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 55%, #1d4ed8 100%);
          box-shadow: 0 20px 40px rgba(29, 78, 216, 0.26);
          transition: transform 0.18s ease, opacity 0.18s ease;
        }

        .ervix-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          opacity: 0.96;
        }

        .ervix-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .ervix-bottom-row {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.46);
        }

        .ervix-back-link {
          color: #93c5fd;
          text-decoration: none;
          font-weight: 600;
        }

        .ervix-back-link:hover {
          color: #dbeafe;
        }

        .ervix-demo-box {
          margin-top: 20px;
          border-radius: 22px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ervix-demo-title {
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .ervix-demo-line {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.74);
          word-break: break-word;
        }

        @media (max-width: 1100px) {
          .ervix-shell {
            grid-template-columns: 1fr;
            max-width: 760px;
            padding: 28px 18px;
          }

          .ervix-left {
            min-height: auto;
            padding: 0;
          }

          .ervix-left-footer {
            margin-top: 24px;
          }

          .ervix-heading {
            font-size: 48px;
          }

          .ervix-feature-grid {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .ervix-left {
            display: none;
          }

          .ervix-shell {
            padding: 18px 14px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ervix-right {
            width: 100%;
          }

          .ervix-card {
            max-width: 100%;
            padding: 24px 18px;
            border-radius: 26px;
          }

          .ervix-card-title {
            font-size: 32px;
          }

          .ervix-bottom-row,
          .ervix-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  )
}