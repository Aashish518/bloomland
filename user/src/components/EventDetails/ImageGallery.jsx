import React, { useState,useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images }) => {
  // const displayImages = images;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [displayImages, setDisplayImages] = useState([]);

	useEffect(() => {
		const processImages = async () => {
			const base64Images = await Promise.all(
				images.map((img) =>
					convertBufferToBase64(img.data.data, img.contentType)
				)
			);
			setDisplayImages(base64Images);
		};

		processImages();
	}, [images]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex((prev) =>
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) =>
        prev === 0 ? displayImages.length - 1 : prev - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full mx-auto pt-20 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Gallery
      </h2>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div
          className="overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${displayImages.length * 100}%`,
            }}
          >
            {displayImages.map((image, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0"
                style={{ width: `${100 / displayImages.length}%` }}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>

        {/* Mobile Dot Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gray-800 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Mobile Image Counter */}
        <div className="text-center mt-4 text-gray-600">
          {currentIndex + 1} of {displayImages.length}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;


// Helper function
const convertBufferToBase64 = (bufferData, contentType) => {
  const byteArray = new Uint8Array(bufferData);
  const blob = new Blob([byteArray], { type: contentType });

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};