import { Link } from 'react-router-dom';
import Button from './Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <div className="text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-brand-accent mb-4 animate-pulse">
              404
            </div>
            <div className="text-6xl mb-8">🚀</div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-brand-text/80 max-w-2xl mx-auto mb-8">
              It looks like you've ventured into uncharted territory. The page you're looking for
              doesn't exist or has been moved to a different location.
            </p>
            <div className="text-lg text-brand-text/60 max-w-xl mx-auto">
              Don't worry! Our AI assistant can help guide you back to safety.
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Link to="/" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Home
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Return to our homepage to explore our AI solutions
                </p>
              </div>
            </Link>

            <Link to="/products" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">🛠️</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Products
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Discover our powerful AI tools and services
                </p>
              </div>
            </Link>

            <Link to="/developers" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Developers
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Access our developer tools and documentation
                </p>
              </div>
            </Link>

            <Link to="/solutions" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Solutions
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Explore AI solutions for your industry
                </p>
              </div>
            </Link>

            <Link to="/company" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Company
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Learn about our mission and values
                </p>
              </div>
            </Link>

            <Link to="/contact" className="group">
              <div className="p-6 bg-brand-secondary rounded-lg border border-brand-text/10 hover:border-brand-accent/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="text-lg font-semibold text-brand-text mb-2 group-hover:text-brand-accent">
                  Contact
                </h3>
                <p className="text-brand-text/70 text-sm">
                  Get in touch with our support team
                </p>
              </div>
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="bg-brand-secondary p-6 rounded-lg mb-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-brand-text mb-3">
              Looking for something specific?
            </h3>
            <p className="text-brand-text/80 mb-4">
              Try searching for what you need, or use the navigation options above to find your way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                title="Search Documentation"
                bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                textColor="text-white"
                textSize="text-sm"
              />
              <Button
                title="Browse API Reference"
                bgColor="bg-transparent border border-brand-accent hover:bg-brand-accent"
                textColor="text-brand-accent hover:text-white"
                textSize="text-sm"
              />
            </div>
          </div>

          {/* Fun Message */}
          <div className="text-center">
            <p className="text-brand-text/60 mb-4">
              "404: The page you requested has joined the AI training data" 🚀
            </p>
            <p className="text-sm text-brand-text/50">
              If you believe this is an error, please{' '}
              <Link to="/contact" className="text-brand-accent hover:text-brand-accent-hover underline">
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;