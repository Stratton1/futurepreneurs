'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assignOrRegenerateDisplayHandle } from './actions';
import { RefreshCw } from 'lucide-react';

export function DisplayHandleSection({ initialHandle }: { initialHandle: string | null }) {
  const [handle, setHandle] = useState<string | null>(initialHandle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    setError(null);
    setLoading(true);
    const result = await assignOrRegenerateDisplayHandle();
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.handle) setHandle(result.handle);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {handle ? (
        <span className="font-mono text-lg font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
          {handle}
        </span>
      ) : (
        <span className="text-gray-500 text-sm">Generating...</span>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRegenerate}
        disabled={loading}
        isLoading={loading}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        {handle ? 'Get new one' : 'Generate'}
      </Button>
      {error && <p className="text-sm text-red-600 w-full">{error}</p>}
    </div>
  );
}
