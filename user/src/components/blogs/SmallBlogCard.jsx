export default function SmallBlogCard() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex">
        {/* Left side - Image */}
        <div className="w-1/3">
          <img
            src="https://picsum.photos/200/300"
            alt="Giant panda eating bamboo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Content */}
        <div className="w-2/3 p-4">
          <h2 className="text-xl font-bold mb-1">
            Unveiling the Enigmatic World of Giant Pandas
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Unveiling the enigmatic world of giant pandas and conservation
            challenges
          </p>

          <div className="mt-auto">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              Species
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
