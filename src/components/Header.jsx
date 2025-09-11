import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import Button from "./Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        role="navigation"
        className="z-nav flex h-10 w-screen md:w-full lg:w-full items-center justify-between gap-x-1 px-4 transition-all duration-300 ease-in-out md:fixed md:px-10 lg:gap-x-1.5 lg:px-12 top-0 my-4 fixed z-20"
      >
        <a
          aria-label="home"
          className="flex h-full flex-1 transition-all focus:outline-coral-500 xl:flex-none"
          href="/"
        >
          <div className="h-full min-h-cell-md max-h-cell-md flex grow group/cell transition-all">
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right -mr-0.5 w-3 rounded-l-[6px] border border-r-0"></span>
            <div className="text-volcanic-900 border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md truncate flex grow relative transition-all border-b border-t">
              <div className="z-10 flex w-full items-center justify-between">
                <div className="flex items-center px-2 py-4 xl:justify-center">
                  <img
                    alt="Rodiax"
                    title=""
                    fetchpriority="high"
                    width="0"
                    height="0"
                    decoding="async"
                    data-nimg="1"
                    className="h-auto w-full object-contain"
                    style={{ color: "transparent" }}
                    src=""
                  />
                </div>
              </div>
            </div>
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right w-6 rounded-tr-[10px] rounded-br-[4px] border border-l-0"></span>
          </div>
        </a>

        <div className="z-30 hidden h-full flex-1 xl:flex">
          <div className="h-full min-h-cell-md max-h-cell-md flex grow group/cell transition-all">
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right w-6 -mr-4 rounded-tl-[4px] rounded-bl-[10px] border border-r-0"></span>
            <div className="text-volcanic-900 border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md flex grow relative transition-all border-b border-t">
              <div className="z-10 flex w-full items-center justify-between">
                <ul className="z-30 h-full flex-1 flex-row items-center gap-x-10 px-8 xl:flex">
                  {[
                    "Products",
                    "For Business",
                    "Developers",
                    "Research",
                    "Company",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="z-nav h-full w-auto px-0 py-0.5 2xl:relative group font-starcil font-semibold"
                    >
                      <button
                        className="group w-full h-full relative focus:outline-none text-xs uppercase tracking-[0.08em] flex flex-row-reverse items-center justify-between xl:flex-row xl:justify-center before:content-[''] before:absolute before:-bottom-3 before:w-full before:h-3 cursor-context-menu"
                        type="button"
                        aria-expanded={index === 0 ? "true" : "false"}
                        data-headlessui-state={index === 0 ? "open" : ""}
                        id={`headlessui-popover-button-:r${8 + index}${index}:`}
                      >
                        <div className="border-black transition-colors duration-100 ease-in-out bg-transparent mb-[1px] h-[9px] w-[9px] rounded-full xl:mr-1.5 border border-volcanic-800 group-hover:bg-orange-500 group-hover:border-0"></div>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right w-6 rounded-tr-[10px] rounded-br-[4px] border border-l-0"></span>
          </div>
        </div>

        <div className="z-30  h-full  xl:flex">
          <div className=" h-full min-h-cell-md max-h-cell-md flex grow group/cell transition-all">
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right w-6 -mr-4 rounded-tl-[4px] rounded-bl-[10px] border border-r-0"></span>
            <a
              href=""
              rel="noopener noreferrer"
              target="_blank"
              data-fs-element="Marketing>Nav>Try now"
              className="focus:outline-coral-500 cursor-context-menu"
            >
              <div className="hidden h-full xl:flex">
                <div className="h-full min-h-cell-md max-h-cell-md flex grow group/cell transition-all">
                  <div className="text-volcanic-900 border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md truncate flex grow relative transition-all border-b border-t">
                    <div className="flex w-full items-center justify-between">
                      <p className="text-xs font-serif px-2 py-6 uppercase tracking-[0.08em]">
                        <span>Try now</span>
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <div className="relative">
              {/* Hamburger Menu Button */}
              <div
                className="block lg:hidden  items-center w-[.1px] h-[1px] mt-[11px]"
                onClick={toggleMenu}
              >
                <RxHamburgerMenu />
              </div>
              {/* New Div with full screen height and width */}

              {isOpen && (
                <div className="fixed  md:right-[40px] md:top-16 md:w-80 md:rounded-lg md:bottom-8 border inset-0 z-50 md:inset-auto md:z-auto flex items-center justify-center bg-white/75 ">
                  <div className="relative w-full h-full">
                    <div className="block md:hidden top-4 left-5 absolute">
                      <img
                        src="https://cdn.sanity.io/images/rjtqmwfu/production/ae020d94b599cc453cc09ebc80be06d35d953c23-102x18.svg"
                        alt=""
                      />
                    </div>
                    <button
                      className="block md:hidden absolute top-4 right-4 text-black text-2xl"
                      onClick={toggleMenu}
                    >
                      <IoClose />
                    </button>
                    <br />
                    <br />
                    <div className="w-full block md:hidden bg-gray-300/75 h-[.1px]"></div>
                    <div className="">
                      <ul className="md:absolute md:top-0 text-sm">
                        {[
                          "PRODUCTS",
                          "FOR BUSINESS",
                          "DEVELOPERS",
                          "RESEARCH",
                          "COMPANY",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="mx-5 h-10 mt-4 flex justify-between items-center font-starcil font-semibold"
                          >
                            {item}
                            <div className="mt-2 border-black transition-colors duration-100 ease-in-out bg-transparent mb-[1px] h-[9px] w-[9px] rounded-full border group-hover:bg-[#F5F4F2]/75 hover:border-red-500 hover:bg-[#F5F4F2]/75" />
                          </li>
                        ))}
                        {/* Separator line */}
                        <div className="w-full bg-gray-300/75 mt-2 h-[0.1px]"></div>
                      </ul>
                    </div>

                    <div className="left-2 absolute  right-2 bottom-28">
                      <Button title="TRY NOW" />
                      <div className=" absolute  left-3  -bottom-[50px] -mx-3 right-[100px]  rounded-lg border w-full  h-11">
                        <div className="mt-2 mx-5 font-starcil font-semibold">
                          SIGN IN
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="border-[#29282851] bg-[#F5F4F2]/75 h-full min-h-cell-md max-h-cell-md transition-all bg-clip-padding origin-top-right w-6 rounded-tr-[10px] rounded-br-[4px] border border-l-0"></span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
