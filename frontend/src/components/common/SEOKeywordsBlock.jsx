import { useState, useEffect } from 'react';
import { publicApi } from '../../api/client';

export default function SEOKeywordsBlock({ placement }) {
  const [text, setText] = useState(null);

  useEffect(() => {
    let alive = true;
    publicApi.getPageContent('keyword_stuffing')
      .then((res) => {
        if (!alive) return;
        if (res?.content?.generatedText) {
          const isEnabled = res.content.placement 
            ? res.content.placement[placement] 
            : (placement === 'footer' ? res.content.enabled !== false : false);
          
          if (isEnabled) {
            setText(res.content.generatedText);
          }
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [placement]);

  if (!text) return null;

  // Render a clean section block for general page sections
  return (
    <section className="section seo-keywords-section" style={{ background: '#f8fafc', padding: '3rem 1.5rem', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.6', textAlign: 'justify' }}>
          <strong>Product Distribution &amp; Regional Coverage:</strong> {text}
        </div>
      </div>
    </section>
  );
}
