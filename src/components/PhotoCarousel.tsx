import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { photos } from '../data/photos';

const PhotoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);
  
  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % photos.carouselPhotos.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => 
      prev === 0 ? photos.carouselPhotos.length - 1 : prev - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  return (
    <section id="photos" className="py-20 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Our <span className="text-pink-500">Special</span> Moments
        </h2>
        
        <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-xl h-[350px] md:h-[500px]">
          {/* Current slide */}
          <div 
            ref={slideRef}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            style={{
              backgroundImage: `url(${photos.carouselPhotos[currentIndex].url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                {photos.carouselPhotos[currentIndex].title}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                {photos.carouselPhotos[currentIndex].description}
              </p>
            </div>
          </div>
          
          {/* Navigation arrows */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all z-10"
            onClick={prevSlide}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all z-10"
            onClick={nextSlide}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {photos.carouselPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index 
                    ? 'w-8 bg-white' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoCarousel;