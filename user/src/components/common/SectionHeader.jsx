const SectionHeader = ({ title, subtitle, lineColor }) => {
  return (
    <div
      className={`w-full md:pt-20 pt-10 flex mx-auto justify-center md:gap-10 gap-3 max-w-[100%] md:max-w-[80%] items-center bg-inherit`}
    >
      {lineColor && <div className={`flex-1 h-[1px] ${lineColor}`} />}
      <div className="flex flex-col items-center justify-center md:max-w-full max-w-50">
        <h1 className="md:text-2xl text-xl capitalize text-[#E16B33] text-center ">
          {title}
        </h1>
        <h1 className="md:text-xl text-lg capitalize text-center">
          {subtitle}
        </h1>
      </div>
      {lineColor && <div className={`flex-1 h-[1px] ${lineColor}`} />}
    </div>
  );
};

export default SectionHeader;
