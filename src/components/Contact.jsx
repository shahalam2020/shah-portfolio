import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Send, AlertCircle, Loader2 } from "lucide-react";
import "../Contactsuccess.css"; // path apne folder ke hisab se adjust karo

/* ====== yaha apni details daalo ====== */
const CONTACT_EMAIL = "shahalamx2020@gmail.com";
const GITHUB_URL = "https://github.com/shahalam2020"; // khaali chhodo to card hide rahega
const LINKEDIN_URL = "https://www.linkedin.com/in/shah-alam-9430a3420/"; // khaali chhodo to card hide rahega
const MAX_MESSAGE = 500;
/* ===================================== */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const EMPTY = { name: "", email: "", subject: "", message: "" };

/* card me dikhane ke liye link chhota: https://www.x.com/abc/ -> x.com/abc */
const prettyUrl = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/* confetti: fixed values (random nahi) taaki re-render pe change na ho */
const CONFETTI_COLORS = ["#2ee6a0", "#22a6ff", "#ffd166", "#ff6b9d", "#ffffff"];
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const dist = 90 + (i % 3) * 32;
  return {
    "--x": `${Math.round(Math.cos(angle) * dist)}px`,
    "--y": `${Math.round(Math.sin(angle) * dist)}px`,
    "--r": `${(i % 2 ? 1 : -1) * (180 + i * 23)}deg`,
    "--c": CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

const TITLE = "Message sent!";

function GithubIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* GitHub / LinkedIn jaisa koi bhi social card */
function SocialCard({ href, label, icon: Icon }) {
  return (
    <a className="cf-card" href={href} target="_blank" rel="noreferrer noopener">
      <span className="cf-card-icon">
        <Icon />
      </span>
      <span className="cf-card-text">
        <small>{label}</small>
        <b>{prettyUrl(href)}</b>
      </span>
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState({ name: "", email: "" }); // success screen ke liye

  const formRef = useRef(null);
  const successRef = useRef(null);
  const honeypotRef = useRef(null);

  /* ---------- 3D tilt (form ya success card, jo bhi dikh raha ho) ---------- */
  const handleMove = (e) => {
    const el = formRef.current || successRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 5}deg`);
    el.style.setProperty("--rx", `${-y * 5}deg`);
  };

  const handleLeave = () => {
    const el = formRef.current || successRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  /* ---------- form ---------- */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (status !== "sending" && status !== "idle") setStatus("idle");
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // honeypot: bots ye hidden field bhar dete hain
    if (honeypotRef.current && honeypotRef.current.value) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setErrorMsg(
        "EmailJS keys nahi mili. .env file check karo aur dev server restart karo."
      );
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          subject: form.subject.trim() || "New message from portfolio",
          message: form.message.trim(),
        },
        { publicKey: PUBLIC_KEY }
      );
      setSent({
        name: form.name.trim().split(/\s+/)[0],
        email: form.email.trim(),
      });
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(
        err?.text || "Message send nahi hua. Internet check karke dobara try karo."
      );
    }
  };

  return (
    <section id="contact" className="contact container">
      <div className="cf-grid">
        {/* ---------- left: text + info cards ---------- */}
        <div className="cf-info">
          <div className="section-label">04 — Contact</div>
          <h2>
            Let's build something
            <br />
            <span>great together.</span>
          </h2>
          <p>
            Have a project, opportunity or idea? I'd love to hear about it.
            Send a message and it lands straight in my inbox.
          </p>

          <div className="cf-cards">
            <a className="cf-card" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="cf-card-icon">
                <Mail size={20} />
              </span>
              <span className="cf-card-text">
                <small>Email</small>
                <b>{CONTACT_EMAIL}</b>
              </span>
            </a>

            {GITHUB_URL && (
              <SocialCard href={GITHUB_URL} label="GitHub" icon={GithubIcon} />
            )}

            {LINKEDIN_URL && (
              <SocialCard href={LINKEDIN_URL} label="LinkedIn" icon={LinkedinIcon} />
            )}
          </div>
        </div>

        {/* ---------- right: form  ->  success card ---------- */}
        <div
          className="cf-form-wrap"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          {status === "success" ? (
            <div
              className="cf-success"
              ref={successRef}
              role="status"
              aria-live="polite"
            >
              <Send className="cf-plane" size={28} aria-hidden="true" />

              <div className="cf-badge-wrap" aria-hidden="true">
                <span className="cf-ring" />
                <span className="cf-ring" />
                <span className="cf-ring" />
                <div className="cf-badge">
                  <svg className="cf-check" viewBox="0 0 48 48">
                    <path d="M12 25 L21 34 L37 15" />
                  </svg>
                </div>
                {CONFETTI.map((style, i) => (
                  <span key={i} className="cf-piece" style={style} />
                ))}
              </div>

              <h3 className="cf-success-title" aria-label={TITLE}>
                {TITLE.split("").map((ch, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{ animationDelay: `${0.7 + i * 0.045}s` }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </h3>

              <p className="cf-success-text">
                {sent.name ? `Thanks, ${sent.name}. ` : "Thanks. "}
                Your message is in my inbox. I'll reply to <b>{sent.email}</b>{" "}
                soon.
              </p>

              <div className="cf-success-eta">
                <i aria-hidden="true" />
                Usually within 24 hours
              </div>

              <button
                type="button"
                className="cf-again"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="cf-form" ref={formRef} onSubmit={sendEmail}>
              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-name">
                  Name
                </label>
                <input
                  id="cf-name"
                  className="cf-input"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-email">
                  Email
                </label>
                <input
                  id="cf-email"
                  className="cf-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-subject">
                  Subject (optional)
                </label>
                <input
                  id="cf-subject"
                  className="cf-input"
                  type="text"
                  name="subject"
                  placeholder="Project inquiry"
                  value={form.subject}
                  onChange={onChange}
                  maxLength={120}
                />
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="cf-message">
                  Message
                </label>
                <div className="cf-textarea-wrap">
                  <textarea
                    id="cf-message"
                    className="cf-input"
                    name="message"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={onChange}
                    maxLength={MAX_MESSAGE}
                    required
                  />
                  <span className="cf-count">
                    {form.message.length}/{MAX_MESSAGE}
                  </span>
                </div>
              </div>

              {/* honeypot (hidden) */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                className="cf-hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {status === "error" && (
                <div className="cf-status cf-err" role="alert">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="cf-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    Sending <Loader2 size={18} className="cf-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}