import Link from 'next/link';
import { Newspaper, Users, Target, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-blue dark:text-primary-yellow mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your trusted source for breaking news, in-depth analysis, and stories that matter.
          </p>
        </header>

        {/* Mission Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-secondary-blue to-blue-700 rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg leading-relaxed">
                  To deliver accurate, timely, and comprehensive news coverage that informs, educates, and empowers our readers. 
                  We are committed to journalistic integrity, transparency, and serving our community with the highest standards 
                  of news reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We uphold the highest standards of journalistic ethics and accuracy in every story we publish.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We are dedicated to serving our readers and amplifying voices that need to be heard.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for excellence in storytelling, reporting, and delivering quality content to our audience.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-12">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                NewsBlogs was founded with a simple yet powerful vision: to create a news platform that puts 
                readers first. In an era of information overload, we believe in quality over quantity, 
                truth over sensationalism, and community over clicks.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our team of experienced journalists, editors, and content creators work tirelessly to bring 
                you stories that matter. From breaking news to in-depth investigations, from local events to 
                global affairs, we cover it all with dedication and care.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We are more than just a news website—we are a community of informed citizens, passionate 
                storytellers, and committed truth-seekers. Join us on this journey as we continue to evolve 
                and grow, always keeping our readers at the heart of everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-secondary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Email</h3>
              <a 
                href="mailto:contact@newsblogs.com" 
                className="text-secondary-blue hover:underline"
              >
                contact@newsblogs.com
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-secondary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-secondary-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Phone</h3>
              <a 
                href="tel:+919876543210" 
                className="text-secondary-blue hover:underline"
              >
                +91-98765-43210
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-secondary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-secondary-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                NewsBlogs Headquarters<br />
                Your City, Your State
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
              Stay updated with the latest news and stories. Subscribe to our newsletter or follow us on social media.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/blogs"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Read Our Stories
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}




