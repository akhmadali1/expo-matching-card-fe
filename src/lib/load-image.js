import { useState, useEffect } from 'react';

const useOnLoadImages = (wrapperRef) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!wrapperRef || !wrapperRef.current) return;

    const images = wrapperRef.current.querySelectorAll('img');
    const imageCount = images.length;
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === imageCount) {
        setImagesLoaded(true);
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        handleImageLoad();
      } else {
        image.addEventListener('load', handleImageLoad);
      }
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', handleImageLoad);
      });
    };
  }, [wrapperRef]);

  return imagesLoaded;
};

export default useOnLoadImages;
