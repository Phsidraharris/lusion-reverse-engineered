import { Link } from 'react-router-dom';
import Button from './Button';
import GlareCard from './GlareCard';

const productSections = [
  {
    title: 'Command',
    description: 'Powerful command-line interface for seamless AI integration. Execute complex tasks with simple commands.',
    features: ['Natural language processing', 'Batch operations', 'Custom workflows'],
    icon: '⚡'
  },
  {
    title: 'Embed',
    description: 'Embed AI capabilities directly into your applications with our robust embedding API.',
    features: ['RESTful API', 'SDK libraries', 'Real-time processing'],
    icon: '🔗'
  },
  {
    title: 'Rerank',
    description: 'Advanced reranking algorithms to improve search relevance and user experience.',
    features: ['Machine learning models', 'Custom scoring', 'A/B testing'],
    icon: '🎯'
  },
  {
    title: 'Fine-tuning',
    description: 'Customize AI models for your specific use cases with our fine-tuning platform.',
    features: ['Domain adaptation', 'Transfer learning', 'Performance optimization'],
    icon: '🔧'
  },
  {
    title: 'Pricing',
    description: 'Flexible pricing plans designed to scale with your business needs.',
    features: ['Pay-as-you-go', 'Volume discounts', 'Enterprise plans'],
    icon: '💰'
  }
];

const Products = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-background py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
              Our Products
            </h1>
            <p className="text-xl text-brand-text/80 max-w-3xl mx-auto">
              Discover our comprehensive suite of AI-powered tools designed to transform your workflow
              and accelerate your business growth.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {productSections.map((product) => (
              <a
                key={product.title}
                href={`#${product.title.toLowerCase()}`}
                className="px-4 py-2 bg-brand-background/50 backdrop-blur-sm rounded-lg text-brand-text hover:text-brand-accent transition-colors border border-brand-text/10 hover:border-brand-accent/30"
              >
                {product.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productSections.map((product, index) => (
            <div key={product.title} id={product.title.toLowerCase()}>
              <GlareCard className="h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="text-4xl mb-4">{product.icon}</div>
                  <h3 className="text-2xl font-semibold text-brand-text mb-3">
                    {product.title}
                  </h3>
                  <p className="text-brand-text/80 mb-4 flex-grow">
                    {product.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-brand-text/70">
                        <span className="w-1.5 h-1.5 bg-brand-accent rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    title="Learn More"
                    bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                    textColor="text-white"
                    textSize="text-sm"
                    className="w-full"
                  />
                </div>
              </GlareCard>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-accent/20 to-brand-accent-hover/20 py-16">
        <div className="max-w-screen-lg mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-brand-text/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and businesses already using our products to build amazing AI-powered experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              title="Start Free Trial"
              bgColor="bg-brand-accent hover:bg-brand-accent-hover"
              textColor="text-white"
              textSize="text-base"
            />
            <Link to="/contact">
              <Button
                title="Contact Sales"
                bgColor="bg-transparent border-2 border-brand-accent hover:bg-brand-accent"
                textColor="text-brand-accent hover:text-white"
                textSize="text-base"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;