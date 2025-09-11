import { FaArrowRight } from "react-icons/fa6";

function Button({
  title,
  bgColor = "bg-gray-900",
  textSize = "text-[17px]",
  textColor = "text-white",
}) {
  return (
    <div className="relative flex grow">
      <div className="flex grow">
        {/* Left Button Part */}
        <div className="flex sm:grow-0 grow group transition-all cursor-pointer">
          <span className={`${bgColor} w-3 rounded-l-md`}></span>
          <div
            className={`${bgColor} ${textColor} flex grow items-center justify-start py-2 pr-20`}
          >
            <span className={`${textSize} font-body uppercase truncate`}>
              {title}
            </span>
          </div>
          <span
            className={`${bgColor} w-9 rounded-tr-md rounded-br-md -translate-x-2`}
          ></span>
        </div>

        {/* Right Arrow Part */}
        <div className="flex grow-0 group transition-all cursor-pointer">
          <span
            className={`${bgColor} w-6 rounded-tl-md rounded-bl-md translate-x-3`}
          ></span>
          <div
            className={`${bgColor} ${textColor} flex items-center justify-center px-3`}
          >
            <FaArrowRight />
          </div>
          <span className={`${bgColor} w-2 rounded-r-md`}></span>
        </div>
      </div>
    </div>
  );
}

export default Button;
