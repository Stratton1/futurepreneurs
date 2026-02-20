import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { FundingProgressBar } from './funding-progress-bar';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface ProjectCardProps {
  id: string;
  title: string;
  shortDescription: string | null;
  category: string;
  goalAmount: number;
  totalRaised: number;
  backerCount: number;
  images: string[];
  studentName: string;
  schoolName?: string | null;
  status?: string;
}

export function ProjectCard({
  id,
  title,
  shortDescription,
  category,
  goalAmount,
  totalRaised,
  backerCount,
  images,
  studentName,
  schoolName,
}: ProjectCardProps) {
  const hasImage = images && images.length > 0;
  const percentage = goalAmount > 0 ? Math.min((totalRaised / goalAmount) * 100, 100) : 0;

  return (
    <Link href={`/projects/${id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
        {/* Image */}
        <div className="aspect-[16/10] bg-gradient-to-br from-emerald-50 to-blue-50 relative overflow-hidden">
          {hasImage ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="h-8 w-8 text-emerald-500" />
                </div>
                <span className="text-xs text-gray-400">{category}</span>
              </div>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{shortDescription}</p>
          )}

          {/* Student info */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-emerald-700">
                {studentName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {studentName}
              {schoolName && <span className="text-gray-400"> at {schoolName}</span>}
            </span>
          </div>

          {/* Funding progress */}
          <FundingProgressBar
            raised={totalRaised}
            goal={goalAmount}
            backerCount={backerCount}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
