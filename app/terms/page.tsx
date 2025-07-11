import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Legal Disclaimer
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These Terms of Service are a template provided for demonstration purposes only. 
                  They are NOT legally valid or enforceable. Please consult with a qualified attorney 
                  to create proper terms of service for your business.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms of Service Content */}
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using our SaaS Starter service ("Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not 
              access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              SaaS Template for AI provides a complete software-as-a-service template and related tools 
              for building SaaS applications. The Service includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Source code and template files</li>
              <li>Documentation and guides</li>
              <li>Community support</li>
              <li>Updates and improvements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Access to the Service requires payment of applicable fees. By purchasing access, you agree that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>Payments are processed securely through Stripe</li>
              <li>You authorize us to charge your payment method</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by SaaS Template for AI 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              Upon purchase, you receive a limited, non-exclusive license to use the template code 
              for commercial and personal projects.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use the Service:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>For any unlawful purpose or to solicit unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations or laws</li>
              <li>To transmit or procure the sending of any advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate the company or other users</li>
              <li>To interfere with or circumvent security features of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Content and Conduct</h2>
            <p className="text-gray-700 mb-4">
              Our Service may allow you to post, link, store, share and otherwise make available certain 
              information, text, graphics, or other material. You are responsible for the content you post 
              and agree not to post content that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Is illegal, harmful, threatening, abusive, defamatory, or obscene</li>
              <li>Violates the rights of others</li>
              <li>Contains viruses or malicious code</li>
              <li>Infringes on intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, 
              without prior notice or liability, under our sole discretion, for any reason whatsoever 
              including but not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The information on this Service is provided on an "as is" basis. To the fullest extent 
              permitted by law, this Company excludes all representations, warranties, conditions and 
              terms whether express or implied.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall SaaS Template for AI, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms 
              taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Email: <a href="mailto:legal@example.com" className="text-primary hover:text-primary/80">legal@example.com</a><br />
                Address: [Your Company Address]
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
} 