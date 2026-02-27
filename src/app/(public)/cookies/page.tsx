import { Cookie, Shield, Settings, BarChart3, Lock, Info } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — Futurepreneurs',
  description: 'How Futurepreneurs uses cookies and similar technologies. We keep it simple — essential cookies only.',
};

const LAST_UPDATED = '26 February 2026';

const cookieTable = [
  {
    name: 'sb-access-token',
    purpose: 'Keeps you securely logged in to your account',
    type: 'Essential',
    duration: '1 hour',
    provider: 'Supabase',
  },
  {
    name: 'sb-refresh-token',
    purpose: 'Refreshes your login session so you don\'t have to sign in repeatedly',
    type: 'Essential',
    duration: '7 days',
    provider: 'Supabase',
  },
  {
    name: '__stripe_mid',
    purpose: 'Fraud prevention during payment processing',
    type: 'Essential',
    duration: '1 year',
    provider: 'Stripe',
  },
  {
    name: '__stripe_sid',
    purpose: 'Fraud prevention during active payment session',
    type: 'Essential',
    duration: 'Session',
    provider: 'Stripe',
  },
  {
    name: 'walkthrough_*_complete',
    purpose: 'Remembers if you\'ve completed the platform tour so it doesn\'t show again',
    type: 'Functional',
    duration: 'Persistent',
    provider: 'Futurepreneurs',
  },
  {
    name: 'help_feedback_*',
    purpose: 'Remembers your feedback on help articles to avoid repeat prompts',
    type: 'Functional',
    duration: 'Persistent',
    provider: 'Futurepreneurs',
  },
];

const sections = [
  {
    icon: Info,
    title: '1. What Are Cookies?',
    color: 'blue',
    content: [
      'Cookies are small text files that are placed on your device (computer, phone, or tablet) when you visit a website.',
      'They help the website remember your preferences and keep you logged in. Without cookies, websites wouldn\'t be able to tell if you\'re signed in or not.',
      'Cookies are widely used across the internet and are essential for most modern websites to work properly.',
      'We only use cookies that are necessary for the platform to function. We do not use any advertising or tracking cookies.',
    ],
  },
  {
    icon: Shield,
    title: '2. How We Use Cookies',
    color: 'emerald',
    content: [
      'Essential cookies: These are strictly necessary for the platform to work. They keep you logged in, maintain your session, and protect against fraud during payments.',
      'Functional cookies: These remember your preferences, like whether you\'ve completed the onboarding tour, so we can provide a better experience.',
      'We do NOT use any advertising cookies, third-party tracking pixels, or social media cookies.',
      'We do NOT track your activity across other websites. What you do on Futurepreneurs stays on Futurepreneurs.',
    ],
  },
  {
    icon: BarChart3,
    title: '3. Analytics',
    color: 'purple',
    content: [
      'We may use basic, privacy-friendly analytics to understand how many people visit the platform and which pages are most popular.',
      'All analytics data is anonymous — we cannot identify individual users from analytics data.',
      'We do not use Google Analytics or any third-party analytics service that tracks users across websites.',
      'Analytics data is used solely to improve the platform experience for our users.',
    ],
  },
  {
    icon: Lock,
    title: '4. Third-Party Cookies',
    color: 'amber',
    content: [
      'Stripe (our payment processor) may set cookies during the checkout process to prevent fraud. These are strictly necessary for safe payment processing.',
      'Supabase (our authentication provider) sets cookies to manage your login session securely.',
      'We do not allow any other third parties to set cookies through our platform.',
      'We do not use any social media plugins, advertising networks, or retargeting services.',
    ],
  },
  {
    icon: Settings,
    title: '5. Managing Your Cookies',
    color: 'rose',
    content: [
      'You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies from specific websites.',
      'Please note: if you block essential cookies, some parts of the platform may not work properly. You may not be able to log in or process payments.',
      'To manage cookies in Chrome: Settings → Privacy and Security → Cookies and other site data.',
      'To manage cookies in Firefox: Settings → Privacy & Security → Cookies and Site Data.',
      'To manage cookies in Safari: Preferences → Privacy → Manage Website Data.',
      'To manage cookies on iOS: Settings → Safari → Block All Cookies.',
      'For more information about cookies and how to manage them, visit www.allaboutcookies.org.',
    ],
  },
  {
    icon: Cookie,
    title: '6. Changes to This Policy',
    color: 'teal',
    content: [
      'We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.',
      'If we make significant changes that affect how we use cookies, we will notify registered users via email.',
      'We encourage you to review this page periodically to stay informed about our cookie practices.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
};

export default function CookiePolicyPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Cookie className="h-4 w-4" />
              Simple &amp; transparent
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Cookie Policy
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We keep cookies to a minimum. No advertising cookies, no cross-site tracking — just what&apos;s needed to keep the platform running safely.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ COOKIE TABLE ═══ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Cookies We Use</h2>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 font-medium">
                      <th className="p-3">Cookie</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Set by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieTable.map((cookie) => (
                      <tr key={cookie.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono text-xs text-gray-900">{cookie.name}</td>
                        <td className="p-3 text-gray-600">{cookie.purpose}</td>
                        <td className="p-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            cookie.type === 'Essential' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {cookie.type}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{cookie.duration}</td>
                        <td className="p-3 text-gray-500">{cookie.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ SECTIONS ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {sections.map((section, i) => {
            const colors = colorMap[section.color] || colorMap.blue;
            const Icon = section.icon;
            return (
              <AnimateIn key={i} animation="fade-up" delay={i * 50}>
                <div className={`rounded-2xl border ${colors.border} bg-white p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${colors.bg} rounded-xl p-2.5 shrink-0`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 pt-1">{section.title}</h2>
                  </div>
                  <ul className="space-y-3 ml-14">
                    {section.content.map((item, j) => (
                      <li key={j} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-gray-300 mt-1.5 shrink-0">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Questions about our cookie practices? Email us at{' '}
            <a href="mailto:privacy@futurepreneurs.co.uk" className="text-amber-600 font-semibold hover:underline">
              privacy@futurepreneurs.co.uk
            </a>{' '}
            or visit our{' '}
            <Link href="/privacy" className="text-amber-600 font-semibold hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
