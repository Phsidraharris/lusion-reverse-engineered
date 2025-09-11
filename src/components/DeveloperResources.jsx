
const Resource = ({ imgLink, title, subtitle, btntext }) => {
  return (
    <div>
      <div className="w-full">
        <img className="mb-2" src={imgLink} alt="" />
        <span className="text-[14px] font-starcil">{subtitle}</span>
      </div>
      <div className="mt-5">
        <div className="lg:text-[24px] text-xl">{title}</div>
        <div className="mt-5 text-[14px] text-blue-400 font-starcil">
          <a href="">{btntext}</a>
        </div>
      </div>
    </div>
  );
};

function DeveloperResources() {
  return (
    <div>
      <div className="bg-[#0C1210] relative py-16 2xl:px-44 lg:px-24 px-5 text-white">
        <div className="lg:text-5xl text-4xl font-serif font-medium mb-8">
          Blogs
        </div>
        <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-x-5 gap-y-16 sm:px-24 md:p-0 px-4">
          <Resource
            imgLink="https://cdn.sanity.io/images/rjtqmwfu/production/5c1f86ba769235354f93a421eeb871f0d2a52e1b-424x212.svg"
            title="Explore how the latest AI advancements can apply to your business"
            subtitle="PLAYGROUND"
            btntext="GO TO PLAYGROUND"
          />
          <Resource
            imgLink="https://cdn.sanity.io/images/rjtqmwfu/production/a2a06112e210ab59350f98cfdb11067b7d56e588-424x212.svg"
            title="Get the competitive edge in generative AI with courses from LLM University"
            subtitle="LLM UNIVERSITY"
            btntext="Learn More"
          />
          <Resource
            imgLink="https://cdn.sanity.io/images/rjtqmwfu/production/48866e4b00604442d89ba0911fe6b0d62815d68b-424x212.svg"
            title="Start integrating Rodiax’s AI models into your apps and workflows"
            subtitle="DEVELOPER DOCS"
            btntext="READ THE DOCS"
          />
        </div>
      </div>
    </div>
  );
}

export default DeveloperResources;
