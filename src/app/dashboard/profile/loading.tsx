export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
