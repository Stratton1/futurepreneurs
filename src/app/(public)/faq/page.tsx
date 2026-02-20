import { Accordion } from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/ui/animate-in';
import { HelpCircle, Rocket, GraduationCap, Heart, Users, ArrowRight, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Futurepreneurs',
  description: 'Frequently asked questions about Futurepreneurs — the crowdfunding platform for young entrepreneurs under 18.',
};

const generalFAQs = [
  {
    question: 'What is Futurepreneurs?',
    answer:
      'Futurepreneurs is a crowdfunding platform built specifically for young people under 18. It lets students raise money for their business ideas in a safe, supported environment — with teacher verification, parental consent, and milestone-based spending.',
  },
  {
    question: 'Who can use Futurepreneurs?',
    answer:
      'Students under 18 with a school-issued email can create projects. Teachers and parents play supporting roles — verifying projects and giving consent. Anyone can back a project, whether they have an account or not.',
  },
  {
    question: 'Is Futurepreneurs free to use?',
    answer:
      'Creating a project is completely free. If a project reaches its funding goal, a small 2.5% platform fee is taken from the total raised. If the project does not reach its goal, no money changes hands and there is no fee.',
  },
  {
    question: 'Is Futurepreneurs available outside the UK?',
    answer:
      'Right now, Futurepreneurs is UK-only. We support GBP and work with UK schools. International expansion is on our roadmap for the future.',
  },
];

const studentFAQs = [
  {
    question: 'How do I create a project?',
    answer:
      'Sign up with your school email, then click "Create Project" from your dashboard. You will fill in your idea, set a funding goal (up to £10,000), add images or a video, choose a category, and plan your milestones. Then pick a teacher at your school to verify it.',
  },
  {
    question: 'What happens after I submit my project?',
    answer:
      'Your teacher will review it first. Once they approve, your parent or guardian will be asked to give consent. After both steps are done, your project goes live and anyone can back it.',
  },
  {
    question: 'How do I get the money once my project is funded?',
    answer:
      'You do not get all the money at once. Instead, you request drawdowns against the milestones you planned when creating the project. Your teacher approves each request, and the funds are released step by step. This helps you learn to manage money responsibly.',
  },
  {
    question: 'What if my project does not reach its goal?',
    answer:
      'Futurepreneurs uses an all-or-nothing model. If your project does not hit its funding goal, no money is collected from backers and no fees are charged. You can always try again with a new or updated project.',
  },
  {
    question: 'Can I edit my project after it goes live?',
    answer:
      'Yes, you can edit your project details before it is fully funded. Once the goal is reached and funds are being collected, the core details are locked to protect backers.',
  },
];

const teacherFAQs = [
  {
    question: 'What is my role as a teacher on Futurepreneurs?',
    answer:
      'You are the trust anchor for your students\u0027 projects. You verify that the project is genuine and appropriate, and you approve drawdown requests when the student wants to access their funds. Think of it as mentorship with a safety net.',
  },
  {
    question: 'How do I verify a student\'s project?',
    answer:
      'When a student at your school submits a project, you will receive a notification. From your teacher dashboard, you can review the project details and choose to approve it, request changes, or reject it.',
  },
  {
    question: 'How much time does this take?',
    answer:
      'Most project reviews take just a few minutes. Drawdown approvals are quick too — you are simply confirming that the student is spending the money on what they planned. It is designed to be lightweight.',
  },
];

const backerFAQs = [
  {
    question: 'How do I back a project?',
    answer:
      'Browse the projects on our site, find one you like, and click "Back This Project". You can pay with a card, Apple Pay, or Google Pay. You do not even need an account — guest checkout is available.',
  },
  {
    question: 'When am I charged?',
    answer:
      'Your payment is held until the project reaches its funding goal. If the goal is met, your card is charged. If the project does not reach its goal, your money is never taken.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Because funds are only collected when a project reaches its goal, refunds are not typically needed. If you have concerns about a specific project, please contact us and we will look into it.',
  },
  {
    question: 'How do I know the projects are legitimate?',
    answer:
      'Every project on Futurepreneurs is verified by a real teacher at the student\u0027s school and approved by a parent or guardian. Funds are released through milestones, not as a lump sum. We also have reporting and moderation tools to keep the platform safe.',
  },
];

const parentFAQs = [
  {
    question: 'What do I need to do as a parent?',
    answer:
      'When your child submits a project, you will be asked to give your consent before it can go live. You can also view your child\u0027s funding progress and all drawdown activity from your parent dashboard.',
  },
  {
    question: 'Is my child\'s information safe?',
    answer:
      'Yes. We take child safety very seriously. Student profiles only show first names and school names — no personal contact details are ever displayed publicly. All payment data is handled securely by Stripe.',
  },
  {
    question: 'Can I stop a project if I have concerns?',
    answer:
      'If you have concerns about your child\u0027s project at any time, please contact us directly and we will work with you to resolve the situation.',
  },
];

const sections = [
  { id: 'general', label: 'General', icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-100', faqs: generalFAQs },
  { id: 'students', label: 'Students', icon: Rocket, color: 'text-emerald-600', bg: 'bg-emerald-50', faqs: studentFAQs },
  { id: 'teachers', label: 'Teachers', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', faqs: teacherFAQs },
  { id: 'backers', label: 'Backers', icon: Heart, color: 'text-purple-600', bg: 'bg-purple-50', faqs: backerFAQs },
  { id: 'parents', label: 'Parents', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', faqs: parentFAQs },
];

export default function FAQPage() {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              <MessageCircle className="h-4 w-4" />
              Got questions?
            </div>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={200}>
            <p className="text-xl text-gray-500 font-light">
              Everything you need to know about Futurepreneurs. Can not find what you are looking for?{' '}
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4">
                Get in touch
              </Link>
              .
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ FAQ SECTIONS ═══ */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, sectionIndex) => (
            <AnimateIn key={section.id} delay={sectionIndex * 50}>
              <div className={sectionIndex > 0 ? 'mt-16' : ''}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${section.bg} p-2 rounded-xl`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.label}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                    {section.faqs.length} questions
                  </span>
                </div>
                <Accordion items={section.faqs} />
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Still have questions?
            </h2>
          </AnimateIn>
          <AnimateIn delay={100}>
            <p className="text-xl text-emerald-100 mb-10 font-light">
              We are happy to help. Reach out and we will get back to you as soon as we can.
            </p>
          </AnimateIn>
          <AnimateIn delay={200}>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-4 shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
