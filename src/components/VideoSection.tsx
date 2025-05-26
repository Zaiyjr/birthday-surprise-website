import React, { useState, useRef } from 'react';
import { Play, Pause, Volume, VolumeX, Maximize, Minimize, Heart } from 'lucide-react';
import { videos } from '../data/videos';
import { motion } from 'framer-motion';

const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
      setCurrentTime(current);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const changeVideo = (index: number) => {
    setCurrentVideo(index);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }, 50);
  };

  return (
    <section id="video" className="py-20 bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
         Happy Birthday <span className="text-pink-400">MyLove</span>
        </motion.h2>
        
        <motion.p 
          className="text-center text-pink-200 mb-12 max-w-3xl mx-auto text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          ສຸກສັນວັນເກີດທີ່ຮັກຂໍໃຫ້ມີຄວາມສຸກຫຼາຍໆ ເຕີບໃຫຍ່ເປັນຄົນທີ່ດີຂອງພໍ່ແມ່ແລະຂອງແຟນ, ຂໍໃຫ້ມີແຕ່ສິ່ງດີໆໃນຊີວິດແລະປະສົບຜົນສຳເລັດ
        </motion.p>
        
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div 
            ref={videoContainerRef}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300"
          >
            <video
              ref={videoRef}
              className="w-full aspect-video"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              src={videos[currentVideo].url}
              poster={videos[currentVideo].thumbnail}
              preload="metadata"
            />
            
            {/* Play/pause overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer backdrop-blur-sm"
                onClick={togglePlay}
              >
                <motion.div 
                  className="w-20 h-20 md:w-24 md:h-24 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={40} fill="white" className="text-white ml-2" />
                </motion.div>
              </div>
            )}
            
            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
              {/* Progress bar */}
              <div 
                ref={progressRef}
                className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    className="text-white hover:text-pink-300 transition-colors"
                    onClick={togglePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="text-white hover:text-pink-300 transition-colors"
                      onClick={toggleMute}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume size={20} />}
                    </motion.button>
                    
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-pink-500"
                      aria-label="Volume"
                    />
                  </div>
                  
                  <span className="text-sm text-white/80 font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.button
                    className="text-white hover:text-pink-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={20} className="fill-pink-500" />
                  </motion.button>
                  
                  <motion.button
                    className="text-white hover:text-pink-300 transition-colors"
                    onClick={toggleFullscreen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video info */}
          <motion.div 
            className="mt-6 p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-pink-300">ຂໍ້ຄວາມຈາກໃຈ</h3>
            <p className="text-pink-200 leading-relaxed">
              ຢ່າຄຽດເກັ່ງຫຼາຍເບບີ້, ຂໍໃຫ້ຢູ່ນຳເຂົາໄປຕະຫຼອດນະເບບີ້. ເຖິງເຮົາຊິບໍ່ສົມບູນແບບ ແຕ່ເຮົາກະພະຍາຍາມປັບໂຕເຂົ້າກັນ ແລະ ອາດມີບາງຊ້ວງທີ່ເຮົາບໍ່ເຂົ້າໃຈກັນ ຫລື ເລື່ອງທີ່ເຂົາມັກເວົ້າແຮງກັບເບບີ້, ເຂົາຂໍໂທດເບບີ້ຫຼາຍໆ. ເຮົາອາດຈະເຈິກັນຊ້າ, ແຕ່ເຮົາມາເຈິກັນໃນເວິຊັນທີ່ດີທີ່ສຸດ. ເຂົາຈະປັບປຸງແລະພັດທະນາຕົນເອງເພື່ອໃຫ້ສົມຄວນກັບເຈົ້າຫຍິງຂອງເຂົາທີ່ສຸດ.
            </p>
            <p className="text-pink-300 text-xl font-bold mt-6 text-center">
              I LOVE YOU ALL OF MY HEART ❤️
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;