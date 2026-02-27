import { Accessibility, Eye, Keyboard, Monitor, Ear, MessageCircle, Scale, Settings, FileText } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement — Futurepreneurs',
  description: 'Our commitment to making Futurepreneurs accessible to all users, including those with disabilities.',
};

const LAST_UPDATED = '26 February 2026';

const sections = [
  {
    icon: Eye,
    title: '1. Our Commitment',
    color: 'blue',
    content: [
      'Futurepreneurs is committed to ensuring digital accessibility for all users, including people with disabilities.',
      'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.',
      'We continually improve the user experience for everyone and apply the relevant accessibility standards.',
      'Accessibility is not a one-off project — it is an ongoing commitment embedded into our design and development process.',
      'This commitment applies to all pages and features of the Futurepreneurs platform, including the public website and authenticated dashboard areas.',
    ],
  },
  {
    icon: Keyboard,
    title: '2. Keyboard Navigation',
    color: 'emerald',
    content: [
      'All interactive elements (links, buttons, form fields, menus) can be reached and operated using a keyboard alone.',
      'We use visible focus indicators so you can always see which element is currently selected.',
      'Skip-to-content links are provided to allow keyboard users to bypass repeated navigation.',
      'Modal dialogs trap focus appropriately and can be dismissed using the Escape key.',
      'We avoid keyboard traps — you should never get stuck in a component and unable to navigate away.',
    ],
  },
  {
    icon: Monitor,
    title: '3. Visual Design',
    color: 'purple',
    content: [
      'Colour contrast: We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text, meeting WCAG AA requirements.',
      'Text resizing: All text can be resized up to 200% without loss of content or functionality.',
      'Responsive design: The platform works on screens of all sizes, from mobile phones to large desktop monitors.',
      'We do not use colour alone to convey information — all information communicated by colour is also available through text or icons.',
      'Animations: Users who prefer reduced motion (via the prefers-reduced-motion system setting) will see static content instead of animations.',
    ],
  },
  {
    icon: Ear,
    title: '4. Screen Reader Support',
    color: 'amber',
    content: [
      'All pages use semantic HTML elements (headings, landmarks, lists, forms) to provide structure and meaning.',
      'Images include descriptive alternative text (alt text). Decorative images are hidden from screen readers.',
      'Form fields have associated labels, and error messages are announced by screen readers.',
      'Dynamic content updates (such as loading states and notifications) use ARIA live regions to announce changes.',
      'We test regularly with screen readers including NVDA (Windows), VoiceOver (macOS/iOS), and TalkBack (Android).',
    ],
  },
  {
    icon: MessageCircle,
    title: '5. Content Accessibility',
    color: 'rose',
    content: [
      'We write in plain English, using clear and simple language that is accessible to all reading levels.',
      'This is especially important for our young users — we avoid jargon and explain technical terms where they are necessary.',
      'Page titles are descriptive and unique, helping users understand where they are on the platform.',
      'Links are descriptive — we avoid "click here" and instead use meaningful link text that makes sense out of context.',
      'Tables are used for tabular data only and include appropriate headers for screen reader navigation.',
    ],
  },
  {
    icon: Settings,
    title: '6. Known Limitations',
    color: 'gray',
    content: [
      'While we strive for full accessibility, there may be some areas where we fall short. Known limitations include:',
      'Some third-party embedded content (such as Stripe payment forms) may have accessibility limitations beyond our direct control. We work with our partners to ensure the best possible experience.',
      'Older PDF documents may not be fully accessible. We are working to ensure all documents meet accessibility standards.',
      'Some complex data visualisations (such as funding progress charts) may not convey all information to screen reader users. We provide text alternatives where possible.',
      'If you encounter any accessibility barrier not listed here, please let us know.',
    ],
  },
  {
    icon: Accessibility,
    title: '7. Requesting Accessible Formats',
    color: 'teal',
    content: [
      'If you need any content on this platform in an alternative format, we will do our best to help.',
      'Available formats may include: large print, easy read, audio description, or other formats upon request.',
      'Email accessibility@futurepreneurs.co.uk with your request and we will respond within 5 working days.',
      'If we cannot provide the exact format requested, we will work with you to find a suitable alternative.',
    ],
  },
  {
    icon: FileText,
    title: '8. Feedback and Reporting',
    color: 'indigo',
    content: [
      'We welcome feedback on the accessibility of Futurepreneurs. Please contact us if you encounter any accessibility barriers:',
      'Email: accessibility@futurepreneurs.co.uk',
      'Include: a description of the issue, the page or feature affected, the device and browser you were using, and any assistive technology in use.',
      'We aim to respond to accessibility feedback within 5 working days and to resolve reported issues as quickly as possible.',
      'We take all accessibility feedback seriously and use it to prioritise improvements.',
    ],
  },
  {
    icon: Scale,
    title: '9. Enforcement',
    color: 'orange',
    content: [
      'This statement was prepared in accordance with the requirements of the Equality Act 2010 and the Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018.',
      'If you are not satisfied with our response to your accessibility feedback, you can contact the Equality and Human Rights Commission (EHRC): equalityhumanrights.com.',
      'In Northern Ireland, contact the Equality Commission for Northern Ireland (ECNI): equalityni.org.',
      'You also have the right to take legal action under the Equality Act 2010 if you believe you have been discriminated against because of a disability.',
      'We aim to resolve all concerns before they reach the enforcement stage and encourage open dialogue.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100' },
};

export default function AccessibilityPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Accessibility className="h-4 w-4" />
              Inclusive by design
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Accessibility Statement
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everyone should be able to use Futurepreneurs. We&apos;re committed to making our platform accessible and inclusive, and we welcome your feedback to help us improve.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ KEY COMMITMENTS ═══ */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <Keyboard className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Keyboard accessible</p>
              <p className="text-blue-100 text-sm">Full keyboard navigation support.</p>
            </div>
            <div>
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">WCAG 2.1 AA</p>
              <p className="text-blue-100 text-sm">Conformance target for all pages.</p>
            </div>
            <div>
              <Ear className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Screen reader tested</p>
              <p className="text-blue-100 text-sm">NVDA, VoiceOver, and TalkBack.</p>
            </div>
          </div>
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
            Accessibility feedback or requests? Email{' '}
            <a href="mailto:accessibility@futurepreneurs.co.uk" className="text-blue-600 font-semibold hover:underline">
              accessibility@futurepreneurs.co.uk
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
              Contact page
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
