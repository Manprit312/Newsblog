import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-blue dark:text-primary-yellow">
            Contact Us
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Have a story tip, feedback, or business inquiry? Reach out and our team will get back to you.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Get in touch
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can call us directly from your phone, send us an email, or fill out the form with your message.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-secondary-blue" />
                <a href="tel:+919876543210" className="text-secondary-blue hover:underline">
                  +91-98765-43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-secondary-blue" />
                <a
                  href="mailto:contact@newsblogs.com"
                  className="text-secondary-blue hover:underline"
                >
                  contact@newsblogs.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-secondary-blue" />
                <p className="text-gray-600 dark:text-gray-300">
                  NewsBlogs Headquarters<br />
                  Your City, Your State
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-secondary-blue focus:outline-none focus:ring-1 focus:ring-secondary-blue dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-secondary-blue focus:outline-none focus:ring-1 focus:ring-secondary-blue dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-secondary-blue focus:outline-none focus:ring-1 focus:ring-secondary-blue dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  placeholder="What would you like to tell us?"
                />
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md bg-secondary-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary-blue-dark"
              >
                Send message
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This form is for demo purposes only. You can edit it later to submit to your backend or a service
                like Formspree.
              </p>
            </form>
          </section>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Prefer social? Use the links in the top bar or footer to follow NewsBlogs.
        </div>
      </div>
    </div>
  );
}






