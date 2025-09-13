
import { useState, useEffect } from "react";
import logoMain from "../assets/RODIAX_logo_161x161.png";

const menuItems = [
  { label: "PRODUCTS", href: "#products" },
  { label: "FOR BUSINESS", href: "#business" },
  { label: "COMPANY", href: "#company" },
];

const Header = () => {
  const [animateHeader, setAnimateHeader] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(o => !o);

  // Optimized scroll listener using rAF + passive listener
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setAnimateHeader(window.scrollY > 140);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize above breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  return (
    <>
      <div
        className="flex items-center w-full max-w-[95vw] mx-auto pt-0 px-0 md:px-8 xl:px-16 fixed top-0 xl:top-6 left-0 right-0 z-20 transition-all"
      >
        <a
          aria-label="home"
          className="hidden xl:flex items-center font-sans hover:cursor-pointer mr-6"
          href="/"
          style={{ minWidth: 56 }}
        >
          <img
            alt="Rodiax Logo"
            fetchpriority="high"
            decoding="async"
            className="h-10 w-auto object-contain select-none"
            style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
            src={logoMain}
          />
        </a>
        <nav
          role="navigation"
          aria-label="Main navigation"
          className={`flex-1 bg-gray-900/5 rounded-xl bg-clip-padding backdrop-blur-3xl z-nav flex items-center justify-between gap-x-4 px-0 md:px-8 lg:px-12 transition-all duration-300 ease-in-out
            h-16 xl:h-16 ${animateHeader ? 'xl:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)] xl:h-14' : ''}`}
        >
          {/* Mobile: Logo left, hamburger far right */}
          <div className="flex items-center justify-between w-full xl:hidden h-full px-4">
            <a href="/" aria-label="home" className="flex items-center">
              <img src={logoMain} alt="Rodiax Logo" className="h-8 w-auto object-contain" />
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMobile}
              className="text-white/90 hover:text-white transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500/60 p-2"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
          {/* Desktop Menu */}
          <ul className="hidden xl:flex flex-row gap-3 md:gap-6 lg:gap-8 justify-start items-center h-full mr-auto">
            {menuItems.map((item, idx) => (
              <li key={item.label} className="h-full flex items-center">
                <a
                  href={item.href}
                  aria-label={item.label}
                  className={`h-full flex items-center gap-2 transition-all px-4 font-sans text-lg font-semibold select-none border-b-4 border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500/60 ${
                    hoveredIdx === null
                      ? "text-white/90 hover:text-white hover:border-orange-500"
                      : hoveredIdx === idx
                        ? "text-white border-orange-500"
                        : "text-gray-400/70"
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`transition-colors duration-150 ease-in-out h-2.5 w-2.5 rounded-full border ${
                      hoveredIdx === idx
                        ? "bg-orange-500 border-orange-500"
                        : "border-white/40 bg-transparent"
                    }`}
                  ></div>
                  <span className="pointer-events-none">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>


        <div className="z-30 h-full hidden xl:flex font-sans items-center pl-8">
          <a
            href="#try"
            rel="noopener noreferrer"
            target="_blank"
            data-fs-element="Marketing>Nav>Try now"
            className="h-full flex items-center text-base font-semibold uppercase tracking-[0.08em] text-white/80 hover:text-orange-400 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500/60 cursor-pointer px-4"
            aria-label="Try now"
          >
            Try now
          </a>
        </div>
        {/* Mobile Controls */}
        </nav>
      </div>

      {/* Mobile Flyout */}
      <div
        className={`xl:hidden fixed top-0 left-0 right-0 pt-4 px-6 pb-6 transition-[transform,opacity] duration-300 ease-out z-[55] ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}
        style={{ background: 'color-mix(in srgb, var(--brand-color) 70%, rgba(0,0,0,0.35))', backdropFilter: 'blur(22px)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <a href="/" aria-label="Home" className="flex items-center gap-2">
            <img src={logoMain} alt="Rodiax Logo" className="h-8 w-auto" />
            <span className="text-white font-semibold tracking-wide text-sm">Rodiax</span>
          </a>
          <button
            aria-label="Close menu"
            onClick={toggleMobile}
            className="text-white/90 hover:text-white p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-2 mt-2">
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-2 text-white/85 hover:text-white font-semibold tracking-wide border-b border-white/10"
              >
                <span className={`inline-block h-2.5 w-2.5 rounded-full border transition-colors ${hoveredIdx === idx ? 'bg-orange-500 border-orange-500' : 'border-white/40'}`}></span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3">
          <a href="#try" className="inline-flex items-center justify-center h-11 rounded-md bg-orange-500/90 hover:bg-orange-500 text-white font-semibold tracking-wide transition-colors">Try Now</a>
          <a href="#signin" className="inline-flex items-center justify-center h-11 rounded-md border border-white/25 text-white/80 hover:text-white hover:border-white/60 transition-colors font-medium">Sign In</a>
        </div>
      </div>
    </>
  );
};

export default Header;
