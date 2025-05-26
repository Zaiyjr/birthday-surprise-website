import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  names: {
    you: string;
    her: string;
  };
}

const Footer: React.FC<FooterProps> = ({ names }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-purple-800 text-white py-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-pink-500 p-3 rounded-full">
            <Heart size={24} fill="white" className="text-white" />
          </div>
        </div>
        
        <p className="text-lg mb-4">
          {names.you} <span className="text-pink-300">♥</span> {names.her}
        </p>
        
        <p className="text-sm text-purple-200 max-w-md mx-auto mb-8">
          "Every moment I spent with you is a gift and I'm so happy. I can't wait time to see you."
        </p> 
        
        <div className="text-purple-300 text-xs">
          <p>Created with love, {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;