import React from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';

const MasonryGrid = ({ artworks }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!artworks || artworks.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '28px',
        gridAutoFlow: 'dense'
      }}
    >
      {artworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork._id}
          artwork={artwork}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default MasonryGrid;
