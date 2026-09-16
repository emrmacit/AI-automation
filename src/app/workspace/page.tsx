'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, ChevronRight, CircleAlert, Database, Plus, Save, Trash2 } from 'lucide-react';
import { BUSINESS_CATEGORIES, type BusinessState, type Faq, type Offering } from '@/core/types';

type Section = 'overview' | 'business' | 'hours' | 'offerings' | 'answers';
const sections: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' }, { id: 'business', label: 'Business' },
  { id: 'hours', label: 'Hours' }, { id: 'offerings', label: 'Offerings' }, { id: 'answers', label: 'Quick answers' },
];

export default function Dashboard() {
  const [state, setState] = useState<BusinessState | null>(null);
  const [section, setSection] = useState<Section>('overview');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => { fetch('/api/business').then((r) => {
    if (!r.ok) throw new Error('Workspace unavailable');
    return r.json();
  }).then(setState).catch(() => setLoadError(true)); }, []);
  const readiness = useMemo(() => {
    if (!state) return 0;
    return [state.profile.name, state.profile.address, state.hours.some((h) => h.isOpen), state.offerings.length > 0, state.faqs.length > 0].filter(Boolean).length * 20;
  }, [state]);

  function updateProfile(field: keyof BusinessState['profile'], value: string) {
    setState((current) => current ? { ...current, profile: { ...current.profile, [field]: value } } : current);
  }
  function updateOffering(id: string, field: keyof Offering, value: string | number | boolean | null) {
    setState((current) => current ? { ...current, offerings: current.offerings.map((item) => item.id === id ? { ...item, [field]: value } : item) } : current);
  }
  function addOffering() {
    const item: Offering = { id: crypto.randomUUID(), name: 'New offering', category: 'General', description: '', price: 0, durationMinutes: null, isAvailable: true };
    setState((current) => current ? { ...current, offerings: [...current.offerings, item] } : current);
  }
  function addFaq() {
    const item: Faq = { id: crypto.randomUUID(), question: 'New customer question', answer: 'Add the answer your assistant should use.' };
    setState((current) => current ? { ...current, faqs: [...current.faqs, item] } : current);
  }
  async function save() {
    if (!state) return;
    setSaving(true); setNotice('');
    try {
      const response = await fetch('/api/business', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: state.profile, hours: state.hours, offerings: state.offerings, faqs: state.faqs }) });
      const body = await response.json();
      if (response.ok) { setState(body); setNotice('Saved. Your demo now uses these details.'); }
      else setNotice(body.error ?? 'Could not save changes.');
    } catch { setNotice('Could not reach the server. Your changes are still visible here but were not saved.'); }
    finally { setSaving(false); }
  }

  if (loadError) return <main className="loading-screen"><div className="load-error"><span className="eyebrow">WORKSPACE UNAVAILABLE</span><h1>We could not load your business data.</h1><p>Check your Google Sheets configuration, then refresh the page.</p></div></main>;
  if (!state) return <main className="loading-screen"><span className="eyebrow">LOADING WORKSPACE</span></main>;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand"><span className="brand-mark">E</span><span>Enqivo</span></Link>
        <div className="business-switcher"><span className="avatar">{state.profile.name.charAt(0)}</span><div><strong>{state.profile.name}</strong><small>{state.profile.category}</small></div><ChevronRight size={16} /></div>
        <nav>{sections.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>{item.label}</button>)}</nav>
        <div className="sidebar-note"><Database size={16} /><div><strong>{state.storage === 'google-sheets' ? 'Google Sheets connected' : 'Demo storage'}</strong><small>{state.storage === 'google-sheets' ? 'Changes sync automatically.' : 'Connect Sheets before launch.'}</small></div></div>
      </aside>

      <main className="workspace">
        <header className="topbar"><div><span className="eyebrow">BUSINESS WORKSPACE</span><h1>{sections.find((item) => item.id === section)?.label}</h1></div><div className="top-actions"><Link className="button secondary" href="/demo" target="_blank">Open customer demo <ArrowUpRight size={16} /></Link><button className="button primary" onClick={save} disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save changes'}</button></div></header>
        {notice && <div className="notice"><Check size={16} />{notice}</div>}

        {section === 'overview' && <div className="overview-grid">
          <section className="hero-card"><span className="eyebrow">YOUR CUSTOMER ASSISTANT</span><h2>Turn everyday questions into clear, actionable requests.</h2><p>Your public demo answers from the information below. It never confirms a booking, price or payment that your business has not approved.</p><Link className="text-link" href="/demo" target="_blank">Try the customer experience <ArrowUpRight size={16} /></Link></section>
          <section className="readiness card"><div className="section-heading"><div><span className="eyebrow">SETUP</span><h3>{readiness}% ready</h3></div><span className="score">{readiness}</span></div><div className="progress"><span style={{ width: `${readiness}%` }} /></div><p>Complete your profile, opening hours, offerings and common answers before sharing the demo.</p></section>
          <section className="card recent"><div className="section-heading"><div><span className="eyebrow">RECENT REQUESTS</span><h3>What needs attention</h3></div><span className="count">{state.leads.length}</span></div>{state.leads.length ? state.leads.slice(0, 5).map((lead) => <article key={lead.id}><span className="lead-dot" /><div><strong>{lead.customerName}</strong><p>{lead.summary}</p><small>{lead.intent} · {new Date(lead.createdAt).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><span className="status">NEW</span></article>) : <p>No requests yet. Open the demo and submit one.</p>}</section>
          <section className="card next-step"><CircleAlert size={20} /><div><strong>Before you go live</strong><p>Add authentication, connect one Google Sheet per business and complete the WhatsApp provider verification.</p></div></section>
        </div>}

        {section === 'business' && <section className="form-card"><div className="section-heading"><div><span className="eyebrow">FOUNDATION</span><h2>Business details</h2><p>These details are the assistant’s source of truth.</p></div></div><div className="form-grid">
          <label>Business name<input value={state.profile.name} onChange={(e) => updateProfile('name', e.target.value)} /></label>
          <label>Business type<select value={state.profile.category} onChange={(e) => updateProfile('category', e.target.value)}>{BUSINESS_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="wide">Address<input value={state.profile.address} onChange={(e) => updateProfile('address', e.target.value)} /></label>
          <label>Public phone<input value={state.profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} /></label>
          <label>Currency<input value={state.profile.currency} maxLength={3} onChange={(e) => updateProfile('currency', e.target.value.toUpperCase())} /></label>
          <label className="wide">Welcome message<textarea value={state.profile.welcomeMessage} onChange={(e) => updateProfile('welcomeMessage', e.target.value)} /></label>
        </div></section>}

        {section === 'hours' && <section className="form-card"><div className="section-heading"><div><span className="eyebrow">AVAILABILITY</span><h2>Opening hours</h2><p>Keep this simple and current. Customers will see exactly what is entered here.</p></div></div><div className="hours-list">{state.hours.map((hour, index) => <div className="hour-row" key={hour.day}><strong>{hour.day}</strong><label className="toggle"><input type="checkbox" checked={hour.isOpen} onChange={(e) => setState({ ...state, hours: state.hours.map((item, i) => i === index ? { ...item, isOpen: e.target.checked } : item) })} /><span /></label>{hour.isOpen ? <><input type="time" value={hour.opensAt} onChange={(e) => setState({ ...state, hours: state.hours.map((item, i) => i === index ? { ...item, opensAt: e.target.value } : item) })} /><span>to</span><input type="time" value={hour.closesAt} onChange={(e) => setState({ ...state, hours: state.hours.map((item, i) => i === index ? { ...item, closesAt: e.target.value } : item) })} /></> : <em>Closed</em>}</div>)}</div></section>}

        {section === 'offerings' && <section className="form-card"><div className="section-heading"><div><span className="eyebrow">CATALOGUE</span><h2>Services & products</h2><p>Use plain names and final customer-facing prices.</p></div><button className="button secondary" onClick={addOffering}><Plus size={16} />Add offering</button></div><div className="item-list">{state.offerings.map((item) => <article className="editable-item" key={item.id}><div className="item-main"><label>Name<input value={item.name} onChange={(e) => updateOffering(item.id, 'name', e.target.value)} /></label><label>Category<input value={item.category} onChange={(e) => updateOffering(item.id, 'category', e.target.value)} /></label><label className="grow">Description<input value={item.description} onChange={(e) => updateOffering(item.id, 'description', e.target.value)} /></label></div><div className="item-meta"><label>Price<input type="number" min="0" step="0.01" value={item.price} onChange={(e) => updateOffering(item.id, 'price', Number(e.target.value))} /></label><label>Minutes<input type="number" min="1" value={item.durationMinutes ?? ''} onChange={(e) => updateOffering(item.id, 'durationMinutes', e.target.value ? Number(e.target.value) : null)} /></label><label className="available"><input type="checkbox" checked={item.isAvailable} onChange={(e) => updateOffering(item.id, 'isAvailable', e.target.checked)} />Available</label><button className="icon-button" aria-label={`Remove ${item.name}`} onClick={() => setState({ ...state, offerings: state.offerings.filter((o) => o.id !== item.id) })}><Trash2 size={17} /></button></div></article>)}</div></section>}

        {section === 'answers' && <section className="form-card"><div className="section-heading"><div><span className="eyebrow">TRUSTED ANSWERS</span><h2>Common customer questions</h2><p>The demo matches customer questions to these approved answers.</p></div><button className="button secondary" onClick={addFaq}><Plus size={16} />Add answer</button></div><div className="faq-list">{state.faqs.map((faq, index) => <article key={faq.id}><label>Question<input value={faq.question} onChange={(e) => setState({ ...state, faqs: state.faqs.map((item, i) => i === index ? { ...item, question: e.target.value } : item) })} /></label><label>Approved answer<textarea value={faq.answer} onChange={(e) => setState({ ...state, faqs: state.faqs.map((item, i) => i === index ? { ...item, answer: e.target.value } : item) })} /></label><button className="icon-button" aria-label={`Remove ${faq.question}`} onClick={() => setState({ ...state, faqs: state.faqs.filter((item) => item.id !== faq.id) })}><Trash2 size={17} /></button></article>)}</div></section>}
      </main>
    </div>
  );
}
