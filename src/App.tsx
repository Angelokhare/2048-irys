import React, { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

const backgrounds = [
  '/images/bg1.WEBP',
  '/images/bg2.WEBP',
  '/images/bg3.WEBP',
  '/images/bg4.WEBP',
  '/images/bg5.WEBP',
  '/images/bg6.WEBP',
];

const App: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateBackground = () => {
      document.body.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.transition = 'background-image 1s ease-in-out';
    };

    updateBackground();

    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bgIndex]);

  return (
    <div className="app-container">
      {loading ? (
        <div className="loading-container">
          <img src="/images/loading.GIF" alt="Loading..." className="loading-gif" />
        </div>
      ) : (
        <>
          <div className="overlay-dark">
            <GameBoard />
          </div>
          <footer className="footer">
            Made with 💚 by{' '}
            <a href="https://x.com/snicholasxiv" target="_blank" rel="noopener noreferrer">
              @Bandz (✧ᴗ✧)
            </a>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;