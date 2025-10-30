import Banner from "../../assets/banner.png";

export default function Mission() {
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl">
      {/* Background image */}
      <img
        src={Banner}
        alt="Person with outstretched arms on mountain overlook at sunset"
        className="absolute inset-0 w-full h-full object-cover brightness-75"
      />

      {/* Overlay to darken image and improve text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16">
        <h2 className="text-xl md:text-4xl font-medium text-white mb-4">
          Our Mission
        </h2>

        <p className="text-white text-center max-w-4xl mx-auto text-sm md:text-base leading-relaxed">
          At BloomLand, our mission is to offer curated, healing experiences
          that bring together like-minded souls for emotional healing,
          self-discovery, and holistic growth. We create a safe space where each
          person's journey is honored, and collective wisdom thrives through our
          global community of visionaries and changemakers.
        </p>
      </div>
    </div>
  );
}
