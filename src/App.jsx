import { useState, useEffect } from 'react';
import './index.css';
import { getHero, getAbout, getTours, getContact, sendMessage, getImageUrl } from './api';

const TOURS_PER_PAGE = 6;

const T = {
  nav: ['Home', 'About', 'Tours', 'Contact'],
  badge: 'Travel Experience',
  heroBtn1: 'Explore Tours', heroBtn2: 'Contact Us',
  aboutLabel: 'About Us', toursLabel: 'Tours', toursTitle: 'Featured Tours',
  contactLabel: 'Contact', contactTitle: 'Get In Touch',
  name: 'Name', email: 'Email', phone: 'Phone', message: 'Message',
  send: 'Send Message', sending: 'Sending...', sent: 'Message sent!',
  phone_l: 'Phone', email_l: 'Email', address_l: 'Address', follow: 'Social',
  footer: '© 2026 Steppeway. All rights reserved.',
  years: 'Years', clients: 'Travelers', tours_s: 'Tours',
  bookNow: 'Book Now', viewDetail: 'View Details',
  duration: 'Duration', price: 'Price', groupSize: 'Group Size',
  difficulty: 'Difficulty', season: 'Best Season',
  close: 'Close', book: 'Book This Tour',
  prev: '← Prev', next: 'Next →',
  noTours: 'No tours available',
  highlights: 'Highlights', itinerary: 'Itinerary', overview: 'Overview',
  day: 'Day', included: "What's Included", notIncluded: "Not Included",
  from: 'From',
  allTours: 'All Tours',
  filterAll: 'All', filterAdventure: 'Adventure', filterCultural: 'Cultural',
  filterNature: 'Nature', filterWildlife: 'Wildlife',
  perPerson: 'per person',
};

const DIFFICULTY_COLOR = {
  Easy: '#22c55e', Moderate: '#f59e0b', Challenging: '#ef4444', Expert: '#8b5cf6',
};

