import React, { createContext, useState, useContext, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: number;
  volume: number;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (index: number) => void;
}

const defaultContext: MusicContextType = {
  isPlaying: false,
  currentTrack: 0,
  volume: 0.5,
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  setCurrentTrack: () => {},
};

// Music tracks data
export const musicTracks = [
  {
    id: 1,
    title: "DAY ONE",
    artist: "PUN",
    url: "/music/PUN - DAY ONE.mp3",
    cover: "https://images.pexels.com/photos/1616470/pexels-photo-1616470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },

];

const MusicContext = createContext<MusicContextType>(defaultContext);

export const useMusicPlayer = () => useContext(MusicContext);

export const MusicProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio();
    setAudio(audioElement);
    
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!audio) return;
    
    // Update audio source when track changes
    audio.src = musicTracks[currentTrack].url;
    audio.volume = volume;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      audio.pause();
    };
  }, [currentTrack, audio]);

  useEffect(() => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    if (!audio) return;
    audio.volume = volume;
  }, [volume, audio]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  
  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % musicTracks.length);
  };
  
  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + musicTracks.length) % musicTracks.length);
  };

  return (
    <MusicContext.Provider 
      value={{
        isPlaying,
        currentTrack,
        volume,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        setCurrentTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
