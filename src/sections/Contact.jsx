import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Github, Linkedin, Loader2, Mail, MapPin, Send, AlertTriangle } from 'lucide-react';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { site } from '../config/site';
import { validateContact } from '../utils/validators';
import { sendMessage } from '../services/contactService';

const initial = { name: '', email: '', subject: '', message: '', website: '' };
const MAX = 500;

const info = [
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: Github, label: 'GitHub', value: site.socials.github.replace('https://', ''), href: site.socials.github, external: true },
  { icon: Linkedin, label: 'LinkedIn', value: 'Connect with me', href: site.socials.linkedin, external: true },
  { icon: MapPin, label: 'Location', value: site.location },
];

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-red-500 dark:text-red-400">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    const v = e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const blur = (k) => () => setErrors((s) => ({ ...s, [k]: validateContact(values)[k] }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`c-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus('loading');
    setServerError('');
    try {
      await sendMessage(values);
      setStatus('success');
      setValues(initial);
    } catch (err) {
      setServerError(err.message);
      setStatus('error');
    }
  };

  const field = (k) => ({ id: `c-${k}`, name: k, value: values[k], onChange: set(k), onBlur: blur(k), className: 'input', 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `c-${k}-error` : undefined });

  return (
    <section id="contact" aria-labelledby="contact-title" className="section overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 animate-pulse-dot rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[5%] right-[6%] h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="chip mb-4"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />{site.availability}</span>
            <h2 id="contact-title" className="text-4xl font-bold leading-[1.05] sm:text-5xl">Let’s Build Something Great Together.</h2>
            <p className="mt-5 max-w-md text-muted sm:text-lg">Have a project, a role or just a question? Send a message — I reply personally, usually within a day.</p>
          </Reveal>

          <ul className="mt-10 grid gap-3">
            {info.map((c, i) => {
              const Inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary-ink"><c.icon size={19} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{c.label}</span>
                    <span className="block truncate text-sm font-medium">{c.value}</span>
                  </span>
                </>
              );
              return (
                <Reveal as="li" key={c.label} delay={i * 0.06}>
                  {c.href ? (
                    <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="card beam flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5">{Inner}</a>
                  ) : (
                    <div className="card flex items-center gap-4 rounded-2xl p-4">{Inner}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <TiltCard max={3} scale={1} className="card p-6 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid min-h-[420px] place-items-center text-center" role="status">
                  <div>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400">
                      <CheckCircle2 size={40} aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-bold">Message sent</h3>
                    <p className="mx-auto mt-2 max-w-xs text-muted">Thanks for reaching out — I’ll get back to you soon.</p>
                    <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus('idle')}>Send another message</button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5" aria-label="Contact form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="c-name" label="Name" error={errors.name}><input {...field('name')} type="text" autoComplete="name" placeholder="Your name" /></Field>
                    <Field id="c-email" label="Email" error={errors.email}><input {...field('email')} type="email" autoComplete="email" placeholder="you@example.com" /></Field>
                  </div>
                  <Field id="c-subject" label="Subject" optional error={errors.subject}><input {...field('subject')} type="text" placeholder="What is this about?" /></Field>
                  <Field id="c-message" label="Message" error={errors.message}>
                    <textarea {...field('message')} rows={6} maxLength={MAX + 50} placeholder="Tell me about your project or idea…" className="input resize-y" />
                    <p className={`mt-1 text-right font-mono text-xs ${values.message.length > MAX ? 'text-red-500' : 'text-muted'}`}>{values.message.length}/{MAX}</p>
                  </Field>

                  {/* honeypot — hidden from people, bots fill it */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <p>{serverError} You can also email me at <a className="font-semibold underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full sm:w-auto sm:justify-self-end">
                    {status === 'loading' ? (<><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…</>) : (<><Send size={17} aria-hidden="true" /> Send Message</>)}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
