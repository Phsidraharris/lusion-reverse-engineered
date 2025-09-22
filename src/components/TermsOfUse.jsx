import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-brand-background pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-brand-secondary rounded-lg p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-text mb-4">Terms of Use</h1>
            <p className="text-brand-text/80">Last updated: September 21, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none text-brand-text">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Rodiax's services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Rodiax provides AI-powered tools and services including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Natural language processing and generation</li>
                <li>API access to AI models</li>
                <li>Development tools and SDKs</li>
                <li>Educational resources and documentation</li>
                <li>Community forums and support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">3. User Accounts</h2>
              <p className="mb-4">To use certain features of our service, you may need to create an account:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to use the service to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Generate harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' experience</li>
                <li>Reverse engineer or copy our technology</li>
                <li>Create competing services using our proprietary technology</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">5. Intellectual Property</h2>
              <p className="mb-4">
                The service and its original content, features, and functionality are and will remain
                the exclusive property of Rodiax and its licensors. The service is protected by
                copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">6. API Usage and Limits</h2>
              <p className="mb-4">For API usage:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Rate limits apply and may be changed at any time</li>
                <li>Excessive usage may result in temporary or permanent suspension</li>
                <li>You must implement proper error handling</li>
                <li>API keys must be kept secure and not shared</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">7. Payment Terms</h2>
              <p className="mb-4">For paid services:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Fees are charged in advance on a recurring basis</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>Price changes will be communicated with reasonable notice</li>
                <li>Late payments may result in service suspension</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">8. Service Availability</h2>
              <p className="mb-4">
                We strive to maintain high availability, but we do not guarantee that the service
                will be uninterrupted or error-free. We reserve the right to modify or discontinue
                any part of the service with or without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">9. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall Rodiax, its directors, employees, or agents be liable for any
                indirect, incidental, special, consequential, or punitive damages arising out of
                your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">10. Indemnification</h2>
              <p className="mb-4">
                You agree to defend, indemnify, and hold harmless Rodiax and its licensee and
                licensors from and against any claims, damages, costs, and expenses arising out
                of your use of the service or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">11. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account immediately, without prior notice or
                liability, for any reason whatsoever, including without limitation if you breach
                these Terms of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">12. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be interpreted and governed by the laws of the State of California,
                United States, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">13. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision
                is material, we will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-brand-accent mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="bg-brand-background p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> legal@rodiax.com</p>
                <p className="mb-2"><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94107</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-text/20">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-lg transition-colors">
                  Contact Legal Team
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

export default TermsOfUse;