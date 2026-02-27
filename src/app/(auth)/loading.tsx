export default function AuthLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
