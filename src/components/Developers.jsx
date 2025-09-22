import { Link } from 'react-router-dom';
import Button from './Button';
import { LazyGlareCard } from './LazyComponents';
import { Suspense } from 'react';

const developerSections = [
  {
    title: 'Playground',
    description: 'Interactive environment to test and experiment with our AI models in real-time.',
    features: [
      'Real-time model testing',
      'Interactive API playground',
      'Custom parameter tuning',
      'Result visualization tools'
    ],
    icon: '🎮',
    color: 'from-purple-500 to-pink-600',
    cta: 'Try Playground'
  },
  {
    title: 'LLM University',
    description: 'Comprehensive learning platform for mastering large language model development.',
    features: [
      'Interactive tutorials',
      'Video courses',
      'Hands-on projects',
      'Community forums'
    ],
    icon: '🎓',
    color: 'from-blue-500 to-cyan-600',
    cta: 'Start Learning'
  },
  {
    title: 'Documentation',
    description: 'Complete guides and references for integrating our APIs into your applications.',
    features: [
      'Getting started guides',
      'API reference docs',
      'Code examples',
      'Best practices'
    ],
    icon: '📚',
    color: 'from-green-500 to-emerald-600',
    cta: 'View Docs'
  },
  {
    title: 'API Reference',
    description: 'Detailed technical documentation for all our APIs and SDKs.',
    features: [
      'REST API endpoints',
      'SDK documentation',
      'Authentication guides',
      'Rate limiting info'
    ],
    icon: '⚙️',
    color: 'from-orange-500 to-red-600',
    cta: 'Browse APIs'
  },
  {
    title: 'Responsible Use',
    description: 'Guidelines and best practices for ethical AI development and deployment.',
    features: [
      'Ethical AI guidelines',
      'Bias detection tools',
      'Privacy protection',
      'Regulatory compliance'
    ],
    icon: '🛡️',
    color: 'from-indigo-500 to-purple-600',
    cta: 'Learn More'
  }
];

const Developers = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-background py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
              Developer Hub
            </h1>
            <p className="text-xl text-brand-text/80 max-w-3xl mx-auto">
              Everything you need to build amazing AI-powered applications.
              From interactive playgrounds to comprehensive documentation.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { number: '10M+', label: 'API Calls/Day' },
              { number: '99.9%', label: 'API Uptime' },
              { number: '50+', label: 'SDK Languages' },
              { number: '1K+', label: 'Active Developers' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-brand-text/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Tools */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developerSections.map((section, index) => (
            <Suspense key={section.title} fallback={<div className="h-96 bg-brand-secondary rounded-lg"></div>}>
              <LazyGlareCard className="h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-2xl font-semibold text-brand-text mb-3">
                    {section.title}
                  </h3>
                  <p className="text-brand-text/80 mb-4 flex-grow">
                    {section.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {section.features.map((feature, fIndex) => (
                      <li key={fIndex} className="text-brand-text/70 text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    title={section.cta}
                    bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                    textColor="text-white"
                    textSize="text-sm"
                    className="w-full"
                  />
                </div>
              </LazyGlareCard>
            </Suspense>
          ))}
        </div>
      </div>

      {/* SDK Support Section */}
      <div className="bg-brand-secondary py-16">
        <div className="max-w-screen-lg mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
            SDK Support
          </h2>
          <p className="text-xl text-brand-text/80 mb-8 max-w-2xl mx-auto">
            Build with our AI APIs in your favorite programming language.
            We support all major languages and frameworks.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {['Python', 'JavaScript', 'Java', 'Go', 'Rust', 'C++'].map((lang, index) => (
              <div key={index} className="p-4 bg-brand-background rounded-lg border border-brand-text/10">
                <div className="text-brand-accent font-mono text-sm font-semibold">
                  {lang}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              title="Get API Key"
              bgColor="bg-brand-accent hover:bg-brand-accent-hover"
              textColor="text-white"
              textSize="text-base"
            />
            <Button
              title="View Examples"
              bgColor="bg-transparent hover:bg-brand-text/10"
              textColor="text-brand-text"
              textSize="text-base"
              className="border border-brand-text/20"
            />
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-brand-text/80 max-w-2xl mx-auto">
            Connect with fellow developers, share your projects, and get help from our team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Discord Community',
              description: 'Join thousands of developers in our Discord server',
              members: '15K+ members'
            },
            {
              title: 'GitHub Repository',
              description: 'Contribute to our open-source projects and examples',
              repos: '100+ repos'
            },
            {
              title: 'Developer Forum',
              description: 'Ask questions, share knowledge, and get support',
              posts: '10K+ posts'
            }
          ].map((community, index) => (
            <div key={index} className="p-6 bg-brand-secondary rounded-lg text-center">
              <h3 className="text-xl font-semibold text-brand-accent mb-3">
                {community.title}
              </h3>
              <p className="text-brand-text/80 mb-4">
                {community.description}
              </p>
              <div className="text-sm text-brand-text/60">
                {community.members || community.repos || community.posts}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developers;