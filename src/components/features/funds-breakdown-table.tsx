interface FundsBreakdownRow {
  label: string;
  amount: number;
}

interface FundsBreakdownTableProps {
  rows: FundsBreakdownRow[];
}

export default function FundsBreakdownTable({ rows }: FundsBreakdownTableProps) {
  if (rows.length === 0) return null;

  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-3 py-2 font-medium text-gray-600">Item</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-50">
              <td className="px-3 py-2 text-gray-700">{row.label}</td>
              <td className="px-3 py-2 text-right text-gray-700">
                £{row.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50">
            <td className="px-3 py-2 font-medium text-gray-800">Total</td>
            <td className="px-3 py-2 text-right font-medium text-gray-800">
              £{total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
