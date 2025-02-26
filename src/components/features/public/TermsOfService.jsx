import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Shield } from 'lucide-react';

const TermsOfService = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`
              p-4 rounded-xl
              ${isDark ? 'bg-white/10' : 'bg-black/5'}
            `}>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-textSecondary">Last updated: March 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-textSecondary leading-relaxed">
              Welcome to LocalMarket. By accessing our website and using our services, you agree to these terms and conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            <div className="space-y-4 text-textSecondary leading-relaxed">
              <p>
                Our platform connects local producers with consumers. Users must be at least 18 years old to create an account and use our services.
              </p>
              <p>
                As a user, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not use the service for any illegal purposes</li>
                <li>Respect other users and their rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Seller Terms</h2>
            <div className="space-y-4 text-textSecondary leading-relaxed">
              <p>
                Sellers on LocalMarket must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate product descriptions</li>
                <li>Maintain quality standards</li>
                <li>Honor their commitments to buyers</li>
                <li>Comply with local regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Privacy & Security</h2>
            <p className="text-textSecondary leading-relaxed">
              We take your privacy seriously. Please review our Privacy Policy for details on how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
            <p className="text-textSecondary leading-relaxed">
              For any questions about these terms, please contact us at{' '}
              <a href="mailto:support@localmarket.com" className="text-primary hover:underline">
                support@localmarket.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 