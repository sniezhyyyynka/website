import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

// --- KOMPONENT GRIDITEM ---
const GridItem = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Standaryzacja źródła obrazów
  const images = useMemo(() => {
    if (item.images) return item.images;
    if (item.img) return Array.isArray(item.img) ? item.img : [item.img];
    return [];
  }, [item.images, item.img]);

  const hasMultipleImages = images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentSrc = images.length > 0 ? images[currentImageIndex] : null;

  return (
    <div 
      className={`grid-item 
        ${!currentSrc ? 'placeholder-item' : ''} 
        ${item.isTransparent ? 'adaptive-bg' : ''}
        ${item.isWide ? 'wide-item' : ''}
        ${!item.isTransparent && currentSrc ? 'full-photo' : ''}
      `}
    >
      {currentSrc ? (
        <>
          <img src={currentSrc} alt={item.title} />
          {hasMultipleImages && (
            <>
              <button className="slider-arrow left" onClick={prevImage}>&lt;</button>
              <button className="slider-arrow right" onClick={nextImage}>&gt;</button>
            </>
          )}
          <div className="item-overlay">
            <h3>{item.title}</h3>
            <span className="item-category">
              {Array.isArray(item.category) ? item.category.join(', ') : item.category}
            </span>
            {hasMultipleImages && (
              <span className="image-counter">
                {currentImageIndex + 1} / {images.length}
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="text-placeholder">
          <h3>{item.title}</h3>
          <p>Brak podglądu</p>
        </div>
      )}
    </div>
  );
};

// --- GŁÓWNY KOMPONENT APP ---
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState('All');
  const [scrollRotation, setScrollRotation] = useState(0);

  // Refs do kursora
  const mainCursor = useRef(null);
  const trail1 = useRef(null);
  const trail2 = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const trail1X = useRef(0); // Dodano brakujące refs do pozycji
  const trail1Y = useRef(0);
  const trail2X = useRef(0);
  const trail2Y = useRef(0);

  // Link kontaktowy
  const contactLink = "https://docs.google.com/forms/d/e/1FAIpQLSe3PFAr-GSdsjJQtr71f4Gi-vOkSmNVJq7wrHTVyAZCD9ra5g/viewform?usp=dialog";

  // --- EFEKT: LOGIKA KURSORA I SCROLLA ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (mainCursor.current) {
        mainCursor.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleScroll = () => {
      setScrollRotation(window.scrollY / 5);
    };

    // Logika animacji ogona kursora
    const animateTrail = () => {
      const speed = 0.15;
      
      trail1X.current += (mouseX.current - trail1X.current) * speed;
      trail1Y.current += (mouseY.current - trail1Y.current) * speed;
      
      trail2X.current += (trail1X.current - trail2X.current) * speed;
      trail2Y.current += (trail1Y.current - trail2Y.current) * speed;

      if (trail1.current && trail2.current) {
        trail1.current.style.transform = `translate3d(${trail1X.current}px, ${trail1Y.current}px, 0) translate(-50%, -50%)`;
        trail2.current.style.transform = `translate3d(${trail2X.current}px, ${trail2Y.current}px, 0) translate(-50%, -50%)`;
      }
      
      requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    const animId = requestAnimationFrame(animateTrail);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- DANE ---
  const portfolioItems = [
    { id: 1, title: '2D Vector Graffiti', category: 'Calligraphy', img: 'img/antszkol.png', isTransparent: true },
    { id: 2, title: 'Fashion Campaign', category: ['Branding', 'Logo'], img: 'img/kith_graffiti.png', isTransparent: true },
    { id: 3, title: '3D logo render', category: ['Logo', '3D'], img: 'img/KITH_graphic.png', isTransparent: false, isWide: true },
    { id: 4, title: 'Japanese Calligraphy', category: ['Calligraphy', '3D'], img: 'img/mechatok_wax.png', isTransparent: false },
    { id: 5, title: 'Kith brand identity', category: 'Branding', img: 'img/kith_graffiti2.png', isTransparent: true },
    { id: 6, title: 'Music Video Teaser', category: ['Calligraphy', 'Logo', 'Branding'], images: ['img/sex_pistols.png'], isTransparent: true },
    { id: 7, title: 'Behind The Scenes', category: 'Calligraphy', images: ['img/sex_pistols.png', 'img/sex_pistols2.png'], isTransparent: true }
  ];

  const filters = ['All', 'Logo', 'Video', 'Calligraphy', 'Branding', '3D'];

  // --- FILTROWANIE ---
  const filteredItems = useMemo(() => {
    const baseFiltered = portfolioItems.filter(item => {
      if (filter === 'All') return true;
      const categories = Array.isArray(item.category) ? item.category : [item.category];
      return categories.some(cat => cat.toLowerCase() === filter.toLowerCase());
    });
    return baseFiltered;
  }, [filter, portfolioItems]); // Dodano dependency portfolioItems

  // --- RENDEROWANIE STRONY (To musi być na końcu funkcji App) ---
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Kursory */}
      <div className="custom-cursor main-cursor" ref={mainCursor}></div>
      <div className="custom-cursor trail-cursor trail-1" ref={trail1}></div>
      <div className="custom-cursor trail-cursor trail-2" ref={trail2}></div>

      <header className="main-header">
        <div className="brand-container">
          <img 
            src="img/moje_logo.svg" 
            alt="Logo" 
            className="brand-logo" 
            style={{ transform: `rotate(${scrollRotation}deg)` }} 
          />
          <div className="brand-name">ANTONI BISKUPSKI</div>
        </div>

        <nav className="main-nav">
          <a href="#services" className="nav-link">Services</a>
          <a href={contactLink} target="_blank" rel="noopener noreferrer" className="nav-link">
            Work With me!
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </nav>
      </header>

      <main>
        <div className="filter-bar">
          {filters.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredItems.map((item) => (
            <GridItem key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Sekcja Services */}
      <section id="services" style={{padding: '100px 5%', textAlign: 'center'}}>
         <h2 style={{fontFamily: 'var(--font-headline)', marginBottom: '40px'}}>My Services</h2>
         <p>Graphic Design • Branding • 3D Rendering • Video Editing</p>
      </section>

      <footer>
        <p>&copy; 2026 Antoni Biskupski</p>
      </footer>
    </div>
  );
}

export default App;