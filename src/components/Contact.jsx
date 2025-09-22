import { Link } from 'react-router-dom';
import Button from './Button';
import { LazyGlareCard } from './LazyComponents';
import { Suspense } from 'react';

const contactMethods = [
  {
    title: 'Email Support',
    description: 'Get help from our support team within 24 hours',
    contact: 'support@rodiax.com',
    icon: '📧',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Live Chat',
    description: 'Chat with our AI assistant or connect with a human agent',
    contact: 'Available 24/7',
    icon: '💬',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our technical support team',
    contact: '+1 (555) 123-4567',
    icon: '📞',
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Enterprise Sales',
    description: 'Discuss custom solutions and enterprise pricing',
    contact: 'sales@rodiax.com',
    icon: '🏢',
    color: 'from-orange-500 to-red-600'
  }
];

const socialLinks = [
  {
    name: 'Twitter',
    handle: '@rodiax_ai',
    url: 'https://twitter.com/rodiax_ai',
    icon: '🐦',
    description: 'Follow us for the latest AI news and updates'
  },
  {
    name: 'LinkedIn',
    handle: 'Rodiax AI',
    url: 'https://linkedin.com/company/rodiax-ai',
    icon: '💼',
    description: 'Connect with us professionally and see job openings'
  },
  {
    name: 'Discord',
    handle: 'Rodiax Community',
    url: 'https://discord.gg/rodiax',
    icon: '🎮',
    description: 'Join our developer community and get real-time support'
  },
  {
    name: 'GitHub',
    handle: 'rodiax-ai',
    url: 'https://github.com/rodiax-ai',
    icon: '⚡',
    description: 'Explore our open-source projects and contribute'
  }
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent/10 to-brand-background py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-brand-text/80 max-w-3xl mx-auto">
              Ready to transform your business with AI? Our team is here to help you
              get started and answer any questions you might have.
            </p>
          </div>

          {/* Quick Contact Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-4 bg-brand-background/50 backdrop-blur-sm rounded-lg border border-brand-text/10">
                <div className="text-2xl mb-2">{method.icon}</div>
                <h3 className="font-semibold text-brand-text mb-1">{method.title}</h3>
                <p className="text-sm text-brand-text/80">{method.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-brand-text mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent"
                  placeholder="john.doe@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Subject
                </label>
                <select className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Sales Question</option>
                  <option>Partnership Opportunity</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-brand-background border border-brand-text/20 rounded-lg text-brand-text focus:outline-none focus:border-brand-accent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <Button
                title="Send Message"
                bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                textColor="text-white"
                textSize="text-base"
                className="w-full py-3"
              />
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-brand-text mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="p-6 bg-brand-secondary rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-2">Office Address</h3>
                <p className="text-brand-text/80">
                  123 Innovation Drive<br />
                  San Francisco, CA 94107<br />
                  United States
                </p>
              </div>
              <div className="p-6 bg-brand-secondary rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-2">Business Hours</h3>
                <p className="text-brand-text/80">
                  Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                  Saturday: 10:00 AM - 4:00 PM PST<br />
                  Sunday: Closed
                </p>
              </div>
              <div className="p-6 bg-brand-secondary rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-2">Response Times</h3>
                <p className="text-brand-text/80">
                  Email: Within 24 hours<br />
                  Live Chat: Immediate<br />
                  Phone: Immediate during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-brand-secondary py-16">
        <div className="max-w-screen-lg mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
              Connect With Us
            </h2>
            <p className="text-xl text-brand-text/80 max-w-2xl mx-auto">
              Follow us on social media and join our community to stay updated
              with the latest AI developments and company news.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => (
              <Suspense key={social.name} fallback={<div className="h-32 bg-brand-background rounded-lg"></div>}>
                <LazyGlareCard>
                  <div className="p-6 text-center h-full flex flex-col">
                    <div className="text-3xl mb-3">{social.icon}</div>
                    <h3 className="text-lg font-semibold text-brand-text mb-2">
                      {social.name}
                    </h3>
                    <p className="text-brand-text/70 text-sm mb-4 flex-grow">
                      {social.description}
                    </p>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-accent hover:text-brand-accent-hover font-medium text-sm"
                    >
                      {social.handle} →
                    </a>
                  </div>
                </LazyGlareCard>
              </Suspense>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;