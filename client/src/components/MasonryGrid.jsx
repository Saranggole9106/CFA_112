import React from 'react';
import ArtworkCard from './ArtworkCard';

const MasonryGrid = ({ artworks }) => {
  return (
    <div style={{
      columnCount: 3,
      columnGap: '24px',
      padding: '20px 0',
      width: '100%'
    }} className="masonry-container">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork._id || artwork.id} artwork={artwork} />
      ))}
      <style>{`
        @media (max-width: 1024px) {
          .masonry-container { column-count: 2 !important; }
        }
        @media (max-width: 640px) {
          .masonry-container { column-count: 1 !important; }
        }
      `}</style>
    </div>
  );
};

export default MasonryGrid;
