import Button from "./Button";

function DeploymentOption() {
  const deploymentOptions = [
    "https://cdn.sanity.io/images/rjtqmwfu/production/0adbf394439f4cd0ab8b5b3b6fe1da10c8099024-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/3121e36c6a2270a890e2721ecb40b9637fa7055f-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/643f6e32aa0ce3ac6540bcbccb5274a0a4af1ba0-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/53437df4220d35e45d5a0a66fbde6110366bf0e2-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/1455da306f9f50dc2b28eb81ef080f7c1c8b8e6d-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/870d461f4de551ead02c43531936113310be9389-201x200.svg",
  ];
  return (
    <section>
      <div className="bg-[#E6E3DB] relative flex justify-between items-center lg:gap-x-36 md:gap-x-10 gap-y-10 flex-wrap md:flex-nowrap py-16 2xl:px-44 lg:px-24 px-5">
        <div className="md:w-[40%] w-full flex flex-col gap-y-8">
          <div>
            <div className="mb-3">DEPLOYMENT OPTIONS</div>
            <div className="lg:text-4xl md:text-3xl text-2xl">
              Enterprise-grade AI deployment on any cloud or on-premises
            </div>
          </div>
          <div className="text-[17px] mb-10 text-justify">
            Only Rodiax provides flexible and secure deployment options. Bring
            our models to your data.
          </div>
          <div>
            <Button
              bgColor="bg-black"
              textColor="text-white"
              textSize="text-[14px]"
              title="TRY THE PLAYGROUND"
            />
          </div>
        </div>
        <div className="w-full grid md:grid-cols-3 grid-cols-2 md:gap-5 gap-y-5 gap-x-5">
          {deploymentOptions.map((option, index) => (
            <img key={index} className="w-full" src={option} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DeploymentOption;
