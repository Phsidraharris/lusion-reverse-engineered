import React from "react";

const LogoCarousel = () => {
  const logos = [
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/2c9edaee49f36102928edaa202f77008f801c6af-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/5836b142b7434a7600de0481735a41a310dd3c3c-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/c9053f2252c422175ed24ada94d8303b08730973-170x60.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/2c9edaee49f36102928edaa202f77008f801c6af-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/5836b142b7434a7600de0481735a41a310dd3c3c-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/f1163cec6c67cfa49c1bd24c51cab25de1788048-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/199ef79cb7820cf40b26b2bdf96a7eec16e024dc-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/429ca4e92c8162a325a4111da401c7878ee8320e-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/fb12f73f1982db5501bd5acab9d22fb70dc3192d-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/b49bff7eada837373c1754bc7b915788e5493a5d-171x61.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/web3-prod/44b6dcb718341a204c9684ecd69889fd204d1368-170x60.svg",
  ];

  return (
    <div className="relative flex items-center sm:justify-center justify-start sm:flex-nowrap flex-wrap w-full bg-[#212121] py-8 px-12 lg:px-20 2xl:px-44">
      {/* Left Section */}
      <div className="flex-shrink-0 mr-8 mb-8 sm:mb-0">
        <div className="text-white">
          <h2>Our Customers</h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden w-full">
        {/* Gradient overlay (left) */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#212121] to-transparent pointer-events-none z-10"></div>
        {/* Gradient overlay (right) */}
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#212121] to-transparent pointer-events-none z-10"></div>

        <div className="flex animate-scroll">
          {logos.concat(logos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Customer ${index + 1}`}
              className="h-11 mx-8 bg-white/80 p-2 rounded-md shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
