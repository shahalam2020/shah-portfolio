/**
 * Contact form delivery. Tries every configured channel:
 *   firebase → saves to Firestore `messages` (visible in /admin)
 *   api      → POST {API}/contact
 *   emailjs  → sends the email straight to your inbox (public key only)
 * If nothing is configured it falls back to opening the visitor's mail app.
 */
import axios from 'axios';
import { env } from '../config/env';
import { site } from '../config/site';
import { api } from './api';
import { getFirebase, fsdk } from './firebase';

const LAST_SENT = 'portfolio-contact-last';

const sendFirebase = async (p) => {
  const { db } = await getFirebase();
  const { addDoc, collection, serverTimestamp } = await fsdk();
  await addDoc(collection(db, 'messages'), {
    name: p.name, email: p.email, subject: p.subject || '', message: p.message, read: false, createdAt: serverTimestamp(),
  });
};

const sendApi = (p) => api.post('/contact', { name: p.name, email: p.email, subject: p.subject, message: p.message });

const sendEmailJs = (p) =>
  axios.post('https://api.emailjs.com/api/v1.0/email/send', {
    service_id: env.emailjs.serviceId,
    template_id: env.emailjs.templateId,
    user_id: env.emailjs.publicKey,
    template_params: {
      from_name: p.name, from_email: p.email, reply_to: p.email,
      subject: p.subject || `New message from ${p.name}`, message: p.message, to_email: site.email,
    },
  });

export async function sendMessage(payload) {
  if (payload.website) return { ok: true, channel: 'honeypot' }; // bots fill the hidden field

  const last = Number((() => { try { return localStorage.getItem(LAST_SENT); } catch { return 0; } })() || 0);
  if (Date.now() - last < 30000) {
    throw new Error('You just sent a message — please wait a few seconds before sending another.');
  }

  const jobs = [];
  if (env.backend === 'firebase') jobs.push(['firebase', sendFirebase(payload)]);
  if (env.backend === 'api') jobs.push(['api', sendApi(payload)]);
  if (env.emailjsReady) jobs.push(['emailjs', sendEmailJs(payload)]);

  if (jobs.length === 0) {
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
    const subject = encodeURIComponent(payload.subject || `Portfolio message from ${payload.name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    return { ok: true, channel: 'mailto' };
  }

  const results = await Promise.allSettled(jobs.map(([, p]) => p));
  const okIndex = results.findIndex((r) => r.status === 'fulfilled');
  if (okIndex === -1) {
    const reason = results[0].reason;
    throw new Error(reason?.message || 'Your message could not be sent. Please email me directly instead.');
  }
  try { localStorage.setItem(LAST_SENT, String(Date.now())); } catch { /* ignore */ }
  return { ok: true, channel: jobs[okIndex][0] };
}
