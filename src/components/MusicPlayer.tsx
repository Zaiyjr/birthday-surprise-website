import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicContext';
import { musicTracks } from '../context/MusicContext';

const MusicPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentTrack, 
    volume, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    setVolume, 
    setCurrentTrack 
  } = useMusicPlayer();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioElement.pause();
      }
      
      audioElement.volume = volume;
      
      const updateProgress = () => {
        if (audioElement.duration) {
          setProgress((audioElement.currentTime / audioElement.duration) * 100);
          setCurrentTime(audioElement.currentTime);
        }
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };
      
      const handleEnded = () => {
        nextTrack();
      };
      
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [isPlaying, volume, currentTrack, nextTrack]);
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const currentTrackData = musicTracks[currentTrack];

  return (
    <div className={`fixed bottom-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
      isExpanded ? 'h-[300px]' : 'h-16 md:h-20'
    }`}>
      <audio 
        ref={audioRef} 
        src={currentTrackData.url} 
        preload="metadata" 
        className="hidden"
      />
      
      {/* Expanded player */}
      {isExpanded && (
        <div className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-md h-[260px] text-white flex items-center">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 mt-8 md:mt-0">
              <img 
                src={currentTrackData.cover} 
                alt={currentTrackData.title} 
                className="w-48 h-48 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">{currentTrackData.title}</h3>
              <p className="text-white/80 mb-6">{currentTrackData.artist}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {musicTracks.map((track, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                      currentTrack === index 
                        ? 'bg-white/20' 
                        : 'bg-transparent hover:bg-white/10'
                    }`}
                    onClick={() => setCurrentTrack(index)}
                  >
                    <img 
                      src={track.cover}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{track.title}</p>
                      <p className="text-xs text-white/60">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Player controls */}
      <div 
        className={`h-16 md:h-20 ${
          isExpanded 
            ? 'bg-purple-700/90 backdrop-blur-md' 
            : 'bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-md'
        } text-white px-4 flex items-center relative`}
      >
        <div className="absolute inset-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}></div>
        
        <div className="container mx-auto flex items-center justify-between relative z-10">
          {/* Track info */}
          <div className="flex items-center gap-3 w-1/4">
            <img 
              src={currentTrackData.cover}
              alt={currentTrackData.title}
              className="w-10 h-10 rounded object-cover shadow-md"
            />
            <div className="hidden sm:block">
              <p className="font-medium text-sm line-clamp-1">{currentTrackData.title}</p>
              <p className="text-white/70 text-xs">{currentTrackData.artist}</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center gap-4 mb-1">
              <button 
                className="text-white/80 hover:text-white transition-colors"
                onClick={prevTrack}
                aria-label="Previous track"
              >
                <SkipBack size={18} />
              </button>
              
              <button 
                className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-pink-500 hover:scale-105 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                className="text-white/80 hover:text-white transition-colors"
                onClick={nextTrack}
                aria-label="Next track"
              >
                <SkipForward size={18} />
              </button>
            </div>
            
            <div className="w-full max-w-md flex items-center gap-2">
              <span className="text-xs text-white/70">{formatTime(currentTime)}</span>
              
              <div 
                ref={progressRef}
                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressClick(e);
                }}
              >
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <span className="text-xs text-white/70">{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Volume */}
          <div className="flex items-center gap-2 w-1/4 justify-end">
            <button
              className="text-white/80 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                e.stopPropagation();
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (newVolume > 0 && isMuted) {
                  setIsMuted(false);
                }
              }}
              className="w-20 accent-pink-300 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;