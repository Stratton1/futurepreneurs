import { Shield, Ban, AlertTriangle, UserCheck, Eye, MessageSquare, Scale, FileText, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/animate-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community & Moderation Policy — Futurepreneurs',
  description: 'Our community standards, content guidelines, and moderation process. Keeping the platform safe and positive for everyone.',
};

const LAST_UPDATED = '26 February 2026';

const sections = [
  {
    icon: ThumbsUp,
    title: '1. Community Standards',
    color: 'emerald',
    content: [
      'Futurepreneurs is a positive, supportive community for young entrepreneurs. Everyone deserves to feel safe, respected, and encouraged.',
      'Be kind and supportive. Remember that the people behind projects are young people who are brave enough to share their ideas with the world.',
      'Be honest. Represent yourself and your projects truthfully. Don\'t mislead supporters about what their contribution will fund.',
      'Be respectful. You may disagree with an idea, but always express your views constructively and without personal attacks.',
      'Be inclusive. Our community welcomes people of all backgrounds, abilities, and identities. Discrimination of any kind is not tolerated.',
      'Be responsible. If you see something that concerns you, report it. You are helping to keep the community safe for everyone.',
    ],
  },
  {
    icon: Ban,
    title: '2. What\'s Not Allowed',
    color: 'red',
    content: [
      'Bullying, harassment, intimidation, or threatening behaviour towards any user.',
      'Discriminatory content or language based on race, ethnicity, gender, sexuality, religion, disability, age, or any other protected characteristic.',
      'Fraudulent projects or misrepresentation of a project\'s purpose, goals, or use of funds.',
      'Adult content, sexually explicit material, or content that is not age-appropriate for our community.',
      'Violent content, graphic imagery, or content that promotes self-harm.',
      'Spam, scams, phishing attempts, or misleading links.',
      'Projects related to weapons, drugs, gambling, alcohol, tobacco, or any illegal activity.',
      'Personal information of others (doxxing) shared without their consent.',
      'Impersonation of another person or organisation.',
      'Content that infringes on the intellectual property rights of others.',
      'Attempting to circumvent the platform\'s safety features, including teacher verification or parental consent requirements.',
    ],
  },
  {
    icon: UserCheck,
    title: '3. Teacher Verification',
    color: 'blue',
    content: [
      'Teachers serve as the first line of moderation on Futurepreneurs. They are trusted adults who know the students and can verify the legitimacy of their projects.',
      'Every project must be reviewed and approved by a verified teacher before it can go live on the platform.',
      'Teachers verify that: the project is a genuine business idea by the student, the content is appropriate, the funding goal is realistic, and the milestones are sensible.',
      'Teachers also approve drawdown requests, ensuring that funds are being used for their intended purpose.',
      'If a teacher has concerns about a project or student behaviour, they can flag it for admin review at any time.',
    ],
  },
  {
    icon: Eye,
    title: '4. Admin Moderation',
    color: 'purple',
    content: [
      'Platform administrators have full visibility of all content and user activity on the platform.',
      'Admins can review, flag, suspend, or remove any project, update, or user account that violates our community guidelines.',
      'Content that is reported by users is reviewed by admins, typically within 24 hours.',
      'Admins can also proactively monitor content and take action without a user report if they identify a violation.',
      'All moderation actions are logged with reasons and are reviewable.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Reporting Content',
    color: 'amber',
    content: [
      'If you see content that violates our community guidelines, please report it immediately using the "Report" button on any project page.',
      'When reporting, please select the reason that best describes the issue and provide as much detail as possible.',
      'All reports are reviewed by a platform administrator.',
      'We will not reveal your identity to the person you are reporting about, unless required by law.',
      'False or malicious reports may themselves be treated as a violation of community guidelines.',
      'For safeguarding concerns about a child, please also refer to our Safeguarding & Child Protection Policy.',
    ],
  },
  {
    icon: Scale,
    title: '6. Consequences',
    color: 'orange',
    content: [
      'Violations of our community guidelines are taken seriously and may result in the following actions, depending on severity:',
      'Warning: For minor or first-time violations, we may issue a written warning explaining the issue and requesting that the behaviour or content is corrected.',
      'Content removal: Specific content (project descriptions, updates, images) that violates guidelines will be removed. The user will be notified.',
      'Project suspension: Projects that seriously violate guidelines may be temporarily or permanently suspended. Any held funds will be handled according to our refund policy.',
      'Account suspension: Users who repeatedly violate guidelines or commit serious violations may have their account temporarily suspended.',
      'Permanent ban: Users who commit severe violations (fraud, threats, exploitation) or who continue to violate guidelines after suspension may be permanently removed from the platform.',
      'We may also report serious violations to relevant authorities, including the police, local authority children\'s services, or the NSPCC.',
    ],
  },
  {
    icon: MessageSquare,
    title: '7. Appeals',
    color: 'teal',
    content: [
      'If you believe a moderation action against you or your content was made in error, you have the right to appeal.',
      'To appeal, email moderation@futurepreneurs.co.uk within 10 working days of the action, explaining why you believe it was incorrect.',
      'Include: your account email, the specific action you are appealing, and any evidence supporting your appeal.',
      'Appeals are reviewed by a senior administrator who was not involved in the original decision.',
      'We aim to respond to appeals within 10 working days.',
      'The appeal decision is final.',
    ],
  },
  {
    icon: FileText,
    title: '8. Policy Updates',
    color: 'gray',
    content: [
      'This Community & Moderation Policy is reviewed at least annually and updated as needed.',
      'Significant changes to the policy will be communicated to all registered users via email.',
      'Continued use of the platform after policy updates constitutes acceptance of the updated terms.',
      'Previous versions of this policy are available upon request.',
      'Feedback on this policy can be directed to hello@futurepreneurs.co.uk.',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-100' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-100' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-100' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
};

export default function ModerationPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <Shield className="h-4 w-4" />
              Safe &amp; positive community
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Community &amp; Moderation Policy
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our community standards keep Futurepreneurs safe, positive, and supportive for everyone — especially our young entrepreneurs.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {LAST_UPDATED}</p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ KEY MESSAGE ═══ */}
      <section className="py-8 bg-emerald-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Teacher verified</p>
              <p className="text-emerald-100 text-sm">Every project reviewed by a trusted adult.</p>
            </div>
            <div>
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Admin moderated</p>
              <p className="text-emerald-100 text-sm">Reports reviewed within 24 hours.</p>
            </div>
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-lg">Zero tolerance</p>
              <p className="text-emerald-100 text-sm">For bullying, discrimination, and fraud.</p>
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
            Questions about our moderation policy? Email{' '}
            <a href="mailto:moderation@futurepreneurs.co.uk" className="text-emerald-600 font-semibold hover:underline">
              moderation@futurepreneurs.co.uk
            </a>.{' '}
            To report content, use the Report button on any project page or visit our{' '}
            <Link href="/contact" className="text-emerald-600 font-semibold hover:underline">
              Contact page
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
