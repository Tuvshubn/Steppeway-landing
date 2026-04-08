import { useState, useEffect } from 'react';
import './index.css';
import { getHero, getAbout, getTours, getContact, sendMessage, getImageUrl } from './api';

const TOURS_PER_PAGE = 3;

const t = {
  mn: {
    nav: ['Нүүр', 'Бидний тухай', 'Аяллууд', 'Холбоо барих'],
    badge: 'Аялалын туршлага',
    heroBtn1: 'Аяллууд харах', heroBtn2: 'Холбоо барих',
    aboutLabel: 'Бидний тухай', toursLabel: 'Аяллууд', toursTitle: 'Онцлох аяллууд',
    contactLabel: 'Холбоо барих', contactTitle: 'Бидэнтэй холбогдох',
    name: 'Нэр', email: 'Имэйл', phone: 'Утас', message: 'Мессеж',
    send: 'Илгээх', sending: 'Илгээж байна...', sent: 'Амжилттай илгээлээ!',
    phone_l: 'Утас', email_l: 'Имэйл', address_l: 'Хаяг', follow: 'Сүлжээ',
    footer: '© 2026 Steppeway. Бүх эрх хуулиар хамгаалагдсан.',
    years: 'Жил', clients: 'Жуулчид', tours_s: 'Аяллууд',
    bookNow: 'Захиалах', viewDetail: 'Дэлгэрэнгүй →',
    duration: 'Хугацаа', price: 'Үнэ',
    close: 'Хаах', book: 'Захиалга өгөх',
    prev: '← Өмнөх', next: 'Дараах →',
    scroll: 'Гүйлгэх',
    noTours: 'Аялал байхгүй байна',
  },
  en: {
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
    bookNow: 'Book Now', viewDetail: 'View Details →',
    duration: 'Duration', price: 'Price',
    close: 'Close', book: 'Book This Tour',
    prev: '← Previous', next: 'Next →',
    scroll: 'Scroll',
    noTours: 'No tours available',
  }
};

