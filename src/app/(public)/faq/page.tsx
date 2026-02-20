import { Accordion } from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about Futurepreneurs. Can not find what you are looking for?{' '}
            <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      {/* General */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">General</h2>
          <Accordion items={generalFAQs} />
        </div>
      </section>

      {/* Students */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">For Students</h2>
          <Accordion items={studentFAQs} />
        </div>
      </section>

      {/* Teachers */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">For Teachers</h2>
          <Accordion items={teacherFAQs} />
        </div>
      </section>

      {/* Backers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">For Backers</h2>
          <Accordion items={backerFAQs} />
        </div>
      </section>

      {/* Parents */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">For Parents</h2>
          <Accordion items={parentFAQs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-emerald-100 mb-8">
            We are happy to help. Reach out and we will get back to you as soon as we can.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
