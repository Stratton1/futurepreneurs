import { Mail, MessageSquare, Clock, HelpCircle, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Futurepreneurs',
  description: 'Get in touch with the Futurepreneurs team. We are here to help students, teachers, parents, and supporters.',
};

export default function ContactPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Mail className="h-4 w-4" />
              Get in touch
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              We&apos;d love to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                hear from you
              </span>
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re a student with a question, a teacher wanting to get involved, or a parent looking for information — we&apos;re here to help.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ CONTACT OPTIONS ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateIn animation="fade-up" delay={0}>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 text-center border border-blue-100 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-5">
                  <Mail className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm mb-4">
                  For general enquiries, partnerships, or press.
                </p>
                <a
                  href="mailto:hello@futurepreneurs.co.uk"
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  hello@futurepreneurs.co.uk
                </a>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={100}>
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 text-center border border-emerald-100 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-5">
                  <HelpCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Help Centre</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find answers to common questions about using the platform.
                </p>
                <Link
                  href="/faq"
                  className="text-emerald-600 font-semibold hover:underline text-sm"
                >
                  Visit FAQ →
                </Link>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={200}>
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 text-center border border-amber-100 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-2xl mb-5">
                  <Shield className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Safety Concerns</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Report inappropriate content or safety issues.
                </p>
                <a
                  href="mailto:safety@futurepreneurs.co.uk"
                  className="text-amber-600 font-semibold hover:underline text-sm"
                >
                  safety@futurepreneurs.co.uk
                </a>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Send us a message</h2>
              <p className="text-gray-600">Fill in the form below and we&apos;ll get back to you within 2 working days.</p>
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={100}>
            <form className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. Sarah Davies"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                  I am a...
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Mentor</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="supporter">Supporter</option>
                  <option value="school">School Administrator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="What is your message about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                Send Message
              </button>
              <p className="text-xs text-gray-400 text-center">
                By sending this message you agree to our{' '}
                <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </form>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ RESPONSE TIMES ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-bold text-gray-900">2 working days</p>
                <p className="text-sm text-gray-500">General enquiries</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MessageSquare className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="font-bold text-gray-900">24 hours</p>
                <p className="text-sm text-gray-500">Safety reports</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Users className="h-8 w-8 text-amber-500" />
              <div>
                <p className="font-bold text-gray-900">5 working days</p>
                <p className="text-sm text-gray-500">School partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
