import { useState, useEffect } from 'react';
import './index.css';
import { getHero, getAbout, getTours, getContact, sendMessage, getImageUrl, getTourDays, getTestimonials } from './api';

const TOURS_PER_PAGE = 6;

const DIFFICULTY_COLOR = {
  Easy: '#22c55e', Moderate: '#f59e0b', Challenging: '#ef4444', Expert: '#8b5cf6',
};

// Static testimonials (admin-ийн testimonial feature нэмэхэд dynamic болгоно)
const TESTIMONIALS = [
  { stars: 5, text: '"An absolutely life-changing experience. The vast steppe, the horses, the hospitality of Mongolian families — nothing compares."', name: 'Sarah M.', country: '🇺🇸 United States', initials: 'SM' },
  { stars: 5, text: '"Steppeway organized everything flawlessly. Our guide was knowledgeable and the itinerary was perfect. Highly recommend!"', name: 'Thomas K.', country: '🇩🇪 Germany', initials: 'TK' },
  { stars: 5, text: '"Mongolia exceeded every expectation. The Gobi Desert sunset was unlike anything I have ever seen. Thank you Steppeway!"', name: 'Yuki T.', country: '🇯🇵 Japan', initials: 'YT' },
];

// ─── Tour Detail Modal ──────────────────────────────
function TourDetailModal({ tour, onClose, onBook }) {
  const [tab, setTab] = useState('overview');
  const [days, setDays] = useState([]);
  const [daysLoading, setDaysLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    getTourDays(tour.id)
      .then(r => setDays(r.data))
      .catch(() => {})
      .finally(() => setDaysLoading(false));
    return () => { document.body.style.overflow = ''; };
  }, [tour.id]);

  const title = tour.title_en || tour.title_mn;
  const desc = tour.description_en || tour.description_mn;
  const duration = tour.duration_en || tour.duration_mn;
  const highlights = tour.highlights
    ? (typeof tour.highlights === 'string' ? tour.highlights.split('\n').filter(Boolean) : tour.highlights)
    : [];
  const included = tour.included
    ? (typeof tour.included === 'string' ? tour.included.split('\n').filter(Boolean) : tour.included)
    : [];
  const notIncluded = tour.not_included
    ? (typeof tour.not_included === 'string' ? tour.not_included.split('\n').filter(Boolean) : tour.not_included)
    : [];

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal">

        {/* Hero */}
        <div className="detail-hero">
          {tour.image_url
            ? <img src={getImageUrl(tour.image_url)} alt={title} />
            : <div className="detail-hero-placeholder">🌄</div>}
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
                <span className="detail-difficulty" style={{ background: (DIFFICULTY_COLOR[tour.difficulty] || '#64748b') + '22', color: DIFFICULTY_COLOR[tour.difficulty] || '#64748b' }}>
                  ● {tour.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price bar */}
        <div className="detail-price-bar">
          <div>
            <span className="detail-price-from">From</span>
            <span className="detail-price">{tour.price}</span>
            <span className="detail-price-per">per person</span>
          </div>
          <button className="btn-book-detail" onClick={onBook}>📩 Book This Tour</button>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {['overview', 'highlights', 'itinerary'].map(t => (
            <button key={t} className={`detail-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'overview' ? 'Overview' : t === 'highlights' ? 'Highlights' : 'Itinerary'}
            </button>
          ))}
        </div>

        <div className="detail-body">
          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <p className="detail-desc">{desc}</p>
              {(included.length > 0 || notIncluded.length > 0) && (
                <div className="detail-included-grid">
                  {included.length > 0 && (
                    <div>
                      <div className="detail-section-title">✅ What's Included</div>
                      <ul className="detail-list included">
                        {included.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {notIncluded.length > 0 && (
                    <div>
                      <div className="detail-section-title">❌ Not Included</div>
                      <ul className="detail-list not-included">
                        {notIncluded.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Highlights */}
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
              ) : <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Highlights coming soon.</p>}
            </div>
          )}

          {/* Itinerary — from DB days */}
          {tab === 'itinerary' && (
            <div>
              {daysLoading ? (
                <div className="loading"><div className="spinner" /></div>
              ) : days.length > 0 ? (
                <div>
                  {days.map(day => (
                    <div key={day.id} className="itinerary-day-full">
                      <div className="itinerary-day-header">
                        <div className="itinerary-day-num">Day {day.day_number}</div>
                        {day.title_en && <div className="itinerary-day-title">{day.title_en}</div>}
                      </div>
                      {day.description_en && <p className="itinerary-day-desc">{day.description_en}</p>}
                      {day.images?.length > 0 && (
                        <div className="itinerary-day-images">
                          {day.images.map(img => (
                            <div key={img.id} className="itinerary-img-wrap">
                              <img src={getImageUrl(img.image_url)} alt={img.caption || ''} />
                              {img.caption && <div className="itinerary-img-caption">{img.caption}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                  Detailed itinerary will be available soon.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getHero().then(r => setHero(r.data)).catch(() => {});
    getAbout().then(r => setAbout(r.data)).catch(() => {});
    getTours().then(r => setTours(r.data)).catch(() => {});
    getContact().then(r => setContact(r.data)).catch(() => {});
    getTestimonials().then(r => setTestimonials(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  const handleSubmit = async e => {
    e.preventDefault(); setFormState('sending');
    try {
      await sendMessage(form);
      setFormState('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
      showToast('Your message has been sent!');
      setTimeout(() => setFormState('idle'), 3000);
    } catch { setFormState('idle'); }
  };

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Tour filters
  const types = ['All', ...new Set(tours.map(t => t.tour_type).filter(Boolean))];
  const filtered = filter === 'All' ? tours : tours.filter(t => t.tour_type === filter);
  const totalPages = Math.ceil(filtered.length / TOURS_PER_PAGE);
  const pagedTours = filtered.slice((page - 1) * TOURS_PER_PAGE, page * TOURS_PER_PAGE);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About Us', id: 'about' },
    { label: 'Tours', id: 'tours' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact Us', id: 'contact' },
  ];

  return (
    <>
      {/* ── NAV ── */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <span className="nav-logo" onClick={() => scrollTo('hero')}>
          Step<span>peway</span>
        </span>
        <div className="nav-links">
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <span className="nav-cta" onClick={() => scrollTo('contact')}>Book a Tour</span>
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU (4Season style right drawer) ── */}
      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-top">
          <span className="mobile-menu-logo">Step<span>peway</span></span>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <nav className="mobile-nav-links">
          {navItems.map(item => (
            <a key={item.id} className="mobile-nav-link" onClick={() => scrollTo(item.id)}>
              {item.label}
              <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
                <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </a>
          ))}
        </nav>
        <div className="mobile-menu-contact">
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="mobile-contact-row">
              <span className="ico">✉️</span>
              <span>{contact.email}</span>
            </a>
          )}
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className="mobile-contact-row">
              <span className="ico">📞</span>
              <span>{contact.phone}</span>
            </a>
          )}
          <div className="mobile-social-row">
            {contact?.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" className="mobile-social-btn">f</a>}
            {contact?.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" className="mobile-social-btn">📷</a>}
          </div>
        </div>
        <div className="mobile-cta-bar">
          <button className="mobile-cta-btn" onClick={() => scrollTo('contact')}>
            📞 {contact?.phone || 'Get In Touch'}
          </button>
        </div>
      </div>

      {/* ── HERO ── */}
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
          <div className="hero-badge">✦ Travel Experience</div>
          <h1>
            {hero
              ? (hero.title_en || hero.title_mn)?.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <em key={i}>{word}</em> : <span key={i}>{word} </span>
                )
              : <>Experience<br /><em>Mongolia</em></>
            }
          </h1>
          <p className="hero-sub">
            {hero?.subtitle_en || hero?.subtitle_mn || 'Discover the vast steppes, ancient culture, and breathtaking landscapes of Mongolia with our expert-guided tours.'}
          </p>
          <div className="hero-btns">
            <span className="btn-primary" onClick={() => scrollTo('tours')}>Explore Tours</span>
            <span className="btn-outline" onClick={() => scrollTo('contact')}>Contact Us</span>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">14+</div>
            <div className="hero-stat-lbl">Years</div>
          </div>
          <div>
            <div className="hero-stat-num">500+</div>
            <div className="hero-stat-lbl">Travelers</div>
          </div>
          <div>
            <div className="hero-stat-num">30+</div>
            <div className="hero-stat-lbl">Tours</div>
          </div>
        </div>
      </section>

      {/* ── WHY US STRIP ── */}
      <div className="why-strip">
        <div className="why-grid">
          {[
            { icon: '🏕', title: 'Expert Local Guides', desc: 'Native guides with deep knowledge of Mongolian culture and terrain' },
            { icon: '🛡', title: 'Safety First', desc: 'All tours fully insured with 24/7 emergency support' },
            { icon: '✈', title: 'Airport Transfers', desc: 'Seamless pick-up and drop-off from Ulaanbaatar airport' },
            { icon: '🐎', title: 'Authentic Experiences', desc: 'Stay in traditional gers and ride horses across the steppe' },
          ].map((item, i) => (
            <div key={i} className="why-item">
              <span className="why-icon">{item.icon}</span>
              <div className="why-title">{item.title}</div>
              <div className="why-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              {about?.image_url
                ? <img src={getImageUrl(about.image_url)} alt="about" />
                : <div className="about-img-placeholder">🏔</div>}
              <div className="about-img-badge">
                <span className="num">14</span>
                <span className="lbl">Years of Excellence</span>
              </div>
            </div>
            <div className="about-text">
              <span className="eyebrow">About Us</span>
              <h2 className="section-title">{about ? (about.title_en || about.title_mn) : 'Mongolia\'s Premier Travel Company'}</h2>
              <p>{about ? (about.content_en || about.content_mn) : 'We specialize in creating unforgettable journeys through Mongolia\'s pristine wilderness, connecting travelers with the country\'s rich nomadic heritage.'}</p>
              <div className="about-stats">
                <div><div className="stat-num">14+</div><div className="stat-label">Years</div></div>
                <div><div className="stat-num">500+</div><div className="stat-label">Travelers</div></div>
                <div><div className="stat-num">30+</div><div className="stat-label">Tours</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOURS ── */}
      <section className="tours-section" id="tours">
        <div className="container">
          <div className="tours-header">
            <div>
              <span className="eyebrow">Our Tours</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Tours</h2>
            </div>
          </div>

          {types.length > 1 && (
            <div className="tour-filters">
              {types.map(type => (
                <button
                  key={type}
                  className={`filter-btn${filter === type ? ' active' : ''}`}
                  onClick={() => { setFilter(type); setPage(1); }}
                >{type}</button>
              ))}
            </div>
          )}

          {tours.length === 0 ? (
            <div className="tours-empty">
              <div className="tours-empty-icon">🗺</div>
              <div className="tours-empty-title">Tours Coming Soon</div>
              <div className="tours-empty-sub">We are preparing exciting tours for you. Check back soon or contact us for custom tours.</div>
              <span className="btn-primary" style={{display:'inline-flex',marginTop:'1.5rem',cursor:'pointer'}} onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Contact Us</span>
            </div>
          ) : (
            <>
              <div className="tours-grid">
                {pagedTours.map(tour => {
                  const daysMatch = (tour.duration_en || tour.duration_mn || '').match(/\d+/);
                  return (
                    <div className="tour-card" key={tour.id}>
                      <div className="tour-img" onClick={() => setSelectedTour(tour)}>
                        {tour.image_url
                          ? <img src={getImageUrl(tour.image_url)} alt={tour.title_en || tour.title_mn} />
                          : <div className="tour-img-placeholder">🌄</div>}
                        {tour.tour_type && <div className="tour-type-badge">{tour.tour_type}</div>}
                      </div>
                      <div className="tour-body">
                        <div className="tour-tags">
                          {daysMatch && (
                            <span className="tour-tag days-tag">🗓 {daysMatch[0]} Days</span>
                          )}
                          {tour.difficulty && (
                            <span className="tour-tag diff-tag" style={{ background: (DIFFICULTY_COLOR[tour.difficulty] || '#64748b') + '15', color: DIFFICULTY_COLOR[tour.difficulty] || '#64748b' }}>
                              {tour.difficulty}
                            </span>
                          )}
                          {tour.season && <span className="tour-tag season-tag">📅 {tour.season}</span>}
                        </div>
                        <div className="tour-title" onClick={() => setSelectedTour(tour)}>
                          {tour.title_en || tour.title_mn}
                        </div>
                        <div className="tour-desc">
                          {tour.description_en || tour.description_mn}
                        </div>
                        {(tour.group_size) && (
                          <div className="tour-meta-row">
                            {tour.group_size && <span className="tour-meta-item">👥 {tour.group_size}</span>}
                          </div>
                        )}
                        <div className="tour-footer">
                          <div className="tour-price-wrap">
                            <span className="tour-price-from">From</span>
                            <div className="tour-price">{tour.price}</div>
                          </div>
                          <div className="tour-actions">
                            <button className="tour-detail-btn" onClick={() => setSelectedTour(tour)}>Details</button>
                            <button className="tour-book-btn" onClick={() => scrollTo('contact')}>Book Now</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="eyebrow">What Our Travelers Say</span>
            <h2 className="section-title">Real Experiences,<br />Real Stories</h2>
          </div>
          {testimonials.length === 0 ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="testi-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="testi-card">
                  <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.author_name?.[0]?.toUpperCase() || '?'}</div>
                    <div>
                      <div className="testi-name">{t.author_name}</div>
                      {t.country && <div className="testi-country">{t.country}</div>}
                      {t.tour_name && <div className="testi-country" style={{color:'var(--green-mid)',fontWeight:600}}>✦ {t.tour_name}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <div className="container">
          <span className="eyebrow">Contact Us</span>
          <h2 className="section-title">Plan Your Journey</h2>
          <div className="contact-grid">
            <div className="contact-info">
              {contact?.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-val">{contact.phone}</div>
                  </div>
                </div>
              )}
              {contact?.email && (
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-val">{contact.email}</div>
                  </div>
                </div>
              )}
              {(contact?.address_en || contact?.address_mn) && (
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <div className="contact-label">Address</div>
                    <div className="contact-val">{contact.address_en || contact.address_mn}</div>
                  </div>
                </div>
              )}
              {(contact?.facebook || contact?.instagram) && (
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <div className="contact-label">Follow Us</div>
                    <div className="contact-socials">
                      {contact.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" className="social-btn">f</a>}
                      {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" className="social-btn">📷</a>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input placeholder="+1 234 567 890" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Your Message *</label>
                <textarea placeholder="Tell us about your dream Mongolia trip..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-submit" disabled={formState === 'sending'}>
                {formState === 'sending' ? 'Sending...' : formState === 'sent' ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">Step<span>peway</span></div>
          <div className="footer-links">
            {navItems.map(item => (
              <a key={item.id} href={`#${item.id}`} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>{item.label}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Steppeway Travel. All rights reserved.</div>
          <div className="footer-copy">Designed with ♥ for Mongolia</div>
        </div>
      </footer>

      {/* ── TOUR DETAIL MODAL ── */}
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
