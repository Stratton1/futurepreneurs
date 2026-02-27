import { FileText, Shield, AlertTriangle, Scale, Users, CreditCard, Ban, RefreshCw, Globe, Lightbulb, Clock } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Futurepreneurs',
  description: 'Terms of service for the Futurepreneurs crowdfunding platform for young entrepreneurs.',
};

const LAST_UPDATED = '26 February 2026';

const sections = [
  {
    icon: Users,
    title: '1. Who Can Use Futurepreneurs',
    color: 'emerald',
    content: [
      'Futurepreneurs is open to students under 18 in the United Kingdom who have a school-issued email address.',
      'Students must have a teacher or mentor at their school to verify and oversee their project.',
      'A parent or guardian must provide consent before any student project can go live on the platform.',
      'Supporters can be any adult (18+) who wishes to support a student project.',
      'By creating an account, you confirm that all information you provide is accurate and truthful.',
    ],
  },
  {
    icon: FileText,
    title: '2. Projects and Content',
    color: 'blue',
    content: [
      'All projects must be legitimate business ideas created by the student who submits them.',
      'Projects must not contain offensive, discriminatory, illegal, or inappropriate content.',
      'Futurepreneurs reserves the right to remove any project that violates these terms or is deemed unsuitable.',
      'Students retain ownership of their business ideas. Futurepreneurs does not claim any intellectual property rights over student projects.',
      'Project descriptions, images, and videos must be the original work of the student or used with permission.',
    ],
  },
  {
    icon: CreditCard,
    title: '3. Funding and Payments',
    color: 'amber',
    content: [
      'Futurepreneurs uses an all-or-nothing funding model. Supporters are only charged if a project reaches its funding goal.',
      'A platform fee of 2.5% is deducted from successfully funded projects. Standard payment processing fees also apply.',
      'The maximum funding goal for any project is £10,000.',
      'All transactions are processed securely through Stripe. Futurepreneurs never stores your card details.',
      'Supporting a project is a donation to help a young entrepreneur — it is not an investment and does not entitle you to equity, profits, or products unless the student explicitly offers rewards.',
    ],
  },
  {
    icon: Scale,
    title: '4. Milestone Drawdowns',
    color: 'purple',
    content: [
      'Once a project is fully funded, the student can request to withdraw funds against pre-defined milestones.',
      'Each drawdown request must be approved by the student\'s assigned teacher or mentor.',
      'Parents and guardians can view all drawdown activity for their child\'s projects.',
      'A full audit trail of all fund requests, approvals, and disbursements is maintained by the platform.',
      'Futurepreneurs reserves the right to freeze funds if there is evidence of misuse or fraud.',
    ],
  },
  {
    icon: Shield,
    title: '5. Safety and Moderation',
    color: 'rose',
    content: [
      'Futurepreneurs is committed to the safety of young people. All projects are verified by a teacher before going live.',
      'We maintain content moderation tools and a reporting system for inappropriate content.',
      'Users can report any project or content they believe violates our guidelines.',
      'Accounts that violate our terms may be suspended or permanently removed.',
      'We cooperate with schools, parents, and law enforcement when necessary to protect the safety of our users.',
    ],
  },
  {
    icon: Ban,
    title: '6. Prohibited Activities',
    color: 'red',
    content: [
      'Using the platform to raise funds for anything illegal, harmful, or unrelated to a genuine business idea.',
      'Creating fake accounts, impersonating others, or providing false information.',
      'Harassing, bullying, or sending inappropriate messages to any user.',
      'Attempting to circumvent the platform\'s safety features, including teacher verification or parental consent.',
      'Using automated tools or bots to interact with the platform without permission.',
    ],
  },
  {
    icon: RefreshCw,
    title: '7. Refunds and Cancellations',
    color: 'teal',
    content: [
      'If a project does not reach its funding goal, no funds are collected and no refunds are necessary.',
      'If a funded project is cancelled or removed by the platform, supporters will receive a full refund.',
      'Students may cancel their project at any time before it is fully funded.',
      'Once funds have been disbursed against a milestone, that portion is non-refundable.',
      'Refund disputes should be directed to hello@futurepreneurs.co.uk.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '8. Limitation of Liability',
    color: 'orange',
    content: [
      'Futurepreneurs provides a platform for crowdfunding and does not guarantee the success of any project.',
      'We are not responsible for how students use their funds once disbursed through approved milestones.',
      'Futurepreneurs is not liable for any losses arising from the use of the platform, to the maximum extent permitted by law.',
      'We make no guarantees about the accuracy of information provided by users on project pages.',
      'These terms are governed by the laws of England and Wales.',
    ],
  },
  {
    icon: Lightbulb,
    title: '9. Intellectual Property',
    color: 'indigo',
    content: [
      'Students retain full ownership of their business ideas, project content, and any intellectual property they create.',
      'By uploading content to Futurepreneurs, students grant us a non-exclusive, royalty-free licence to display that content on the platform for the purpose of promoting and funding the project.',
      'This licence ends when a project is removed from the platform.',
      'Futurepreneurs\' own brand, logo, and platform design are our intellectual property and may not be used without written permission.',
      'If you believe content on the platform infringes your intellectual property rights, please contact us at legal@futurepreneurs.co.uk with details of the alleged infringement.',
    ],
  },
  {
    icon: Scale,
    title: '10. Dispute Resolution',
    color: 'cyan',
    content: [
      'We aim to resolve all disputes informally and amicably. Please contact us at hello@futurepreneurs.co.uk in the first instance.',
      'If a dispute cannot be resolved informally, our complaints procedure provides a structured three-stage process. See our Complaints Procedure page for details.',
      'Disputes between supporters and students regarding project delivery are the responsibility of the student. Futurepreneurs facilitates the platform but does not act as an intermediary in project delivery disputes.',
      'For payment-related disputes, Stripe\'s own dispute resolution process applies in addition to our internal procedures.',
      'These terms are subject to the exclusive jurisdiction of the courts of England and Wales.',
    ],
  },
  {
    icon: Users,
    title: '11. Age Verification',
    color: 'sky',
    content: [
      'Student accounts are verified through school-issued email addresses. We do not accept personal email addresses (such as Gmail, Outlook, or Yahoo) for student registrations.',
      'We maintain a list of verified UK school email domains. If your school is not listed, contact us to request its addition.',
      'Teacher accounts are verified by matching their email to a registered school domain and through internal review.',
      'Parent accounts are linked to student accounts through the parental consent process.',
      'We reserve the right to request additional verification if there are concerns about the age or identity of a user.',
    ],
  },
  {
    icon: Globe,
    title: '12. Platform Availability',
    color: 'gray',
    content: [
      'We aim to keep Futurepreneurs available 24/7, but we do not guarantee uninterrupted access to the platform.',
      'We may occasionally need to take the platform offline for maintenance, updates, or improvements. We will provide advance notice where possible.',
      'We are not liable for any loss or inconvenience caused by temporary unavailability of the platform.',
      'In the event of a prolonged outage affecting active funding campaigns, we will extend campaign deadlines where applicable.',
    ],
  },
  {
    icon: Clock,
    title: '13. Changes to These Terms',
    color: 'violet',
    content: [
      'We may update these Terms of Service from time to time. Changes will be posted on this page with an updated "Last updated" date.',
      'For significant changes that materially affect your rights, we will notify all registered users via email at least 14 days before the changes take effect.',
      'Continued use of the platform after changes take effect constitutes acceptance of the updated terms.',
      'If you do not agree with any changes, you may close your account at any time.',
      'Previous versions of these terms are available upon request by emailing legal@futurepreneurs.co.uk.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-100' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-100' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-100' },
};

export default function TermsPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <FileText className="h-4 w-4" />
              Legal
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Terms of Service
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully. By using Futurepreneurs, you agree to be bound by them. We&apos;ve kept them as clear and simple as possible.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ SECTIONS ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {sections.map((section, i) => {
            const colors = colorMap[section.color] || colorMap.emerald;
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
            Questions about these terms? Email us at{' '}
            <a href="mailto:hello@futurepreneurs.co.uk" className="text-blue-600 font-semibold hover:underline">
              hello@futurepreneurs.co.uk
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
