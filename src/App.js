import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Stan do obracania logo
  const [scrollRotation, setScrollRotation] = useState(0);

  // --- LOGIKA KURSORA ---
  const mainCursor = useRef(null);
  const trail1 = useRef(null);
  const trail2 = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const trail1X = useRef(0);
  const trail1Y = useRef(0);
  const trail2X = useRef(0);
  const trail2Y = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
      if (mainCursor.current) {
        mainCursor.current.style.transform = `translate3d(${mouseX.current}px, ${mouseY.current}px, 0) translate(-50%, -50%)`;
      }
    };
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

    const handleScroll = () => {
      setScrollRotation(window.scrollY / 5); 
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    const animationId = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- DANE ---
  const portfolioItems = [
    {
      id: 1,
      title: '2D Vector Graffiti',
      category: 'calligraphy',
      img: '/img/antszkol.png', 
      isTransparent: true 
    },
    {
      id: 2,
      title: 'Fashion Campaign',
      category: 'video',
      img: '/img/kith_graffiti.png',
      isTransparent: true,
    },
    {
      id: 3,
      title: 'Modern Chair',
      category: 'logo',
      img: '/img/KITH_graphic.png',
      isTransparent: false, // Pełne zdjęcie
      isWide: true
    },
    {
      id: 4,
      title: 'Japanese Calligraphy',
      category: 'calligraphy',
      img: '/img/mechatok_wax.png',
      isTransparent: false 
    },
    {
      id: 5,
      title: 'Brand Identity',
      category: 'editorial',
      img: '/img/kith_graffiti2.png',
      isTransparent: true
    },
    {
      id: 6,
      title: 'Music Video Teaser',
      category: 'video',
      img: null,
      isWide: true
    }
  ];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const filters = ['all', 'logo', 'video', 'calligraphy', 'editorial'];
  
  // Link do Google Forms
  const contactLink = "https://docs.google.com/forms/d/e/1FAIpQLSe3PFAr-GSdsjJQtr71f4Gi-vOkSmNVJq7wrHTVyAZCD9ra5g/viewform?usp=dialog";

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      
      <div className="custom-cursor main-cursor" ref={mainCursor}></div>
      <div className="custom-cursor trail-cursor trail-1" ref={trail1}></div>
      <div className="custom-cursor trail-cursor trail-2" ref={trail2}></div>

      <header className="main-header">
        <div className="brand-container">
          <img 
            src="/img/moje_logo.svg" 
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
          {/* Przycisk trybu: BOLD */}
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
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`grid-item 
                ${!item.img ? 'placeholder-item' : ''} 
                ${item.isTransparent ? 'adaptive-bg' : ''}
                ${item.isWide ? 'wide-item' : ''}
                ${!item.isTransparent && item.img ? 'full-photo' : ''}
              `}
            >
              {item.img ? (
                <>
                  <img src={item.img} alt={item.title} />
                  <div className="item-overlay">
                    <h3>{item.title}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                </>
              ) : (
                <div className="text-placeholder">
                  <h3>{item.title}</h3>
                  <span className="item-category">{item.category}</span>
                  <p style={{marginTop: '10px'}}>Content without image</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>&copy; 2026 Antoni Biskupski</p>
      </footer>
    </div>
  );
}

export default App;