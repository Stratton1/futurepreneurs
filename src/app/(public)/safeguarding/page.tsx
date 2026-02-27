import { ShieldCheck, Users, Eye, Phone, AlertTriangle, FileText, UserCheck, Heart, Globe, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safeguarding & Child Protection — Futurepreneurs',
  description: 'Our commitment to safeguarding young people using the Futurepreneurs platform. How we keep students safe.',
};

const LAST_UPDATED = '26 February 2026';

const sections = [
  {
    icon: Heart,
    title: '1. Our Commitment',
    color: 'rose',
    content: [
      'Futurepreneurs is committed to safeguarding and promoting the welfare of all children and young people who use our platform.',
      'We recognise that the welfare of children is paramount and that all children, regardless of age, disability, gender, racial heritage, religious belief, sexual orientation, or identity, have the right to equal protection from harm.',
      'We will act in the best interests of the child at all times.',
      'This policy applies to all staff, volunteers, contractors, and third parties working on behalf of Futurepreneurs.',
      'We operate in compliance with the Children Act 1989 and 2004, Working Together to Safeguard Children (2023), Keeping Children Safe in Education (2024), and the UK GDPR as it applies to children\'s data.',
    ],
  },
  {
    icon: UserCheck,
    title: '2. Designated Safeguarding Lead',
    color: 'blue',
    content: [
      'Futurepreneurs has a Designated Safeguarding Lead (DSL) who is responsible for all safeguarding matters.',
      'The DSL is trained to Level 3 safeguarding and receives refresher training every two years.',
      'The DSL is the first point of contact for any safeguarding concerns and can be reached at safeguarding@futurepreneurs.co.uk.',
      'In the absence of the DSL, a Deputy DSL is available to handle urgent concerns.',
      'The DSL maintains records of all safeguarding concerns and reports, and liaises with external agencies when necessary.',
    ],
  },
  {
    icon: ShieldCheck,
    title: '3. Platform Safety Measures',
    color: 'emerald',
    content: [
      'Teacher verification: Every student project is reviewed and approved by a verified teacher at their school before it can go live. Teachers act as the first line of safeguarding.',
      'Parental consent: No student project can become publicly visible without explicit consent from a parent or guardian.',
      'School email verification: Students must register with a verified school-issued email address, confirming their identity and school affiliation.',
      'Content moderation: All project content is subject to moderation. Administrators can review, flag, and remove any inappropriate content.',
      'Reporting system: Any user can report content they believe to be inappropriate, harmful, or concerning. Reports are reviewed within 24 hours.',
      'Restricted contact: The platform does not include direct messaging between users to minimise the risk of inappropriate contact.',
      'Financial safeguards: All fund releases require teacher approval, with a full audit trail. Parents can view all financial activity.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '4. Recognising Safeguarding Concerns',
    color: 'amber',
    content: [
      'A safeguarding concern arises when there is reason to believe a child may be suffering or at risk of suffering significant harm, including:',
      'Physical abuse: unexplained injuries, fear of contact, or signs of physical harm.',
      'Emotional abuse: persistent criticism, bullying, threatening behaviour, or isolation.',
      'Sexual abuse: inappropriate sexual behaviour, language, or content.',
      'Neglect: a child appearing consistently uncared for, hungry, or without appropriate support.',
      'Online abuse: cyberbullying, grooming, sharing of inappropriate images, or exploitation.',
      'Radicalisation: exposure to extremist views or materials.',
      'Child criminal exploitation (CCE) or child sexual exploitation (CSE).',
      'If project content, updates, or user behaviour raises any of these concerns, it must be reported immediately.',
    ],
  },
  {
    icon: Phone,
    title: '5. How to Report a Concern',
    color: 'red',
    content: [
      'If you believe a child is in immediate danger, call 999 immediately.',
      'To report a safeguarding concern to Futurepreneurs, email safeguarding@futurepreneurs.co.uk. Include as much detail as possible: who is involved, what you have observed, and when it happened.',
      'You can also use the "Report" button on any project page to flag content for review.',
      'All reports are treated confidentially and handled by the Designated Safeguarding Lead.',
      'We will acknowledge receipt of your concern within 24 hours and keep you informed of progress (where appropriate and in line with data protection requirements).',
    ],
  },
  {
    icon: Globe,
    title: '6. External Reporting',
    color: 'purple',
    content: [
      'If you are concerned about a child\'s safety, you can also contact the following organisations directly:',
      'NSPCC Helpline: 0808 800 5000 (or email help@nspcc.org.uk). Available 24/7 for adults concerned about a child.',
      'Childline: 0800 1111. A free, confidential helpline for children and young people.',
      'CEOP (Child Exploitation and Online Protection): www.ceop.police.uk. For reporting online exploitation and abuse.',
      'Your local authority children\'s services: Contact your local council\'s child protection team.',
      'The police: Call 101 for non-emergency concerns, or 999 if a child is in immediate danger.',
      'Teachers or school staff with concerns should follow their school\'s own safeguarding procedures in addition to reporting to Futurepreneurs.',
    ],
  },
  {
    icon: Eye,
    title: '7. Monitoring and Moderation',
    color: 'teal',
    content: [
      'Platform administrators regularly review content for compliance with our community guidelines and safeguarding standards.',
      'Project content, updates, and user profiles are monitored for inappropriate material.',
      'Automated and manual checks are in place to identify potentially harmful content.',
      'Any content that raises safeguarding concerns is immediately escalated to the DSL.',
      'Users who repeatedly violate community guidelines may have their accounts suspended or permanently removed.',
    ],
  },
  {
    icon: Users,
    title: '8. Staff and Volunteer Checks',
    color: 'indigo',
    content: [
      'All Futurepreneurs staff and volunteers who have access to children\'s data or who interact with children undergo appropriate vetting.',
      'This includes enhanced DBS (Disclosure and Barring Service) checks where applicable.',
      'All staff receive safeguarding training upon joining and refresher training annually.',
      'We maintain a single central record of all DBS checks and training records.',
      'Third-party service providers who may have access to children\'s data are required to demonstrate their own safeguarding policies.',
    ],
  },
  {
    icon: BookOpen,
    title: '9. Age-Appropriate Design',
    color: 'orange',
    content: [
      'Futurepreneurs is designed with the ICO\'s Age-Appropriate Design Code (Children\'s Code) in mind.',
      'We prioritise the best interests of children in all design decisions.',
      'Data collection is kept to the minimum necessary for the platform to function.',
      'Default settings are privacy-protective — we do not use nudge techniques to encourage children to share more data.',
      'Geolocation data is not collected or used.',
      'Profiling that could have a detrimental effect on children is not used.',
      'We provide age-appropriate explanations of how the platform works and how data is used.',
    ],
  },
  {
    icon: FileText,
    title: '10. Policy Review',
    color: 'gray',
    content: [
      'This safeguarding policy is reviewed annually by the Designated Safeguarding Lead and the Futurepreneurs leadership team.',
      'The policy is updated whenever there are changes to relevant legislation, statutory guidance, or platform features.',
      'All staff are notified of updates and receive refresher training on any significant changes.',
      'A record of all policy reviews and updates is maintained.',
      'Feedback on this policy can be directed to safeguarding@futurepreneurs.co.uk.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
};

export default function SafeguardingPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-blue-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-rose-100/80 text-rose-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <ShieldCheck className="h-4 w-4" />
              Child safety first
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Safeguarding &amp; Child Protection
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The safety and wellbeing of every young person on our platform is our absolute priority. This policy explains how we protect children and what to do if you have a concern.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ EMERGENCY BANNER ═══ */}
      <section className="py-6 bg-red-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-center">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="font-bold">
              If a child is in immediate danger, call <span className="underline">999</span> now.
            </p>
            <span className="hidden sm:inline text-red-200">|</span>
            <p className="text-red-100 text-sm">
              NSPCC: <span className="font-semibold text-white">0808 800 5000</span> &middot; Childline: <span className="font-semibold text-white">0800 1111</span>
            </p>
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
            For safeguarding concerns, contact our DSL at{' '}
            <a href="mailto:safeguarding@futurepreneurs.co.uk" className="text-rose-600 font-semibold hover:underline">
              safeguarding@futurepreneurs.co.uk
            </a>.{' '}
            For general enquiries, visit our{' '}
            <Link href="/contact" className="text-rose-600 font-semibold hover:underline">
              Contact page
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
