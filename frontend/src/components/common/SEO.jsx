import { useEffect } from 'react';

/**
 * SEO Manager component to dynamically update document metadata.
 * Works natively in client-side React.
 */
export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    // 1. Update document title
    if (title) {
      document.title = `${title} | Transpower Technologies`;
    }

    // 2. Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 3. Update keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);

  return null;
}
