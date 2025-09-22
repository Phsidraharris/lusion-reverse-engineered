import { Link } from 'react-router-dom';
import Button from './Button';
import { LazyGlareCard } from './LazyComponents';
import { Suspense } from 'react';

const companySections = [
  {
    title: 'About',
    description: 'Learn about our mission to democratize AI and make it accessible to everyone.',
    icon: 'ℹ️',
    color: 'from-blue-500 to-indigo-600',
    content: 'Founded in 2023, Rodiax is pioneering the future of artificial intelligence with cutting-edge solutions that transform how businesses operate and innovate.'
  },
  {
    title: 'Blog',
    description: 'Stay updated with the latest AI trends, insights, and company announcements.',
    icon: '📝',
    color: 'from-green-500 to-emerald-600',
    content: 'Our blog features expert insights, tutorials, and thought leadership on AI, machine learning, and the future of technology.'
  },
  {
    title: 'Research',
    description: 'Explore our groundbreaking research in AI, machine learning, and related fields.',
    icon: '🔬',
    color: 'from-purple-500 to-violet-600',
    content: 'Our research team publishes peer-reviewed papers and open-source contributions to advance the field of AI for the benefit of all.'
  },
  {
    title: 'Careers',
    description: 'Join our talented team and help shape the future of artificial intelligence.',
    icon: '🚀',
    color: 'from-orange-500 to-red-600',
    content: 'We\'re always looking for passionate individuals to join our mission of making AI accessible and beneficial to everyone.'
  },
  {
    title: 'Newsroom',
    description: 'Press releases, media coverage, and company updates from Rodiax.',
    icon: '📰',
    color: 'from-cyan-500 to-blue-600',
    content: 'Stay informed about our latest partnerships, product launches, and achievements in the AI industry.'
  }
];

const Company = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-background py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
              About Rodiax
            </h1>
            <p className="text-xl text-brand-text/80 max-w-3xl mx-auto">
              We're on a mission to democratize artificial intelligence and make it accessible
              to businesses and developers worldwide. Discover our story, values, and vision.
            </p>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { number: '2023', label: 'Founded' },
              { number: '500+', label: 'Team Members' },
              { number: '10K+', label: 'Active Users' },
              { number: '50+', label: 'Countries' }
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

      {/* Company Sections */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companySections.map((section, index) => (
            <Suspense key={section.title} fallback={<div className="h-96 bg-brand-secondary rounded-lg"></div>}>
              <LazyGlareCard className="h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-2xl font-semibold text-brand-text mb-3">
                    {section.title}
                  </h3>
                  <p className="text-brand-text/80 mb-4 flex-grow">
                    {section.content}
                  </p>
                  <p className="text-brand-text/70 text-sm mb-6">
                    {section.description}
                  </p>
                  <Button
                    title="Learn More"
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

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-brand-accent/20 to-brand-accent-hover/20 py-16">
        <div className="max-w-screen-lg mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-brand-text/80 mb-8 max-w-3xl mx-auto">
            To democratize artificial intelligence by making powerful AI tools accessible,
            affordable, and easy to use for businesses and developers worldwide, fostering
            innovation and driving positive change across all industries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/careers">
              <Button
                title="Join Our Team"
                bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                textColor="text-white"
                textSize="text-base"
              />
            </Link>
            <Link to="/contact">
              <Button
                title="Get In Touch"
                bgColor="bg-transparent border-2 border-brand-accent hover:bg-brand-accent"
                textColor="text-brand-accent hover:text-white"
                textSize="text-base"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
            Our Values
          </h2>
          <p className="text-xl text-brand-text/80 max-w-2xl mx-auto">
            The principles that guide everything we do at Rodiax
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: 'Innovation',
              description: 'We push the boundaries of what\'s possible with AI technology.'
            },
            {
              title: 'Accessibility',
              description: 'We believe AI should be accessible to everyone, not just large corporations.'
            },
            {
              title: 'Ethics',
              description: 'We prioritize responsible AI development and deployment.'
            },
            {
              title: 'Collaboration',
              description: 'We work together with our community to build better solutions.'
            }
          ].map((value, index) => (
            <div key={index} className="p-6 bg-brand-secondary rounded-lg">
              <h3 className="text-xl font-semibold text-brand-accent mb-3">
                {value.title}
              </h3>
              <p className="text-brand-text/80">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Company;