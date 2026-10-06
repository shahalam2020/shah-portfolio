import { useEffect } from 'react';
import { site } from '../config/site';

const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
};

export default function useSEO({ title, description, path = '/', image, type = 'website', noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : site.seo.title;
    const desc = description || site.seo.description;
    const url = `${site.url.replace(/\/$/, '')}${path}`;
    const img = `${site.url.replace(/\/$/, '')}${image || site.ogImage}`;
    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
  }, [title, description, path, image, type, noindex]);
}
