import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Facebook, Instagram, Mail, X } from 'lucide-react';
import artworks from './data/artworks.json';
import './styles.css';

const BASE_URL = import.meta.env.BASE_URL;
const siteUrl = (path) => `${BASE_URL}${path.replace(/^\/+/, '')}`;
const assetUrl = (path) => siteUrl(path);
const canonicalRoute = (path) => ({ '/peintures': '/paintings', '/apropos': '/about' })[path] || path;
const artworkList = artworks.map((item) => ({
  ...item,
  image: assetUrl(item.image),
  thumbnail: assetUrl(item.thumbnail),
}));

const copy = {
  fr: {
    nav: 'Peintures', about: 'À propos', title: 'Peintures', intro: '',
    note: 'Œuvres',
    all: 'Toutes les œuvres', details: 'Huile sur toile', close: 'Fermer', enter: 'Entrer dans la galerie',
    count: (n) => `${n} œuvres`, next: 'Œuvre suivante', previous: 'Œuvre précédente',
    aboutEyebrow: 'Biographie', aboutTitle: 'À propos', aboutDeck: 'Je peins les lieux dont je viens, pour leur rendre leur valeur.',
    aboutText: [
      'Dans une ville excentrée, une rue, un carrefour, une entrée de bâtiment, un jardin, une façade d’immeuble, des pavillons, une place de marché, un parc ou une zone désaffectée. Ces lieux sont essentiellement représentés la nuit.',
      'Ils portent des histoires, des anecdotes et des imaginaires que seules les personnes qui les pratiquent au quotidien peuvent leur conférer. Partagés collectivement, ces lieux prennent une autre envergure et s’imbriquent parmi d’autres paysages. Ils ne sont pas anonymes : ils ressemblent aux endroits que l’on fréquente déjà quand on rentre ou sort de chez soi.',
      'Tous ont un point commun : la tension. Trop longtemps dévalorisés, dénigrés, mis à distance, stéréotypés, critiqués ou présentés comme dépourvus de solutions, ils attirent artistes, poètes et sociologues. Les peindre est ma manière de leur redonner une valeur — une valeur déjà reconnue par celles et ceux qui les ont conçus ou y vivent. Depuis 2008, je révèle ces lieux au public, car j’en viens.',
    ],
    aboutPhoto: 'Portrait de Joël Degbo', aboutEnter: 'Continuer',
    aboutMeta: 'Artiste peintre · Paris',
    contactEyebrow: '', contactTitle: 'Contact',
    contactEmail: 'Écrire un e-mail',
  },
  en: {
    nav: 'Paintings', about: 'About', title: 'Paintings', intro: '',
    note: 'Selected works',
    all: 'All works', details: 'Oil on canvas', close: 'Close', enter: 'Enter the gallery',
    count: (n) => `${n} works`, next: 'Next artwork', previous: 'Previous artwork',
    aboutEyebrow: 'Biography', aboutTitle: 'About', aboutDeck: 'I paint the places I come from, to restore their value.',
    aboutText: [
      'On the outskirts of a city: a street, an intersection, a building entrance, a garden, a façade, a row of houses, a marketplace, a park or a neglected area. I mostly depict these places at night.',
      'They hold stories, anecdotes and imaginaries that only the people who know them through daily life can give them. Shared collectively, these places take on a new dimension and become part of a wider landscape. They are not anonymous: they resemble places we already know, the places we pass on our way home.',
      'They all share one thing: tension. For too long they have been devalued, disparaged, kept at a distance, stereotyped, criticized or described as beyond solutions. It is no surprise that they attract artists, poets and sociologists. Painting them is my way of restoring their value — a value already recognized by those who imagined, designed or inhabit them. Since 2008, I have brought these places into view. I come from them.',
    ],
    aboutPhoto: 'Portrait of Joël Degbo', aboutEnter: 'Continue',
    aboutMeta: 'Artist · Paris',
    contactEyebrow: 'For enquiries', contactTitle: 'Contact',
    contactEmail: 'Send an email',
  },
};

