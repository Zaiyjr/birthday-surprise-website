import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import toast from 'react-hot-toast';
import { images } from '../data/images';

interface HeroProps {
  birthdayDate: Date;
  name: string;
}

const Hero: React.FC<HeroProps> = ({ birthdayDate, name }) => {
  const [timeLeft, setTimeLeft] = useState({
    days:0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = birthdayDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // It's her birthday!
        setShowConfetti(true);
        toast.success("Happy Birthday! 🎉", {
          icon: '🎂',
          duration: 5000
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [birthdayDate]);

  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-bg"
    >
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-900/60 to-pink-800/70"></div>
      
      {/* Floating hearts with mouse parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-pink-200/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            whileHover={{ scale: 1.2 }}
            drag
            dragConstraints={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Heart 
              size={20 + Math.random() * 30} 
              fill="currentColor" 
            />
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <Tilt
          className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-white/20 max-w-4xl mx-auto"
          options={{
            max: 25,
            scale: 1.05,
            speed: 1000,
            glare: true,
            "max-glare": 0.5,
          }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Happy Birthday, {name}!
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-pink-100 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Counting down the moments until your special day...
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  toast.success(`${item.value} ${item.label.toLowerCase()} to go!`, {
                    icon: '⏰'
                  });
                }}
              >
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {formatTime(item.value)}
                </span>
                <span className="text-pink-200 text-sm uppercase tracking-wide">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            className="text-white/80 italic text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            "Every moment with you is a gift. Here's to celebrating another year of you lighting up my world."
          </motion.p>
        </Tilt>
      </div>
    </section>
  );
};

export default Hero;