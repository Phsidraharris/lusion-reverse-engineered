import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-brand-secondary rounded-lg p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-text mb-4">Privacy Policy</h1>
            <p className="text-brand-text/80">Last updated: September 21, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none text-brand-text">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account,
                use our services, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Account credentials and preferences</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Usage data and analytics information</li>
                <li>Communication records and support tickets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide, maintain, and improve our AI services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Develop new features and services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties
                without your consent, except as described in this policy. We may share your information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage,
                and provide personalized content. You can control cookie preferences through your
                browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">7. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own.
                We ensure appropriate safeguards are in place to protect your data during such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">8. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">9. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any
                material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">10. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-brand-background p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> privacy@rodiax.com</p>
                <p className="mb-2"><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94107</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-text/20">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-lg transition-colors">
                  Contact Privacy Team
                </button>
              </Link>
              <Link to="/">
                <button className="px-6 py-3 bg-transparent border border-brand-text/20 hover:bg-brand-text/10 text-brand-text rounded-lg transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;