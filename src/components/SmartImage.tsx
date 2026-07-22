import React, { useState, useEffect } from 'react';
import { getSynologyCandidates } from '../utils/imageUtils';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackSrc = 'https://picsum.photos/seed/placeholder/800/600',
  className = '',
  ...props
}) => {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!src) {
      setCandidates([fallbackSrc]);
      setCurrentIndex(0);
      return;
    }
    const cand = getSynologyCandidates(src);
    if (cand.length === 0) {
      setCandidates([src, fallbackSrc]);
    } else {
      setCandidates([...cand, fallbackSrc]);
    }
    setCurrentIndex(0);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentSrc = candidates[currentIndex] || fallbackSrc;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