// Tour Detail Modal
function TourModal({ tour, lang, T, onClose, onBook }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-img">
          {tour.image_url
            ? <img src={getImageUrl(tour.image_url)} alt={tour.title_mn} />
            : <div className="modal-img-placeholder">🌄</div>
          }
        </div>
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-title">{lang === 'mn' ? tour.title_mn : tour.title_en}</div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-meta">
            <div className="modal-meta-item">
              <span>⏱</span>
              <span><strong>{T.duration}:</strong> {lang === 'mn' ? tour.duration_mn : tour.duration_en}</span>
            </div>
            <div className="modal-meta-item">
              <span>💰</span>
              <span><strong>{T.price}:</strong> <span style={{color:'var(--accent)',fontWeight:700}}>{tour.price}</span></span>
            </div>
          </div>
          <div className="modal-desc">{lang === 'mn' ? tour.description_mn : tour.description_en}</div>
          <div className="modal-actions">
            {/*<button className="btn-primary" onClick={onBook}>{T.book}</button>*/}
            <button className="btn-outline" onClick={onClose} style={{color:'var(--dark)',borderColor:'var(--border)'}}>{T.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('mn');
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
  const T = t[lang];

  useEffect(() => {
    getHero().then(r => setHero(r.data)).catch(() => {});
    getAbout().then(r => setAbout(r.data)).catch(() => {});
    getTours().then(r => setTours(r.data)).catch(() => {});
    getContact().then(r => setContact(r.data)).catch(() => {});
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormState('sending');
    try {
      await sendMessage(form);
      setFormState('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
      showToast(T.sent);
      setTimeout(() => setFormState('idle'), 3000);
    } catch { setFormState('idle'); }
  };

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const openBooking = () => { setSelectedTour(null); scrollTo('contact'); };

  // Pagination
  const totalPages = Math.ceil(tours.length / TOURS_PER_PAGE);
  const pagedTours = tours.slice((page - 1) * TOURS_PER_PAGE, page * TOURS_PER_PAGE);

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">Step<span>peway</span></div>
        <div className="nav-links">
          {['hero','about','tours','contact'].map((id, i) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{T.nav[i]}</a>
          ))}
          <button className="lang-btn" onClick={() => setLang(l => l === 'mn' ? 'en' : 'mn')}>
            {lang === 'mn' ? 'EN' : 'МН'}
          </button>
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {['hero','about','tours','contact'].map((id, i) => (
          <a key={id} onClick={() => scrollTo(id)}>{T.nav[i]}</a>
        ))}
        <button className="lang-btn" onClick={() => setLang(l => l === 'mn' ? 'en' : 'mn')}>
          {lang === 'mn' ? 'English' : 'Монгол'}
        </button>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-media">
          {hero?.media_url ? (
            hero.media_type === 'video'
              ? <video src={getImageUrl(hero.media_url)} autoPlay muted loop playsInline />
              : <img src={getImageUrl(hero.media_url)} alt="hero" />
          ) : (
            <div className="hero-media-placeholder" />
          )}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✦ {T.badge}</div>
          <h1 className="hero-title">
            {hero ? (lang === 'mn' ? hero.title_mn : hero.title_en) : <>Монголыг<br /><em>Биечлэн Мэдэр</em></>}
          </h1>
          <p className="hero-sub">
            {hero ? (lang === 'mn' ? hero.subtitle_mn : hero.subtitle_en) : ''}
          </p>
          <div className="hero-btns">
            <a className="btn-primary" onClick={() => scrollTo('tours')} href="#tours">{T.heroBtn1}</a>
            <a className="btn-outline" onClick={() => scrollTo('contact')} href="#contact">{T.heroBtn2}</a>
          </div>
        </div>
        <div className="hero-scroll">{T.scroll}</div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              {about?.image_url
                ? <img src={getImageUrl(about.image_url)} alt="about" />
                : <div className="about-img-placeholder">🏔</div>
              }
            </div>
            <div className="about-text">
              <div className="section-eyebrow">✦ {T.aboutLabel}</div>
              <h2 className="section-title">{about ? (lang === 'mn' ? about.title_mn : about.title_en) : 'Steppeway'}</h2>
              <p>{about ? (lang === 'mn' ? about.content_mn : about.content_en) : ''}</p>
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
              <h2 className="section-title" style={{marginBottom:0}}>{T.toursTitle}</h2>
            </div>
          </div>

          {!tours.length ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <>
              <div className="tours-grid">
                {pagedTours.map(tour => (
                  <div className="tour-card" key={tour.id} onClick={() => setSelectedTour(tour)}>
                    <div className="tour-img">
                      {tour.image_url
                        ? <img src={getImageUrl(tour.image_url)} alt={tour.title_mn} />
                        : <div className="tour-img-placeholder">🌄</div>
                      }
                      <div className="tour-price-tag">{tour.price}</div>
                    </div>
                    <div className="tour-body">
                      <div className="tour-title">{lang === 'mn' ? tour.title_mn : tour.title_en}</div>
                      <div className="tour-desc">{lang === 'mn' ? tour.description_mn : tour.description_en}</div>
                      <div className="tour-footer">
                        <span className="tour-duration">⏱ {lang === 'mn' ? tour.duration_mn : tour.duration_en}</span>
                        <button className="tour-detail-btn">{T.viewDetail}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
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
              {contact?.address_mn && <div className="contact-item"><span className="contact-icon">📍</span><div><div className="contact-label">{T.address_l}</div><div className="contact-val">{lang === 'mn' ? contact.address_mn : contact.address_en}</div></div></div>}
              {(contact?.facebook || contact?.instagram) && (
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <div className="contact-label">{T.follow}</div>
                    <div style={{display:'flex',gap:'1rem',marginTop:'0.4rem'}}>
                      {contact.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" style={{color:'var(--accent)',fontWeight:500,textDecoration:'none'}}>Facebook</a>}
                      {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" style={{color:'var(--accent)',fontWeight:500,textDecoration:'none'}}>Instagram</a>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>{T.name} *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
                <div className="form-group"><label>{T.phone}</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} /></div>
              </div>
              <div className="form-group"><label>{T.email}</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></div>
              <div className="form-group"><label>{T.message} *</label><textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required /></div>
              <button type="submit" className="btn-primary" disabled={formState==='sending'} style={{width:'100%',justifyContent:'center'}}>
                {formState === 'sending' ? T.sending : T.send}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

      {/* TOUR DETAIL MODAL */}
      {selectedTour && (
        <TourModal
          tour={selectedTour}
          lang={lang}
          T={T}
          onClose={() => setSelectedTour(null)}
          onBook={() => { setSelectedTour(null); scrollTo('contact'); }}
        />
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}
