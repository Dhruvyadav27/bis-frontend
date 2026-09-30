export default function Table({
  columns = [],
  data = [],
  rowKey = 'id',
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
}) {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx} scope="col" className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const key = typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] ?? rowIdx)
                const isClickable = Boolean(onRowClick)
                return (
                  <tr
                    key={key}
                    onClick={() => isClickable && onRowClick(row)}
                    className={`transition-colors ${
                      isClickable ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={col.key || colIdx} className={`px-4 py-3.5 align-middle ${col.className || ''}`}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
