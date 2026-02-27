export default function WalletLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded-lg" />
      <div className="rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        <div className="h-4 w-full bg-gray-100 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
