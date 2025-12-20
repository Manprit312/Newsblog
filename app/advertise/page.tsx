import Link from 'next/link';
import { Megaphone, TrendingUp, Eye, Target, BarChart3, Mail, Phone, CheckCircle } from 'lucide-react';

export default function AdvertisePage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
            <Megaphone className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-blue dark:text-primary-yellow mb-4">
            Advertise With Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Reach your target audience with NewsBlogs. We offer effective advertising solutions 
            to help your business grow.
          </p>
        </header>

        {/* Why Advertise Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-secondary-blue to-blue-700 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Choose NewsBlogs?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">High Visibility</h3>
                </div>
                <p className="text-blue-100">
                  Reach thousands of engaged readers daily with our premium ad placements.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Targeted Audience</h3>
                </div>
                <p className="text-blue-100">
                  Connect with your ideal customers through our category-specific placements.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Proven Results</h3>
                </div>
                <p className="text-blue-100">
                  Track your campaign performance with detailed analytics and reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Advertising Options */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">
            Advertising Options
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Banner Ads
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Premium header and sidebar placements</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Multiple size options available</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>High click-through rates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-blue-400 dark:border-blue-600 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Sponsored Content
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Native content integration</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Editorial-quality sponsored articles</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Increased brand awareness</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-green-400 dark:border-green-600 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Category Sponsorship
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Exclusive category branding</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Featured placement in category pages</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Long-term partnership opportunities</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-purple-400 dark:border-purple-600 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Newsletter Ads
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Direct email marketing</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>High engagement rates</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Weekly or monthly campaigns</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center">
              Flexible Pricing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
              We offer competitive pricing packages tailored to your advertising needs. 
              Contact us for a custom quote based on your campaign requirements.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Basic</h3>
                <p className="text-3xl font-bold text-secondary-blue mb-4">Starting at ₹5,000<span className="text-sm text-gray-500">/month</span></p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Banner ad placement</li>
                  <li>• 10,000+ impressions</li>
                  <li>• Basic analytics</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-yellow-400 dark:border-yellow-600 shadow-lg">
                <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Premium</h3>
                <p className="text-3xl font-bold text-secondary-blue mb-4">Starting at ₹15,000<span className="text-sm text-gray-500">/month</span></p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Multiple ad placements</li>
                  <li>• 50,000+ impressions</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Enterprise</h3>
                <p className="text-3xl font-bold text-secondary-blue mb-4">Custom Pricing</p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Custom ad solutions</li>
                  <li>• Unlimited impressions</li>
                  <li>• Dedicated account manager</li>
                  <li>• Custom reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
              Contact our advertising team to discuss your campaign goals and get a custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:advertise@newsblogs.com"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                advertise@newsblogs.com
              </a>
              <a
                href="tel:+919876543210"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                +91-98765-43210
              </a>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            For media kit and detailed advertising information, please{' '}
            <Link href="/contact" className="text-secondary-blue hover:underline font-semibold">
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

