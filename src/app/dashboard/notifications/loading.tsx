export default function NotificationsLoading() {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      <div className="h-8 w-44 bg-gray-200 rounded-lg" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/4 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
