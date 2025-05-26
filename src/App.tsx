import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import PhotoCarousel from './components/PhotoCarousel';
import Gallery from './components/Gallery';
import MusicPlayer from './components/MusicPlayer';
import VideoSection from './components/VideoSection';
import MemoryGame from './components/MemoryGame';
import Footer from './components/Footer';
import { MusicProvider } from './context/MusicContext';

function App() {
  // You can update these with your actual data
  const birthdayDate = new Date('2025-05-29'); // Replace with actual birthday
  const yourNames = { you: 'Zaiy', her: 'MeiLee' }; // Replace with actual names

  return (
    <MusicProvider>
      <div className="font-sans bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen">
        <Toaster position="top-center" />
        <Header name={yourNames.her} />
        <main>
          <Hero birthdayDate={birthdayDate} name={yourNames.her} />
          <PhotoCarousel />
          <Gallery />
          <MemoryGame />
          <VideoSection />
          <MusicPlayer />
        </main>
        <Footer names={yourNames} />
      </div>
    </MusicProvider>
  );
}

export default App;