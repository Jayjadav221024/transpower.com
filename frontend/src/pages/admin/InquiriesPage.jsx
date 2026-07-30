import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import { formatDate } from '../../utils/format';

const TABS = [
  { key: 'all',  label: 'All' },
  { key: 'new',  label: 'New' },
  { key: 'read', label: 'Read' },
];

export default function InquiriesPage() {
  const toast = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [newCount, setNewCount]   = useState(0);
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listInquiries(filter === 'all' ? '' : filter);
      setInquiries(res.inquiries);
      setNewCount(res.newCount);
    } catch (ex) {
      toast(ex.message, true);
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  async function toggleStatus(inquiry) {
    const next = inquiry.status === 'new' ? 'read' : 'new';
    try {
      await adminApi.setInquiryStatus(inquiry.id, next);
      setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status: next } : i)));
      setNewCount((c) => (next === 'read' ? Math.max(0, c - 1) : c + 1));
    } catch (ex) {
      toast(ex.message, true);
    }
  }

  async function remove(inquiry) {
    if (!window.confirm(`Delete the inquiry from ${inquiry.name}?`)) return;
    try {
      await adminApi.deleteInquiry(inquiry.id);
      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
      if (inquiry.status === 'new') setNewCount((c) => Math.max(0, c - 1));
      toast('Inquiry deleted');
    } catch (ex) {
      toast(ex.message, true);
    }
  }

  return (
    <section className="view">
      <header className="view-head">
        <div>
          <h1>RFQ Inquiries</h1>
          <p className="muted">
            Quote requests submitted through the contact form on the site.
            {newCount > 0 && <strong> {newCount} unread.</strong>}
          </p>
        </div>
        <div className="seg">
          {TABS.map((tab) => (
            <button
              key={tab.key} type="button"
              className={`seg-btn${filter === tab.key ? ' active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="post-list">
        {loading && <div className="empty-state">Loading inquiries…</div>}

        {!loading && inquiries.length === 0 && (
          <div className="empty-state">
            <p><strong>No inquiries here yet.</strong></p>
            <p className="muted">Submissions from the “Request a B2B Quote” form land in this list.</p>
          </div>
        )}

        {!loading && inquiries.map((i) => (
          <article className="inquiry-row" key={i.id}>
            <div className="inquiry-main">
              <div className="inquiry-head">
                <h2>{i.name}</h2>
                <span className={`pill pill-${i.status === 'new' ? 'draft' : 'tag'}`}>{i.status}</span>
                <span className="muted small">{formatDate(i.createdAt)}</span>
              </div>

              <div className="inquiry-contact">
                <a href={`mailto:${i.email}`}>{i.email}</a>
                <a href={`tel:${i.phone}`}>{i.phone}</a>
                {i.product && <span className="pill pill-tag">{i.product}</span>}
                {i.quantity && <span className="muted small">Qty: {i.quantity}</span>}
              </div>

              {i.message && <p className="inquiry-message">{i.message}</p>}
            </div>

            <div className="inquiry-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleStatus(i)}>
                Mark {i.status === 'new' ? 'read' : 'unread'}
              </button>
              <a className="btn btn-primary btn-sm" href={`mailto:${i.email}?subject=Re: your Transpower quote request`}>
                Reply
              </a>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(i)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
