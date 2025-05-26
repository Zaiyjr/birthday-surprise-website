import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Music, Camera, Gift, Cake, Coffee, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Card {
  id: number;
  type: string;
  icon: React.ReactNode;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  
  const icons = [
    { type: 'heart', icon: <Heart className="w-8 h-8" /> },
    { type: 'star', icon: <Star className="w-8 h-8" /> },
    { type: 'music', icon: <Music className="w-8 h-8" /> },
    { type: 'camera', icon: <Camera className="w-8 h-8" /> },
    { type: 'gift', icon: <Gift className="w-8 h-8" /> },
    { type: 'cake', icon: <Cake className="w-8 h-8" /> },
    { type: 'coffee', icon: <Coffee className="w-8 h-8" /> },
    { type: 'moon', icon: <Moon className="w-8 h-8" /> },
  ];

  const initializeGame = () => {
    const duplicatedIcons = [...icons, ...icons];
    const shuffledCards = duplicatedIcons
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        type: item.type,
        icon: item.icon,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsGameStarted(true);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      if (cards[first].type === cards[second].type) {
        // Match found
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        toast.success('Match found! 🎉');
      } else {
        // No match
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === icons.length) {
      toast.success(`Congratulations! You won in ${moves} moves! 🎊`, {
        duration: 5000,
      });
    }
  }, [matchedPairs, moves]);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Memory <span className="text-pink-500">Game</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test your memory with this fun game! Match all the pairs to win.
          </p>
        </motion.div>

        {!isGameStarted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pink-500 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-pink-600 transition-colors"
              onClick={initializeGame}
            >
              Start Game
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center gap-8 mb-8">
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <p className="text-gray-600">Moves</p>
                <p className="text-2xl font-bold text-pink-500">{moves}</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <p className="text-gray-600">Matches</p>
                <p className="text-2xl font-bold text-pink-500">{matchedPairs}/{icons.length}</p>
              </div>
            </div>

            <motion.div 
              className="grid grid-cols-4 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`relative aspect-square cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <AnimatePresence>
                    <motion.div
                      className={`absolute inset-0 rounded-xl ${
                        card.isFlipped || card.isMatched
                          ? 'bg-white'
                          : 'bg-gradient-to-br from-pink-400 to-purple-500'
                      } shadow-md flex items-center justify-center transition-colors`}
                      initial={false}
                      animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {(card.isFlipped || card.isMatched) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-pink-500"
                        >
                          {card.icon}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-600 transition-colors"
                onClick={initializeGame}
              >
                Restart Game
              </motion.button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MemoryGame;