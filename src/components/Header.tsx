import React, { useState, useEffect } from 'react';
import { Heart, Music, Menu, X } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicContext';

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { togglePlay, isPlaying } = useMusicPlayer();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-pink-500" size={24} />
          <h1 className={`font-bold transition-all duration-300 ${
            isScrolled ? 'text-pink-600 text-lg' : 'text-white text-xl'
          }`}>
            {name}'s Birthday
          </h1>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['hero', 'photos', 'gallery', 'timeline', 'video'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className={`font-medium transition-colors hover:text-pink-500 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button 
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isPlaying 
                ? 'bg-pink-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Music size={16} />
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-pink-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4">
          {['hero', 'photos', 'gallery', 'video'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="font-medium text-gray-700 hover:text-pink-500 py-2"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button 
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isPlaying 
                ? 'bg-pink-500 text-white' 
                : 'bg-pink-100 text-pink-500'
            }`}
          >
            <Music size={16} />
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;