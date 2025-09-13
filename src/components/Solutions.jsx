
import { Link } from 'react-router-dom';
import Button from './Button';
import GlareCard from './GlareCard';

const solutionCategories = [
  {
    title: 'Enterprise AI',
    description: 'Comprehensive AI solutions for large-scale enterprise deployment and management.',
    solutions: [
      'AI Infrastructure Management',
      'Multi-Model Orchestration',
      'Enterprise Security & Compliance',
      'Scalable Deployment'
    ],
    icon: '🏢',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Developer Tools',
    description: 'Powerful development tools and APIs to accelerate AI application development.',
    solutions: [
      'AI SDK & Libraries',
      'Model Fine-tuning Platform',
      'API Gateway & Management',
      'Development Sandbox'
    ],
    icon: '💻',
    color: 'from-green-500 to-teal-600'
  },
  {
    title: 'Industry Solutions',
    description: 'Tailored AI solutions for specific industries and use cases.',
    solutions: [
      'Healthcare AI Assistant',
      'Financial Risk Analysis',
      'Retail Personalization',
      'Manufacturing Optimization'
    ],
    icon: '🏭',
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'Analytics & Insights',
    description: 'Advanced analytics and business intelligence powered by AI.',
    solutions: [
      'Predictive Analytics',
      'Business Intelligence Dashboard',
      'Real-time Monitoring',
      'Performance Optimization'
    ],
    icon: '📊',
    color: 'from-purple-500 to-pink-600'
  }
];

const Solutions = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-background py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
              AI Solutions
            </h1>
            <p className="text-xl text-brand-text/80 max-w-3xl mx-auto">
              Discover our comprehensive AI solutions designed to transform industries,
              accelerate innovation, and drive business growth across every sector.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { number: '500+', label: 'Enterprise Clients' },
              { number: '99.9%', label: 'Uptime SLA' },
              { number: '24/7', label: 'Global Support' },
              { number: '50+', label: 'Countries Served' }
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

      {/* Solution Categories */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {solutionCategories.map((category, index) => (
            <GlareCard key={category.title} className="h-full">
              <div className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{category.icon}</div>
                  <h3 className="text-2xl font-semibold text-brand-text">
                    {category.title}
                  </h3>
                </div>