function useLocation() {
  const getRoute = useCallback(() => {
    if (BASE_URL === '/') return canonicalRoute(window.location.pathname);
    const prefix = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const pathname = window.location.pathname;
    if (pathname === prefix || pathname === `${prefix}/`) return '/';
    return canonicalRoute(pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname);
  }, []);
  const [path, setPath] = useState(getRoute);
  useEffect(() => {
    const update = () => setPath(getRoute());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, [getRoute]);
  const navigate = useCallback((to) => {
    const url = new URL(siteUrl(to), window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPath(getRoute());
    if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth' }));
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }, [getRoute]);
  return [path, navigate];
}

function Intro({ onEnter, landscapeVideo, portraitVideo, title = 'Joël Degbo', action = 'Entrer dans la galerie', index = 'Artiste peintre · Paris' }) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [portrait, setPortrait] = useState(() => window.matchMedia('(orientation: portrait)').matches);
  useEffect(() => {
    const media = window.matchMedia('(orientation: portrait)');
    const update = (event) => setPortrait(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!reducedMotion) return undefined;
    const timer = window.setTimeout(onEnter, 350);
    return () => window.clearTimeout(timer);
  }, [onEnter, reducedMotion]);
  const videoSrc = portrait ? portraitVideo : landscapeVideo;
  return <main className="intro" onClick={onEnter}>
    {!reducedMotion && <video key={videoSrc} className="intro__video" src={videoSrc} autoPlay muted playsInline preload="auto" aria-hidden="true" onEnded={onEnter} onError={onEnter}>
    </video>}
    <div className="intro__veil" />
    <h1 className="intro__name">{title}</h1>
    <button className="intro__enter" onClick={(event) => { event.stopPropagation(); onEnter(); }}>
      <span>{action}</span><ArrowDown size={16} strokeWidth={1.5} />
    </button>
    <span className="intro__index">{index}</span>
  </main>;
}

function SiteHeader({ current, lang, setLang, openPaintings, openAbout }) {
  const t = copy[lang];
  return <header className="site-header">
    <a className="wordmark" href={siteUrl('/paintings')} onClick={(e) => { e.preventDefault(); openPaintings(); }} aria-label="Joël Degbo, accueil">Joël Degbo<span>.</span></a>
    <nav className="site-nav" aria-label="Navigation principale">
      <a className={current === 'paintings' ? 'site-nav__active' : ''} href={siteUrl('/paintings')} onClick={(e) => { e.preventDefault(); openPaintings(); }}>{t.nav}</a>
      <a className={current === 'about' ? 'site-nav__active' : ''} href={siteUrl('/about')} onClick={(e) => { e.preventDefault(); openAbout(); }}>{t.about}</a>
      <button className="language" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label="Change language">{lang === 'fr' ? 'EN' : 'FR'}</button>
    </nav>
  </header>;
}

function AboutPage({ openPaintings, openAbout }) {
  const [lang, setLang] = useState('fr');
  const t = copy[lang];
  useEffect(() => { document.documentElement.lang = lang; document.title = `${t.aboutTitle} — Joël Degbo`; }, [lang, t.aboutTitle]);
  return <main className="gallery-page about-page">
    <SiteHeader current="about" lang={lang} setLang={setLang} openPaintings={openPaintings} openAbout={openAbout} />
    <section className="about-content">
      <div className="about-copy">
        <span className="eyebrow">{t.aboutEyebrow}</span>
        <h1>{t.aboutTitle}<span className="period">.</span></h1>
        <p className="about-deck">{t.aboutDeck}</p>
        <div className="about-prose">{t.aboutText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </div>
      <figure className="about-photo">
        <picture>
          <source srcSet={assetUrl('/images/joel-degbo.webp')} type="image/webp" />
          <img src={assetUrl('/images/joel-degbo.jpg')} alt="Portrait de Joël Degbo" />
        </picture>
        <figcaption>{t.aboutPhoto}</figcaption>
      </figure>
    </section>
    <section className="contact-section" aria-labelledby="contact-title">
      <div className="contact-section__heading">
        <span className="eyebrow">{t.contactEyebrow}</span>
        <h2 id="contact-title">{t.contactTitle}<span className="period">.</span></h2>
      </div>
      <div className="contact-links">
        <a href="mailto:joel.degbo@gmail.com" aria-label={`${t.contactEmail}: joel.degbo@gmail.com`}>
          <Mail size={17} strokeWidth={1.5} />
          <span>joel.degbo@gmail.com</span>
        </a>
        <a href="https://www.instagram.com/joeldegbo/" target="_blank" rel="noreferrer" aria-label="Instagram @joeldegbo">
          <Instagram size={17} strokeWidth={1.5} />
          <span>@joeldegbo</span>
        </a>
        <a href="https://www.facebook.com/degbo.joel/" target="_blank" rel="noreferrer" aria-label="Facebook Joël Degbo">
          <Facebook size={17} strokeWidth={1.5} />
          <span>Facebook</span>
        </a>
      </div>
    </section>
    <footer className="site-footer"><span>Joël Degbo</span><span>{t.aboutMeta}</span><a href={siteUrl('/paintings')} onClick={(e) => { e.preventDefault(); openPaintings(); }}>{copy[lang].nav} <ArrowRight size={14} /></a></footer>
  </main>;
}

function ArtworkModal({ item, index, onClose, onStep, lang }) {
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', handle);
    document.body.classList.add('modal-open');
    return () => { document.removeEventListener('keydown', handle); document.body.classList.remove('modal-open'); };
  }, [onClose, onStep]);
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <button className="lightbox__close icon-button" onClick={onClose} aria-label={copy[lang].close}><X /></button>
    <button className="lightbox__step lightbox__step--prev icon-button" onClick={() => onStep(-1)} aria-label={copy[lang].previous}><ArrowLeft /></button>
    <figure className="lightbox__figure">
      <img src={item.image} alt={item.title} />
      <figcaption>
      <div><h2>{lang === 'fr' ? item.title : item.titleEn}</h2><p>{[item.year, item.dimensions, item.location].filter(Boolean).join(' · ')}</p>{item.series && <p>{item.series.join(' · ')}</p>}</div>
        <span>{copy[lang].details}</span>
      </figcaption>
    </figure>
    <button className="lightbox__step lightbox__step--next icon-button" onClick={() => onStep(1)} aria-label={copy[lang].next}><ArrowRight /></button>
    <span className="lightbox__count">{String(index + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}</span>
  </div>;
}

function Gallery({ openPaintings, openAbout }) {
  const [lang, setLang] = useState('fr');
  const [selected, setSelected] = useState(-1);
  const t = copy[lang];
  const years = useMemo(() => [...new Set(artworkList.map((item) => item.year).filter(Boolean))].sort(), []);
  const [year, setYear] = useState('all');
  const shown = year === 'all' ? artworkList : artworkList.filter((item) => item.year === year);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const close = () => setSelected(-1);
  const step = (direction) => setSelected((current) => (current + direction + shown.length) % shown.length);

  return <main className="gallery-page">
    <SiteHeader current="paintings" lang={lang} setLang={setLang} openPaintings={openPaintings} openAbout={openAbout} />

    <section className="collection-intro" id="oeuvres">
      <div className="collection-intro__eyebrow"><span>{t.note}</span></div>
      <div className="collection-intro__main">
        <h1>{t.title}<span className="period">.</span></h1>
        <p>{t.intro}</p>
      </div>
      <div className="collection-intro__footer">
        <span>{t.count(shown.length)}</span>
        <label className="year-filter">
          <span className="sr-only">Filtrer par année</span>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">{t.all}</option>
            {years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
    </section>

    <section className="masonry" aria-label={t.title}>
      {shown.map((item, index) => {
        const maxWidth = Math.min(Math.max(item.width, item.height), 2600);
        const thumbWidth = Math.min(maxWidth, 1200);
        const srcSet = thumbWidth === maxWidth ? `${item.thumbnail} ${thumbWidth}w` : `${item.thumbnail} ${thumbWidth}w, ${item.image} ${maxWidth}w`;
        return <button className="artwork" key={item.id} onClick={() => setSelected(index)}>
        <span className="artwork__image-wrap"><img src={item.thumbnail} srcSet={srcSet} sizes="(max-width: 560px) calc(100vw - 36px), (max-width: 900px) 45vw, 30vw" alt={lang === 'fr' ? item.title : item.titleEn} loading={index < 6 ? 'eager' : 'lazy'} decoding="async" /></span>
        <span className="artwork__caption"><span>{lang === 'fr' ? item.title : item.titleEn}</span><span>{item.year}</span></span>
      </button>;
      })}
    </section>

    <footer className="site-footer"><span>Joël Degbo</span><span>2010 — 2026</span><a href="#oeuvres">Haut de page <ArrowUp size={14} /></a></footer>
    {selected >= 0 && <ArtworkModal item={shown[selected]} index={selected} lang={lang} onClose={close} onStep={step} />}
  </main>;
}

function App() {
  const [path, navigate] = useLocation();
  const [introDone, setIntroDone] = useState(path !== '/');
  const [paintingsIntroDone, setPaintingsIntroDone] = useState(path !== '/paintings');
  const [aboutIntroDone, setAboutIntroDone] = useState(path !== '/about');
  const enterHome = useCallback(() => { setIntroDone(true); setPaintingsIntroDone(true); navigate('/paintings'); }, [navigate]);
  const openPaintings = useCallback(() => { setPaintingsIntroDone(false); navigate('/paintings'); }, [navigate]);
  const openAbout = useCallback(() => { setAboutIntroDone(false); navigate('/about'); }, [navigate]);
  const finishPaintingsIntro = useCallback(() => setPaintingsIntroDone(true), []);
  useEffect(() => { if (path !== '/about') document.title = 'Joël Degbo — Peintures'; }, [path]);
  if (path === '/' && !introDone) return <Intro onEnter={enterHome} landscapeVideo={assetUrl('/video/home-landscape.mp4')} portraitVideo={assetUrl('/video/home-portrait.mp4')} />;
  if (path === '/about' && !aboutIntroDone) return <Intro onEnter={() => setAboutIntroDone(true)} landscapeVideo={assetUrl('/video/about-landscape.mp4')} portraitVideo={assetUrl('/video/about-portrait.mp4')} title="À propos" action={copy.fr.aboutEnter} index="Joël Degbo · Artiste peintre" />;
  if (path === '/about') return <AboutPage openPaintings={openPaintings} openAbout={openAbout} />;
  if (path === '/paintings' && !paintingsIntroDone) return <Intro onEnter={finishPaintingsIntro} landscapeVideo={assetUrl('/video/paintings-landscape.mp4')} portraitVideo={assetUrl('/video/paintings-portrait.mp4')} title="Peintures" action={copy.fr.aboutEnter} index="Joël Degbo · Artiste peintre" />;
  return <Gallery openPaintings={openPaintings} openAbout={openAbout} />;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
