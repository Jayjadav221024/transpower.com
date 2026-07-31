import { useEffect } from 'react';
import { SITE_ORIGIN, absoluteUrl } from '../../config/site';

/**
 * SEO Manager component to dynamically update document metadata.
 * Works natively in client-side React.
 *
 * Handles title, description, keywords, canonical URL, Open Graph / Twitter
 * cards and JSON-LD structured data. Tags this component owns are marked with
 * data-seo="managed" so they can be torn down on unmount without disturbing the
 * static tags that ship in index.html.
 */

const MANAGED = 'data-seo';

/* Upsert a <meta> tag, creating it only if index.html doesn't already have one. */
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, 'managed');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEO({
  title,
  description,
  keywords,
  /* Site-relative path, e.g. "/locations/vadodara". Omit to skip the canonical. */
  canonical,
  image = '/assets/images/hero_frp_grating.webp',
  type = 'website',
  noindex = false,
  /* A schema.org object, or an array of them — each emitted as its own script. */
  jsonLd,
}) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Transpower Technologies`;
    }

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    const canonicalUrl = canonical ? absoluteUrl(canonical) : null;
    if (canonicalUrl) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute(MANAGED, 'managed');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    const imageUrl = image?.startsWith('http') ? image : `${SITE_ORIGIN}${image}`;
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:title', title ? `${title} | Transpower Technologies` : null);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:site_name', 'Transpower Technologies Pvt. Ltd.');
    if (canonicalUrl) setMeta('property', 'og:url', canonicalUrl);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    /* Structured data is fully replaced on every render — stale schema from a
       previously visited route would otherwise describe the wrong page. */
    const blocks = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean);
    const scripts = blocks.map((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED, 'jsonld');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
      return script;
    });

    return () => scripts.forEach((s) => s.remove());
  }, [title, description, keywords, canonical, image, type, noindex, JSON.stringify(jsonLd)]);

  return null;
}
