import React from "react";
import Button from "./Button";

function RetrievalModels() {
  return (
    <section>
      <div className="bg-[#0C1210] text-gray-50 relative flex justify-between items-center lg:gap-x-20 md:gap-x-16 gap-y-10 flex-wrap md:flex-nowrap py-16 2xl:px-44 lg:px-24 px-5">
        <div className="2xl:w-full md:w-[50%] w-full flex flex-col gap-y-16">
          <div className="lg:text-5xl md:text-4xl text-2xl">
            Build with Advanced Retrieval
          </div>
          <div className="text-[17px] mb-10">
            Our Generative AI and Advanced Retrieval models work seamlessly
            together for applications requiring RAG. It's easy to connect and
            retrieve information from documents and enterprise data sources to
            build more powerful AI applications.
          </div>
          <div>
            <Button
              bgColor="bg-white"
              textColor="text-black"
              textSize="text-[14px]"
              title="TRY THE PLAYGROUND"
            />
          </div>
        </div>
        <div className="w-full">
          <img
            className="w-full"
            src="https://cdn.sanity.io/images/rjtqmwfu/production/4c7a6d577e79c43f4e0415b3f56f943616dff916-647x531.svg"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

export default RetrievalModels;
