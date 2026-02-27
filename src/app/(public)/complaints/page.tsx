import { MessageSquare, Clock, FileText, ArrowUpCircle, Scale, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complaints Procedure — Futurepreneurs',
  description: 'How to make a complaint about the Futurepreneurs platform. Our three-stage process ensures every concern is heard and resolved.',
};

const LAST_UPDATED = '26 February 2026';

const stages = [
  {
    stage: 'Stage 1',
    title: 'Informal Resolution',
    timeframe: 'Response within 2 working days',
    color: 'bg-emerald-500',
    steps: [
      'Contact us by email at complaints@futurepreneurs.co.uk with a description of your concern.',
      'A member of our team will acknowledge your complaint within 2 working days.',
      'We will try to resolve your complaint informally and directly. Most issues can be resolved at this stage through discussion and agreement.',
      'We aim to provide a full response within 5 working days.',
      'If you are satisfied with the outcome, the complaint is closed. If not, you can escalate to Stage 2.',
    ],
  },
  {
    stage: 'Stage 2',
    title: 'Formal Complaint',
    timeframe: 'Response within 10 working days',
    color: 'bg-amber-500',
    steps: [
      'If Stage 1 does not resolve your concern, submit a formal written complaint to complaints@futurepreneurs.co.uk with the subject line "Formal Complaint".',
      'Include: your name, your relationship to the platform (student, parent, teacher, supporter), a clear description of your complaint, any evidence or documentation, and what outcome you are seeking.',
      'Your formal complaint will be reviewed by a senior member of the Futurepreneurs team who was not involved in the Stage 1 response.',
      'We will acknowledge receipt within 2 working days and provide a detailed written response within 10 working days.',
      'If we need more time to investigate, we will let you know and provide a revised timeframe.',
    ],
  },
  {
    stage: 'Stage 3',
    title: 'Escalation & Appeal',
    timeframe: 'Response within 15 working days',
    color: 'bg-red-500',
    steps: [
      'If you remain unsatisfied after Stage 2, you can request an appeal by emailing appeals@futurepreneurs.co.uk within 10 working days of receiving the Stage 2 response.',
      'Your appeal will be reviewed by the Futurepreneurs Director or an independent panel member.',
      'A final written decision will be provided within 15 working days.',
      'This decision is final within our internal process. If you are still not satisfied, you may refer your complaint to an external body (see below).',
    ],
  },
];

const sections = [
  {
    icon: MessageSquare,
    title: 'What You Can Complain About',
    color: 'blue',
    content: [
      'The quality or provision of our platform services.',
      'The behaviour of staff or representatives of Futurepreneurs.',
      'A failure to follow our published policies or procedures.',
      'Concerns about how your personal data has been handled.',
      'Concerns about content moderation decisions.',
      'Any other aspect of the Futurepreneurs service that you believe has fallen below a reasonable standard.',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Our Commitments',
    color: 'emerald',
    content: [
      'We will treat all complaints seriously, fairly, and confidentially.',
      'We will not penalise anyone for making a complaint in good faith.',
      'We will keep you informed throughout the process.',
      'We will learn from complaints and use them to improve our service.',
      'Complaints about safeguarding concerns will always be escalated immediately to our Designated Safeguarding Lead, regardless of the stage of the complaints process.',
    ],
  },
  {
    icon: Scale,
    title: 'External Bodies',
    color: 'purple',
    content: [
      'If you have exhausted our internal complaints procedure and remain dissatisfied, you may refer your complaint to the following external bodies:',
      'Data protection complaints: Information Commissioner\'s Office (ICO) — ico.org.uk or 0303 123 1113. You have the right to complain to the ICO at any time, but we appreciate the opportunity to resolve your concern first.',
      'Safeguarding concerns: You can report directly to the NSPCC (0808 800 5000), Childline (0800 1111), CEOP (www.ceop.police.uk), or your local authority children\'s services.',
      'Consumer disputes: Citizens Advice — citizensadvice.org.uk or 0800 144 8848.',
      'Financial complaints related to Stripe payments can be directed to Stripe\'s own complaints procedure at stripe.com/legal/complaints.',
    ],
  },
  {
    icon: FileText,
    title: 'Record Keeping',
    color: 'gray',
    content: [
      'We maintain a confidential record of all complaints received, including: the nature of the complaint, the outcome, and any actions taken.',
      'Complaint records are retained for a minimum of 3 years.',
      'Anonymous, aggregated complaint data is reviewed quarterly by the leadership team to identify trends and areas for improvement.',
      'Individual complaint records are only accessible to authorised staff handling the complaint.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
};

export default function ComplaintsPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <MessageSquare className="h-4 w-4" />
              We&apos;re listening
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Complaints Procedure
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We want to get things right. If something isn&apos;t working as it should, here&apos;s how to let us know and how we&apos;ll resolve it.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ THREE-STAGE PROCESS ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Our Three-Stage Process</h2>
            <p className="text-gray-500 text-center mb-10">Each stage has clear timeframes and escalation routes.</p>
          </AnimateIn>

          <div className="space-y-8">
            {stages.map((stage, i) => (
              <AnimateIn key={i} animation="fade-up" delay={80 + i * 80}>
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className={`${stage.color} px-6 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">{stage.stage}</span>
                      <span className="text-white/90 font-medium">{stage.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{stage.timeframe}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ol className="space-y-3">
                      {stage.steps.map((step, j) => (
                        <li key={j} className="text-gray-600 text-sm leading-relaxed flex items-start gap-3">
                          <span className="bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{j + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {i < stages.length - 1 && (
                      <div className="mt-4 flex items-center justify-center text-gray-400">
                        <ArrowUpCircle className="h-5 w-5 rotate-180" />
                        <span className="text-xs ml-1.5">Not resolved? Escalate to {stages[i + 1].stage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ADDITIONAL SECTIONS ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
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
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-xl p-4 mb-4">
              <Phone className="h-5 w-5 text-blue-600" />
              <p className="text-gray-700 font-medium">
                Email: <a href="mailto:complaints@futurepreneurs.co.uk" className="text-blue-600 hover:underline">complaints@futurepreneurs.co.uk</a>
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              For general enquiries, visit our{' '}
              <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
                Contact page
              </Link>.
            </p>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
