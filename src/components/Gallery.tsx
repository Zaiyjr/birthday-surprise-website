import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { photos } from '../data/photos';

const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [dragInfo, setDragInfo] = useState({ x: 0, y: 0 });
  
  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhoto !== null) {
      setSelectedPhoto((prev) => (prev + 1) % photos.galleryPhotos.length);
    }
  };
  
  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhoto !== null) {
      setSelectedPhoto((prev) => 
        prev === 0 ? photos.galleryPhotos.length - 1 : prev - 1
      );
    }
  };
  
  return (
    <section id="gallery" className="py-20 bg-white">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Our <span className="text-pink-500">Photo</span> Gallery
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.galleryPhotos.map((photo, index) => (
            <Tilt
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer group"
              options={{
                max: 25,
                scale: 1.05,
                speed: 400,
              }}
              onClick={() => openLightbox(index)}
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium">{photo.title}</h3>
                  <p className="text-white/80 text-sm">{photo.date}</p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
        
        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto !== null && (
            <motion.div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div 
                className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => setDragInfo({ x: info.offset.x, y: info.offset.y })}
              >
                <motion.img 
                  src={photos.galleryPhotos[selectedPhoto].url}
                  alt={photos.galleryPhotos[selectedPhoto].title}
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  style={{ x: dragInfo.x, y: dragInfo.y }}
                  whileHover={{ scale: 1.05 }}
                />
                
                <motion.button 
                  className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeLightbox}
                >
                  <X size={32} />
                </motion.button>
                
                <motion.div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-1">
                    {photos.galleryPhotos[selectedPhoto].title}
                  </h3>
                  <p className="text-white/80">
                    {photos.galleryPhotos[selectedPhoto].description}
                  </p>
                </motion.div>
                
                {/* Navigation arrows */}
                <motion.button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                >
                  <span className="sr-only">Previous</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </motion.button>
                
                <motion.button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextPhoto}
                  aria-label="Next photo"
                >
                  <span className="sr-only">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Gallery;