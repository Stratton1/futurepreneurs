'use client';

import { useState } from 'react';
import { addVendorToAllowlist } from './actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function VendorForm({ projectId }: { projectId: string }) {
  const [vendorName, setVendorName] = useState('');
  const [vendorMcc, setVendorMcc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!vendorName.trim()) {
      setError('Vendor name is required');
      return;
    }
    setError(null);
    setIsAdding(true);
    const result = await addVendorToAllowlist(projectId, vendorName, vendorMcc || undefined);
    setIsAdding(false);
    if (result.error) {
      setError(result.error);
    } else {
      setVendorName('');
      setVendorMcc('');
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-3">Add Approved Vendor</h3>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Vendor name (e.g. Amazon, Hobbycraft)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="w-32">
          <input
            type="text"
            value={vendorMcc}
            onChange={(e) => setVendorMcc(e.target.value)}
            placeholder="MCC (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={isAdding}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      </div>
    </div>
  );
}
