import growth from "../assets/growth.png";
import model from "../assets/model.png";
import Button from "./Button";

function Service() {
  return (
    <div
      className="2xl:px-40 lg:px-22 px-6 bg-cover bg-center flex flex-col gap-y-12 py-16 text-brand-fg" style={{ backgroundColor: "cadetblue" }}
    >
      {/* First Section */}
      <div className="relative flex items-center justify-between flex-wrap gap-y-6 md:flex-nowrap w-full py-12 font-starcil">
        <div className="sm:w-full md:w-3/4 xl:w-[50%] lg:w-[70%]">
        
          <div  className="flex gap-3 mb-3"
          >
    
            
             <section id="video-panel-section">
            <div className="about-headers">
              <div className="animated-h1-container">
                <h1 id="h1-topline">BEYOND VISIONS</h1>
              </div>
              <div className="animated-h1-container">
                <h1 id="h1-tagline">WITHIN REACH</h1>
              </div>
            </div>


          </section>
          </div>
          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight">
              Our models are designed to augment and elevate the global workforce, so businesses can thrive and stay competitive in the AI era.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img alt="" className="max-w-full h-auto" />
        </div>
      </div>

      {/* Second Section */}
  <div className="relative flex items-center justify-between flex-wrap gap-y-10 md:flex-nowrap w-full py-14 font-serif font-medium bg-white/10 backdrop-blur rounded-3xl border border-white/10">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end md:order-1 order-2">
          <img src={growth} alt="" className="max-w-full h-auto" />
        </div>
        <div className="sm:w-full md:w-3/4 lg:w-[60%] xl:w-[50%] flex justify-start flex-wrap flex-col 2xl:px-20 lg:px-10 px-4 order-1 md:order-2">
          <div className="flex gap-3 items-center text-[11px] tracking-wide my-2 uppercase">
            <p className="px-2 py-1 bg-purple-500/80 rounded-md text-white font-semibold">NEW</p>
            <p className="text-brand-fg/80">COMMAND</p>
            <img
              src="https://cdn.sanity.io/images/rjtqmwfu/production/a1909385aa103bc3e54a2d23908601d7efbab49f-16x16.svg"
              alt=""
              className="w-4 h-4"
            />
          </div>

          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-tight">
              Rodiax Command, powering innovation with enterprise GenAI
            </p>
            <p className="mb-8 text-base leading-relaxed text-brand-fg/90">
              Command models are used by companies to build production-ready, scalable and efficient AI-powered applications.
            </p>
            <Button
              bgColor="bg-black hover:bg-black/80"
              textSize="text-sm tracking-wide"
              title="Learn more"
            />
          </div>
        </div>
      </div>

      {/* Third Section */}
  <div className="relative flex items-center justify-between flex-wrap gap-y-10 md:flex-nowrap w-full py-14 font-serif font-medium bg-white/10 backdrop-blur rounded-3xl border border-white/10">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end order-2">
          <img src={model} alt="" className="max-w-full h-auto" />
        </div>
        <div className="sm:w-full md:w-3/4 lg:w-[60%] xl:w-[50%] flex justify-start flex-wrap flex-col 2xl:px-20 lg:px-10 px-4 order-1">
          <div className="flex gap-3 items-center text-[11px] tracking-wide my-2 uppercase">
            <p className="text-brand-fg/80">Embed</p>
            <img
              src="https://cdn.sanity.io/images/rjtqmwfu/production/edc039dd5d2fa738f669b38dba03cd6de786a7ef-16x16.svg"
              alt=""
              className="w-4 h-4"
            />
          </div>

          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-tight">
              Rodiax Embed, unlocking the full potential of your enterprise data
            </p>
            <p className="mb-8 text-base leading-relaxed text-brand-fg/90">
              We have trained our models on the language of business to enable the most accurate and efficient solution. Scale your Enterprise AI strategy starting with the highest performing embedding model, which supports over 100 languages.
            </p>
            <Button
              bgColor="bg-black hover:bg-black/80"
              textSize="text-sm tracking-wide"
              title="Learn more"
            />
          </div>
        </div>
      </div>

      {/* Forth Section */}
  <div className="relative flex items-center justify-between flex-wrap gap-y-10 md:flex-nowrap w-full py-14 font-serif font-medium bg-white/10 backdrop-blur rounded-3xl border border-white/10">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end md:order-1 order-2">
          <img src={growth} alt="" className="max-w-full h-auto" />
        </div>
        <div className="sm:w-full md:w-3/4 lg:w-[60%] xl:w-[50%] flex justify-start flex-wrap flex-col 2xl:px-20 lg:px-10 px-4 md:order-2 order-1">
          <div className="flex gap-3 items-center text-[11px] tracking-wide my-2 uppercase">
            <p className="text-brand-fg/80">RETRIEVAL & RERANK</p>
            <img
              src="https://cdn.sanity.io/images/rjtqmwfu/production/3a6986e934884dcfd228cf2bdd4680c1915d8d43-16x16.svg"
              alt=""
              className="w-4 h-4"
            />
          </div>

          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-tight">
              Rodiax Rerank, surfacing the industry’s most accurate responses.
            </p>
            <p className="mb-8 text-base leading-relaxed text-brand-fg/90">
              The combination of Rerank and Embed delivers the most reliable and up-to-date responses for your application, grounding retrieval-augmented generation (RAG) in your data.
            </p>
            <Button
              bgColor="bg-black hover:bg-black/80"
              textSize="text-sm tracking-wide"
              title="Learn more"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Service;
