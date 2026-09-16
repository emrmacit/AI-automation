'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCheck, ChevronLeft, MoreVertical, Send, ShieldCheck } from 'lucide-react';
import type { BusinessState } from '@/core/types';

type Message = { id: string; sender: 'business' | 'customer'; text: string; time: string };
const time = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

export default function DemoPage() {
  const [state, setState] = useState<Pick<BusinessState, 'profile' | 'hours' | 'offerings' | 'faqs'> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('Alex');
  const [contact, setContact] = useState('+31 6 1234 5678');
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { fetch('/api/public-business').then((r) => {
    if (!r.ok) throw new Error('Demo unavailable');
    return r.json();
  }).then((data: Pick<BusinessState, 'profile' | 'hours' | 'offerings' | 'faqs'>) => { setState(data); setMessages([{ id: 'welcome', sender: 'business', text: data.profile.welcomeMessage, time: time() }]); }).catch(() => setLoadError(true)); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage(text?: string) {
    const outgoing = (text ?? message).trim();
    if (!outgoing || sending) return;
    setMessage(''); setSending(true);
    setMessages((current) => [...current, { id: crypto.randomUUID(), sender: 'customer', text: outgoing, time: time() }]);
    try {
      const response = await fetch('/api/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: outgoing, customerName, contact }) });
      const body = await response.json();
      setMessages((current) => [...current, { id: crypto.randomUUID(), sender: 'business', text: response.ok ? body.reply : body.error, time: time() }]);
    } catch {
      setMessages((current) => [...current, { id: crypto.randomUUID(), sender: 'business', text: 'The demo is temporarily unavailable. Please try again.', time: time() }]);
    } finally { setSending(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void sendMessage(); }

  if (loadError) return <main className="loading-screen"><div className="load-error"><span className="eyebrow">DEMO UNAVAILABLE</span><h1>This customer preview could not be loaded.</h1><p>Please try again in a moment.</p></div></main>;
  if (!state) return <main className="loading-screen"><span className="eyebrow">PREPARING DEMO</span></main>;
  return <main className="demo-page">
    <section className="demo-copy">
      <Link href="/" className="back-link"><ArrowLeft size={16} />Back to workspace</Link>
      <span className="eyebrow">LIVE CUSTOMER PREVIEW</span>
      <h1>See the experience from your customer’s side.</h1>
      <p>This is a safe simulation, styled like a familiar messaging app. Ask about services, prices, hours or location—then submit a booking or order enquiry.</p>
      <div className="identity-fields"><label>Your name<input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></label><label>Your contact<input value={contact} onChange={(e) => setContact(e.target.value)} /></label></div>
      <div className="trust-note"><ShieldCheck size={20} /><div><strong>No fake confirmations</strong><span>The assistant records your request. The business still confirms availability, final price and payment.</span></div></div>
    </section>
    <section className="phone-wrap" aria-label="Messaging demo">
      <div className="phone">
        <div className="phone-sensor" />
        <header className="chat-header"><ChevronLeft size={22} /><span className="chat-avatar">{state.profile.name.charAt(0)}</span><div><strong>{state.profile.name}</strong><small>typically replies instantly</small></div><MoreVertical size={20} /></header>
        <div className="chat-wallpaper">
          <span className="encryption">Messages in this demo are used only to test the experience.</span>
          {messages.map((item) => <div className={`bubble ${item.sender}`} key={item.id}><span>{item.text}</span><small>{item.time}{item.sender === 'customer' && <CheckCheck size={14} />}</small></div>)}
          {sending && <div className="bubble business typing"><i /><i /><i /></div>}
          <div ref={end} />
        </div>
        <div className="suggestions"><button onClick={() => void sendMessage('What services and prices do you offer?')}>Services & prices</button><button onClick={() => void sendMessage('When are you open?')}>Opening hours</button><button onClick={() => void sendMessage('I would like to book an appointment')}>Make a request</button></div>
        <form className="chat-input" onSubmit={submit}><input aria-label="Message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" maxLength={500} /><button aria-label="Send message" disabled={!message.trim() || sending}><Send size={18} /></button></form>
        <div className="home-indicator" />
      </div>
    </section>
  </main>;
}
