import { Shield, Eye, Lock, Database, UserCheck, Bell, Trash2, Globe, Baby, Scale, Clock, Server } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Futurepreneurs',
  description: 'How Futurepreneurs collects, uses, and protects your personal data. Extra care taken for users under 18.',
};

const LAST_UPDATED = '26 February 2026';

const sections = [
  {
    icon: Eye,
    title: '1. What We Collect',
    color: 'blue',
    content: [
      'Account information: your name, email address, and role (student, teacher, parent, or supporter).',
      'School information: for students and teachers, we collect your school name and school email domain for verification.',
      'Project data: any content you upload, including text, images, and videos for project pages.',
      'Payment information: handled entirely by Stripe. We never see or store your card details.',
      'Usage data: how you interact with the platform, pages visited, and features used, to improve the service.',
    ],
  },
  {
    icon: Database,
    title: '2. How We Use Your Data',
    color: 'emerald',
    content: [
      'To create and manage your account, and to verify your identity and role.',
      'To display your project to potential supporters and the public.',
      'To process payments, track funding progress, and manage milestone drawdowns.',
      'To send you important notifications about your projects, funding, and account.',
      'To maintain platform safety through content moderation and reporting systems.',
      'To improve the platform based on aggregate, anonymised usage patterns.',
    ],
  },
  {
    icon: Lock,
    title: '3. How We Protect Your Data',
    color: 'purple',
    content: [
      'All data is transmitted over HTTPS (encrypted connections).',
      'Sensitive payment data is handled by Stripe, a PCI DSS Level 1 certified payment processor.',
      'Access to personal data is restricted to authorised team members only.',
      'Our database is hosted on Supabase with row-level security enabled.',
      'We conduct regular security reviews and keep all software up to date.',
    ],
  },
  {
    icon: Baby,
    title: '4. Children\'s Privacy (Under 18)',
    color: 'rose',
    content: [
      'Futurepreneurs takes the privacy of young people extremely seriously.',
      'Student accounts require a school-issued email and teacher verification before a project can go live.',
      'Parental consent is required before any student project becomes publicly visible.',
      'We do not sell, share, or use children\'s data for advertising or marketing purposes.',
      'Parents can view all data associated with their child\'s account and request deletion at any time.',
      'We comply with UK GDPR requirements for processing children\'s data, including GDPR-K protections.',
    ],
  },
  {
    icon: UserCheck,
    title: '5. Who Can See Your Data',
    color: 'amber',
    content: [
      'Public project pages: your project title, description, images, and funding progress are visible to everyone.',
      'Teachers can see the projects of students they mentor, including drawdown requests.',
      'Parents can see their child\'s projects, funding status, and drawdown activity.',
      'Supporters can see the projects they have supported and any updates posted by the student.',
      'Platform administrators can access all data for moderation and support purposes.',
      'We do not sell your data to third parties. Ever.',
    ],
  },
  {
    icon: Bell,
    title: '6. Communications',
    color: 'teal',
    content: [
      'We send transactional emails for important events: account verification, project updates, funding milestones, and drawdown approvals.',
      'We may occasionally send platform updates and new feature announcements.',
      'You can manage your notification preferences from your account settings.',
      'We will never send you marketing emails from third parties.',
    ],
  },
  {
    icon: Trash2,
    title: '7. Your Rights',
    color: 'red',
    content: [
      'Access: you can request a copy of all personal data we hold about you.',
      'Correction: you can update or correct your personal information at any time.',
      'Deletion: you can request deletion of your account and associated data.',
      'Portability: you can request your data in a common, machine-readable format.',
      'Objection: you can object to processing of your data in certain circumstances.',
      'To exercise any of these rights, email us at privacy@futurepreneurs.co.uk.',
    ],
  },
  {
    icon: Globe,
    title: '8. Cookies and Analytics',
    color: 'gray',
    content: [
      'We use essential cookies to keep you logged in and maintain your session.',
      'We use anonymous analytics to understand how the platform is used and where to improve.',
      'We do not use advertising cookies or tracking pixels from third parties.',
      'You can manage cookie preferences in your browser settings.',
      'For full details, see our Cookie Policy.',
    ],
  },
  {
    icon: UserCheck,
    title: '9. Data Protection Officer',
    color: 'indigo',
    content: [
      'Our Data Protection Officer (DPO) oversees compliance with data protection law and is available to answer any questions about how we handle your data.',
      'Contact the DPO at: dpo@futurepreneurs.co.uk.',
      'You may contact the DPO regarding any data protection concern, including exercising your rights, reporting a data breach, or requesting more information about our data practices.',
      'The DPO reports directly to the Futurepreneurs leadership team and operates independently in matters of data protection compliance.',
    ],
  },
  {
    icon: Clock,
    title: '10. Data Retention',
    color: 'orange',
    content: [
      'Active accounts: We retain your personal data for as long as your account is active and in use.',
      'Inactive accounts: If your account is inactive for 24 months, we will notify you and may close the account after a further 30 days without response.',
      'Deleted accounts: When you request account deletion, we delete your personal data within 30 days. Some anonymised data may be retained for aggregate analytics.',
      'Project data: Funded project data (descriptions, milestones, financial records) is retained for 7 years after project completion, as required for financial record-keeping.',
      'Financial records: Payment and drawdown records are retained for 7 years in compliance with UK tax and financial regulations (HMRC requirements).',
      'Safeguarding records: Any safeguarding records are retained in accordance with statutory guidance — typically until the child reaches 25 years of age.',
    ],
  },
  {
    icon: Server,
    title: '11. International Data Transfers',
    color: 'sky',
    content: [
      'Your data is primarily stored and processed in the European Economic Area (EEA) and the United Kingdom.',
      'Our database is hosted by Supabase, with servers located in the EU (Frankfurt, Germany).',
      'Our website is hosted by Vercel, which may process some data in the United States. Vercel complies with the EU-US Data Privacy Framework.',
      'Stripe processes payment data and may transfer data internationally. Stripe complies with the EU-US Data Privacy Framework and uses standard contractual clauses.',
      'We ensure that any international data transfers comply with UK GDPR requirements and that appropriate safeguards are in place.',
    ],
  },
  {
    icon: Scale,
    title: '12. Lawful Basis for Processing',
    color: 'cyan',
    content: [
      'Contract: We process your data as necessary to provide the Futurepreneurs service (creating accounts, managing projects, processing payments).',
      'Consent: For students under 18, we obtain parental consent before making project data publicly visible. You can withdraw consent at any time.',
      'Legitimate interest: We process some data based on our legitimate interest in improving the platform, preventing fraud, and ensuring safety — balanced against your rights and freedoms.',
      'Legal obligation: We retain financial and safeguarding records as required by UK law.',
      'We do not use automated decision-making or profiling that produces legal effects or significantly affects users.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-100' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-100' },
};

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-emerald-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-purple-100/80 text-purple-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Shield className="h-4 w-4" />
              Your privacy matters
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Privacy Policy
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in complete transparency about how we handle your data. Because our platform serves young people, we take extra care to protect their privacy.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ KEY PROMISES ═══ */}
      <section className="py-12 bg-emerald-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <Lock className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">We never sell your data</p>
              <p className="text-emerald-100 text-sm">Not to anyone. Not ever.</p>
            </div>
            <div>
              <Baby className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Extra care for under 18s</p>
              <p className="text-emerald-100 text-sm">GDPR-K compliant protections.</p>
            </div>
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Stripe handles payments</p>
              <p className="text-emerald-100 text-sm">We never see your card details.</p>
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
                        <span className="text-gray-300 mt-1.5 shrink-0">•</span>
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
            Questions about your privacy? Email our data protection team at{' '}
            <a href="mailto:privacy@futurepreneurs.co.uk" className="text-purple-600 font-semibold hover:underline">
              privacy@futurepreneurs.co.uk
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-purple-600 font-semibold hover:underline">
              Contact page
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