function TourDetailModal({ tour, onClose, onBook }) {
  const [tab, setTab] = useState('overview');
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const title = tour.title_en || tour.title_mn;
  const desc = tour.description_en || tour.description_mn;
  const duration = tour.duration_en || tour.duration_mn;
  const highlights = tour.highlights ? (typeof tour.highlights === 'string' ? tour.highlights.split('\n').filter(Boolean) : tour.highlights) : [];
  const itinerary = tour.itinerary ? (typeof tour.itinerary === 'string' ? tour.itinerary.split('\n').filter(Boolean) : tour.itinerary) : [];
  const included = tour.included ? (typeof tour.included === 'string' ? tour.included.split('\n').filter(Boolean) : tour.included) : [];
  const notIncluded = tour.not_included ? (typeof tour.not_included === 'string' ? tour.not_included.split('\n').filter(Boolean) : tour.not_included) : [];

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal">
        {/* Header image */}
        <div className="detail-hero">
          {tour.image_url
            ? <img src={getImageUrl(tour.image_url)} alt={title} />
            : <div className="detail-hero-placeholder">🌄</div>
          }
          <div className="detail-hero-overlay" />
          <button className="detail-close" onClick={onClose}>✕</button>
          <div className="detail-hero-content">
            {tour.tour_type && <span className="detail-type-badge">{tour.tour_type}</span>}
            <h2 className="detail-title">{title}</h2>
            <div className="detail-meta-row">
              {duration && <span>⏱ {duration}</span>}
              {tour.group_size && <span>👥 {tour.group_size}</span>}
              {tour.season && <span>📅 {tour.season}</span>}
              {tour.difficulty && (
                <span className="detail-difficulty" style={{ background: DIFFICULTY_COLOR[tour.difficulty] + '33', color: DIFFICULTY_COLOR[tour.difficulty] }}>
                  ● {tour.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price bar */}
        <div className="detail-price-bar">
          <div>
            <span className="detail-price-from">{T.from}</span>
            <span className="detail-price">{tour.price}</span>
            <span className="detail-price-per">{T.perPerson}</span>
          </div>
          <button className="btn-book-detail" onClick={onBook}>📩 {T.book}</button>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {['overview', 'highlights', 'itinerary'].map(t => (
            <button key={t} className={`detail-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'overview' ? T.overview : t === 'highlights' ? T.highlights : T.itinerary}
            </button>
          ))}
        </div>

        <div className="detail-body">
          {tab === 'overview' && (
            <div className="detail-overview">
              <p className="detail-desc">{desc}</p>
              {(included.length > 0 || notIncluded.length > 0) && (
                <div className="detail-included-grid">
                  {included.length > 0 && (
                    <div>
                      <div className="detail-section-title">✅ {T.included}</div>
                      <ul className="detail-list included">
                        {included.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {notIncluded.length > 0 && (
                    <div>
                      <div className="detail-section-title">❌ {T.notIncluded}</div>
                      <ul className="detail-list not-included">
                        {notIncluded.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {tab === 'highlights' && (
            <div>
              {highlights.length > 0 ? (
                <div className="highlights-grid">
                  {highlights.map((h, i) => (
                    <div key={i} className="highlight-item">
                      <span className="highlight-icon">✦</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--muted)' }}>No highlights added yet.</p>}
            </div>
          )}
          {tab === 'itinerary' && (
            <div>
              {itinerary.length > 0 ? (
                <div className="itinerary-list">
                  {itinerary.map((item, i) => (
                    <div key={i} className="itinerary-day">
                      <div className="itinerary-day-num">{T.day} {i + 1}</div>
                      <div className="itinerary-day-text">{item}</div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--muted)' }}>No itinerary added yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [tours, setTours] = useState([]);
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formState, setFormState] = useState('idle');
  const [toast, setToast] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getHero().then(r => setHero(r.data)).catch(() => {});
    getAbout().then(r => setAbout(r.data)).catch(() => {});
    getTours().then(r => setTours(r.data)).catch(() => {});
    getContact().then(r => setContact(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormState('sending');
    try {
      await sendMessage(form); setFormState('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
      showToast(T.sent); setTimeout(() => setFormState('idle'), 3000);
    } catch { setFormState('idle'); }
  };

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  // Filter tours
  const TYPES = ['All', ...new Set(tours.map(t => t.tour_type).filter(Boolean))];
  const filtered = filter === 'All' ? tours : tours.filter(t => t.tour_type === filter);
  const totalPages = Math.ceil(filtered.length / TOURS_PER_PAGE);
  const pagedTours = filtered.slice((page - 1) * TOURS_PER_PAGE, page * TOURS_PER_PAGE);

  const handleFilter = (f) => { setFilter(f); setPage(1); };

  return (
    <>
      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
          Step<span>peway</span>
        </div>
        <div className="nav-links">
          {['hero', 'about', 'tours', 'contact'].map((id, i) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{T.nav[i]}</a>
          ))}
        </div>
        <div className="nav-right">
          <a className="nav-book-btn" onClick={() => scrollTo('contact')} href="#contact">{T.bookNow}</a>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU — half screen drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="nav-logo">Step<span>peway</span></div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="mobile-menu-links">
          {['hero', 'about', 'tours', 'contact'].map((id, i) => (
            <a key={id} onClick={() => scrollTo(id)}>{T.nav[i]}</a>
          ))}
          <a className="mobile-book-btn" onClick={() => scrollTo('contact')}>{T.bookNow}</a>
        </div>
      </div>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-media">
          {hero?.media_url ? (
            hero.media_type === 'video'
              ? <video src={getImageUrl(hero.media_url)} autoPlay muted loop playsInline />
              : <img src={getImageUrl(hero.media_url)} alt="hero" />
          ) : <div className="hero-media-placeholder" />}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✦ {T.badge}</div>
          <h1 className="hero-title">
            {hero ? hero.title_en || hero.title_mn : <>Experience<br /><em>Mongolia</em></>}
          </h1>
          <p className="hero-sub">{hero ? hero.subtitle_en || hero.subtitle_mn : ''}</p>
          <div className="hero-btns">
            <a className="btn-primary" onClick={() => scrollTo('tours')} href="#tours">{T.heroBtn1}</a>
            <a className="btn-outline" onClick={() => scrollTo('contact')} href="#contact">{T.heroBtn2}</a>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              {about?.image_url
                ? <img src={getImageUrl(about.image_url)} alt="about" />
                : <div className="about-img-placeholder">🏔</div>}
            </div>
            <div className="about-text">
              <div className="section-eyebrow">✦ {T.aboutLabel}</div>
              <h2 className="section-title">{about ? about.title_en || about.title_mn : 'Steppeway'}</h2>
              <p>{about ? about.content_en || about.content_mn : ''}</p>
              <div className="about-stats">
                <div><div className="stat-num">14+</div><div className="stat-label">{T.years}</div></div>
                <div><div className="stat-num">500+</div><div className="stat-label">{T.clients}</div></div>
                <div><div className="stat-num">30+</div><div className="stat-label">{T.tours_s}</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOURS */}
      <section className="tours-section" id="tours">
        <div className="container">
          <div className="tours-header">
            <div>
              <div className="section-eyebrow">✦ {T.toursLabel}</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>{T.toursTitle}</h2>
            </div>
          </div>

          {/* Filter tabs */}
          {TYPES.length > 1 && (
            <div className="tour-filters">
              {TYPES.map(type => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? 'active' : ''}`}
                  onClick={() => handleFilter(type)}
                >{type}</button>
              ))}
            </div>
          )}

          {!tours.length ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <>
              <div className="tours-grid">
                {pagedTours.map(tour => (
                  <div className="tour-card" key={tour.id}>
                    <div className="tour-img" onClick={() => setSelectedTour(tour)}>
                      {tour.image_url
                        ? <img src={getImageUrl(tour.image_url)} alt={tour.title_en || tour.title_mn} />
                        : <div className="tour-img-placeholder">🌄</div>}
                      {tour.tour_type && <div className="tour-type-badge">{tour.tour_type}</div>}
                    </div>
                    <div className="tour-body">
                      <div className="tour-tags">
                        {tour.difficulty && (
                          <span className="tour-tag" style={{ background: (DIFFICULTY_COLOR[tour.difficulty] || '#64748b') + '18', color: DIFFICULTY_COLOR[tour.difficulty] || '#64748b' }}>
                            {tour.difficulty}
                          </span>
                        )}
                        {tour.season && <span className="tour-tag season">📅 {tour.season}</span>}
                      </div>
                      <div className="tour-title" onClick={() => setSelectedTour(tour)}>
                        {tour.title_en || tour.title_mn}
                      </div>
                      <div className="tour-desc">{tour.description_en || tour.description_mn}</div>
                      <div className="tour-info-row">
                        {(tour.duration_en || tour.duration_mn) && (
                          <span className="tour-info-item">⏱ {tour.duration_en || tour.duration_mn}</span>
                        )}
                        {tour.group_size && (
                          <span className="tour-info-item">👥 {tour.group_size}</span>
                        )}
                      </div>
                      <div className="tour-footer">
                        <div className="tour-price-wrap">
                          <span className="tour-price-from">{T.from}</span>
                          <span className="tour-price">{tour.price}</span>
                        </div>
                        <div className="tour-actions">
                          <button className="tour-detail-btn" onClick={() => setSelectedTour(tour)}>{T.viewDetail}</button>
                          <button className="tour-book-btn" onClick={() => { setSelectedTour(null); scrollTo('contact'); }}>
                            {T.bookNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-eyebrow">✦ {T.contactLabel}</div>
          <h2 className="section-title">{T.contactTitle}</h2>
          <div className="contact-grid">
            <div className="contact-info">
              {contact?.phone && <div className="contact-item"><span className="contact-icon">📞</span><div><div className="contact-label">{T.phone_l}</div><div className="contact-val">{contact.phone}</div></div></div>}
              {contact?.email && <div className="contact-item"><span className="contact-icon">✉️</span><div><div className="contact-label">{T.email_l}</div><div className="contact-val">{contact.email}</div></div></div>}
              {contact?.address_en && <div className="contact-item"><span className="contact-icon">📍</span><div><div className="contact-label">{T.address_l}</div><div className="contact-val">{contact.address_en}</div></div></div>}
              {(contact?.facebook || contact?.instagram) && (
                <div className="contact-item"><span className="contact-icon">🌐</span>
                  <div><div className="contact-label">{T.follow}</div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                      {contact.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Facebook</a>}
                      {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Instagram</a>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>{T.name} *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div className="form-group"><label>{T.phone}</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label>{T.email}</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-group"><label>{T.message} *</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required /></div>
              <button type="submit" className="btn-primary" disabled={formState === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
                {formState === 'sending' ? T.sending : T.send}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">Step<span>peway</span></div>
          <div className="footer-socials">
            {contact?.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer">Facebook</a>}
            {contact?.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer">Instagram</a>}
          </div>
          <div className="footer-text">{T.footer}</div>
        </div>
      </footer>

      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBook={() => { setSelectedTour(null); scrollTo('contact'); }}
        />
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}
