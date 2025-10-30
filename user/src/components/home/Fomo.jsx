import BannerImg from "../../assets/benefit.png";

export default function Fomo() {
  return (
    <div className="md:max-w-[80%] max-w-full mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl mb-4 font-medium text-[#E16B33]">
          Stay stuck in survival... or bloom into your next life.
        </h1>
        <p className="text-gray-600 text-lg">
          Without a reset, you'll keep living in cycles you were meant to break.
        </p>
      </div>

      {/* Grid of consequences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Item 1 */}
        <div className="flex items-start space-x-4">
          <div className="text-8xl font-medium leading-none text-[#3D3D3D]">
            1
          </div>
          <div className="pt-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              You'll miss the chance to be guided by the world's best healers.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start space-x-4">
          <div className="text-8xl font-medium leading-none text-[#3D3D3D]">
            2
          </div>
          <div className="pt-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              You'll miss the energy, the clarity, the connection.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start space-x-4">
          <div className="text-8xl font-medium  leading-none text-[#3D3D3D]">
            3
          </div>
          <div className="pt-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              You'll keep carrying stress in your body, confusion in your mind,
              and distance in your relationships.
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-start space-x-4">
          <div className="text-8xl font-medium  leading-none text-[#3D3D3D]">
            4
          </div>
          <div className="pt-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              While others reset, rise, and bloom — you'll stay where you are.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#FFD1BB] rounded-lg p-6 text-center">
        <p className="text-[#773212] text-lg">
          Your timeline splits here. One path is more of the same. The other
          begins at BloomLand.
        </p>
      </div>
    </div>
  );
}
