import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock3, MessageCircle, Sheet, Store, WandSparkles } from 'lucide-react';

const useCases = [
  ['Beauty & wellness', 'Turn service questions into appointment requests.'],
  ['Barbers & salons', 'Share prices, hours and availability without stopping work.'],
  ['Restaurants & retail', 'Show the current menu or catalogue and capture enquiries.'],
  ['Real estate', 'Answer property questions and collect viewing requests.'],
];

export default function LandingPage() {
  return <main className="landing">
    <nav className="landing-nav">
      <Link href="/" className="landing-brand"><span>R</span>Relay</Link>
      <div className="landing-links"><a href="#how-it-works">How it works</a><a href="#built-for">Who it’s for</a><Link href="/workspace">Workspace</Link></div>
      <Link href="/demo" className="nav-cta">Try the demo <ArrowUpRight size={15} /></Link>
    </nav>

    <section className="landing-hero">
      <div className="hero-copy">
        <span className="landing-kicker">CUSTOMER REQUESTS, MADE MANAGEABLE</span>
        <h1>Your business keeps moving. Customer enquiries should too.</h1>
        <p>Relay answers routine questions with information you approve, then turns serious interest into a clear request you can follow up—without pretending a booking or payment is confirmed.</p>
        <div className="hero-actions"><Link className="landing-button dark" href="/demo">Try the customer demo <ArrowRight size={17} /></Link><Link className="landing-button light" href="/workspace">Open the automation <ArrowUpRight size={17} /></Link></div>
        <div className="hero-trust"><span><Check size={14} />No invented prices</span><span><Check size={14} />Google Sheets ready</span><span><Check size={14} />Built for small teams</span></div>
      </div>
      <div className="product-scene" aria-label="Relay product preview">
        <div className="scene-orbit" />
        <div className="mini-phone">
          <div className="mini-phone-top"><span>NF</span><div><strong>North & Finch</strong><small>Customer assistant</small></div></div>
          <div className="mini-thread"><p className="from-customer">What services do you offer?</p><p className="from-relay">Signature haircut — €48<br />Colour refresh — €82<br />Brow shape — €24</p><p className="from-customer">I’d like to book Friday afternoon.</p><p className="from-relay">I’ve saved your request. The team will confirm the details.</p></div>
        </div>
        <div className="request-card"><span className="request-label">NEW REQUEST</span><strong>Friday haircut enquiry</strong><small>Alex · Demo conversation</small><div><span>Ready to follow up</span><Check size={14} /></div></div>
      </div>
    </section>

    <section className="statement-band"><p>Not another bloated CRM.</p><strong>Just the customer information your business needs, in a workflow people already understand.</strong></section>

    <section className="landing-section" id="how-it-works">
      <div className="section-intro"><span className="landing-kicker">HOW RELAY WORKS</span><h2>From first question to a useful next step.</h2><p>Your business stays in control. Relay uses the information you enter—nothing more.</p></div>
      <div className="steps-grid">
        <article><span className="step-number">01</span><MessageCircle /><h3>Answer clearly</h3><p>Customers get approved prices, opening hours, location and common answers in a familiar chat experience.</p></article>
        <article><span className="step-number">02</span><WandSparkles /><h3>Capture intent</h3><p>When someone wants to book, buy or arrange a viewing, Relay turns the message into a structured request.</p></article>
        <article><span className="step-number">03</span><Sheet /><h3>Keep the record</h3><p>Business details and incoming requests can live in a dedicated Google Sheet that is easy to review and update.</p></article>
      </div>
    </section>

    <section className="workspace-callout">
      <div><span className="landing-kicker">ONE SIMPLE WORKSPACE</span><h2>Set it up without becoming a software expert.</h2><p>Add the business name, address and opening hours. Enter services or products with current prices. Approve the answers customers should receive. The demo updates from the same source.</p><Link className="landing-button coral" href="/workspace">Go to the automation system <ArrowRight size={17} /></Link></div>
      <div className="workspace-preview">
        <div className="preview-sidebar"><span className="preview-logo">R</span><i /><i /><i /><i /></div>
        <div className="preview-body"><div className="preview-heading"><div><small>BUSINESS WORKSPACE</small><strong>Overview</strong></div><span>Save changes</span></div><div className="preview-panels"><div className="preview-main"><small>YOUR CUSTOMER ASSISTANT</small><strong>Turn everyday questions into clear, actionable requests.</strong></div><div className="preview-score"><small>SETUP</small><strong>100%</strong><i /></div></div></div>
      </div>
    </section>

    <section className="landing-section use-cases" id="built-for">
      <div className="section-intro"><span className="landing-kicker">BUILT FOR INDEPENDENT BUSINESS</span><h2>One core job. Adapted to the way you work.</h2></div>
      <div className="use-case-grid">{useCases.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={19} /></article>)}</div>
    </section>

    <section className="proof-section">
      <div><Clock3 /><span><strong>Less interruption</strong><small>Routine questions do not have to stop the work in front of you.</small></span></div>
      <div><Store /><span><strong>Your facts, your control</strong><small>Prices and answers come from business information you manage.</small></span></div>
      <div><Sheet /><span><strong>A record you can use</strong><small>Qualified requests are captured for a real human follow-up.</small></span></div>
    </section>

    <section className="final-cta"><span className="landing-kicker">SEE IT FROM THE CUSTOMER’S SIDE</span><h2>Try a real conversation before you change a thing.</h2><p>Ask about prices. Check the opening hours. Submit a request. Then open the workspace to see how the business controls the experience.</p><div><Link className="landing-button cream" href="/demo">Launch the live demo <ArrowRight size={17} /></Link><Link className="final-link" href="/workspace">Explore the workspace</Link></div></section>

    <footer className="landing-footer">
      <Link href="/" className="landing-brand"><span>R</span>Relay</Link>
      <p className="footer-credit">Designed &amp; built by <a href="https://emremacit.com" target="_blank" rel="noopener noreferrer">Emre Macit</a></p>
      <div><Link href="/demo">Demo</Link><Link href="/workspace">Workspace</Link></div>
    </footer>
  </main>;
}
