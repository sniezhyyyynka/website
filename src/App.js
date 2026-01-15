import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState('All');
  const [scrollRotation, setScrollRotation] = useState(0);

  // Kursor Refs
  const mainCursor = useRef(null);
  const trail1 = useRef(null);
  const trail2 = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (mainCursor.current) {
        mainCursor.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animateTrail = () => {
      // Prosty easing dla ogonów kursora
      [trail1, trail2].forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const dx = mouseX.current - x;
          const dy = mouseY.current - y;
          const speed = 0.15 / (index + 1);
          ref.current.style.left = `${x + dx * speed}px`;
          ref.current.style.top = `${y + dy * speed}px`;
        }
      });
      requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(animateTrail);
    return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Kursory */}
      <div className="custom-cursor main-cursor" ref={mainCursor}></div>
      <div className="custom-cursor trail-cursor trail-1" ref={trail1}></div>
      <div className="custom-cursor trail-cursor trail-2" ref={trail2}></div>

      <header className="main-header">
        <div className="brand-container">
          <img src="img/moje_logo.svg" alt="Logo" className="brand-logo" style={{ transform: `rotate(${scrollRotation}deg)` }} />
          <div className="brand-name">ANTONI BISKUPSKI</div>
        </div>

        <nav className="main-nav">
          {/* PRZYWRÓCONE LINKI */}
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

      {/* Sekcja Services, której brakowało */}
      <section id="services" style={{padding: '100px 5%'}}>
         <h2>My Services</h2>
         {/* Tutaj Twój content sekcji services */}
      </section>

      <footer>
        <p>&copy; 2026 Antoni Biskupski</p>
      </footer>
    </div>
  );

  }, []);

  const portfolioItems = [
    { id: 1, title: '2D Vector Graffiti', category: 'Calligraphy', img: 'img/antszkol.png', isTransparent: true },
    { id: 2, title: 'Fashion Campaign', category: ['Branding', 'Logo'], img: 'img/kith_graffiti.png', isTransparent: true },
    { id: 3, title: '3D logo render', category: ['Logo', '3D'], img: 'img/KITH_graphic.png', isTransparent: false, isWide: true },
    { id: 4, title: '3D logo render', category: ['Calligraphy', '3D'], img: 'img/mechatok_wax.png', isTransparent: false },
    { id: 5, title: 'Kith brand identity', category: 'Branding', img: 'img/kith_graffiti2.png', isTransparent: true },
    { id: 6, title: 'Sex pistols vector logo', category: ['Calligraphy', 'Logo', 'Branding'], images: ['img/bass1.png', 'img/bass3.png'], isTransparent: true },
    { id: 7, title: 'Sex pistols vector logo', category: 'Calligraphy', images: ['img/sex_pistols.png', 'img/sex_pistols2.png'], isTransparent: true }
  ];

  // LOGIKA FILTROWANIA I UKŁADU (WIDE NA NIEPARZYSTYCH)
  const filteredItems = useMemo(() => {
    // 1. Filtrujemy
    const baseFiltered = portfolioItems.filter(item => {
      if (filter === 'All') return true;
      const categories = Array.isArray(item.category) ? item.category : [item.category];
      return categories.some(cat => cat.toLowerCase() === filter.toLowerCase());
    });

    // 2. Naprawiamy kolejność dla Wide Items
    // Wide item zajmuje 2 kolumny, więc musi zacząć się na nieparzystym indeksie (1, 3, 5...)
    // w systemie 2-kolumnowym.
    const finalArray = [];
    let currentColumn = 1;

    baseFiltered.forEach((item) => {
      if (item.isWide && currentColumn === 2) {
        // Jeśli mamy Wide, a jesteśmy w drugiej kolumnie, musimy wstawić pusty placeholder 
        // lub przesunąć element, żeby Wide wskoczył do nowej linii.
        // Tutaj: szukamy następnego małego elementu, żeby zamienić go miejscami.
        const nextSmallIndex = baseFiltered.findIndex((el, idx) => !el.isWide && !finalArray.includes(el) && baseFiltered.indexOf(item) < idx);
        
        if (nextSmallIndex !== -1) {
             // Zamiana (skomplikowane w pętli, więc upraszczamy: Wide przeskakuje niżej)
        }
      }
      finalArray.push(item);
      currentColumn = item.isWide ? 1 : (currentColumn === 1 ? 2 : 1);
    });

    return baseFiltered;
  }, [filter]);

  const filters = ['All', 'Logo', 'Video', 'Calligraphy', 'Branding', '3D'];

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="custom-cursor main-cursor" ref={mainCursor}></div>
      <div className="custom-cursor trail-cursor trail-1" ref={trail1}></div>
      <div className="custom-cursor trail-cursor trail-2" ref={trail2}></div>

      <header className="main-header">
        <div className="brand-container">
          <img src="img/moje_logo.svg" alt="Logo" className="brand-logo" style={{ transform: `rotate(${window.scrollY / 5}deg)` }} />
          <div className="brand-name">ANTONI BISKUPSKI</div>
        </div>
        <nav className="main-nav">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle">
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </nav>
      </header>

      <div className="filter-bar">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? 'active' : ''}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredItems.map((item) => (
          <GridItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;