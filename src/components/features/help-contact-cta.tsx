import Link from 'next/link';
import { Mail, Clock, MessageSquare } from 'lucide-react';

export function HelpContactCta() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl border border-blue-100 p-8 text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
      <p className="text-sm text-gray-600 mb-6">
        Can&apos;t find what you&apos;re looking for? Get in touch and we&apos;ll help you out.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Contact Us
        </Link>
        <a
          href="mailto:hello@futurepreneurs.co.uk"
          className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Email Us
        </a>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        <span>We typically respond within 2 working days</span>
      </div>
    </div>
  );
}
