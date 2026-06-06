import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchApi } from '../../api';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getLastSixMonths = () => {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      name: monthNames[d.getMonth()],
      spending: 0,
    });
  }
  return result;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded shadow-md p-2 text-xs">
        <p className="font-sans text-gray-500 mb-1">{label}</p>
        <p className="font-mono font-bold text-orange-500">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/invoices')
      .then((data) => {
        const invoices = data.invoices || [];
        const baseMonths = getLastSixMonths();

        let total = 0;

        invoices.forEach((inv) => {
          // Try multiple date fields: dates.invoiceDate, createdAt, date
          const rawDate =
            inv.dates?.invoiceDate ||
            inv.createdAt ||
            inv.date;

          if (rawDate) {
            const invDate = new Date(rawDate);
            if (!isNaN(invDate.getTime())) {
              const key = `${invDate.getFullYear()}-${invDate.getMonth()}`;
              const bucket = baseMonths.find((b) => b.key === key);
              if (bucket) {
                bucket.spending += inv.total || 0;
              }
            }
          }
          total += inv.total || 0;
        });

        setChartData(baseMonths);
        setTotalSpend(total);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch invoice spending trends:', err);
        setLoading(false);
      });
  }, []);

  const maxSpend = Math.max(...chartData.map((d) => d.spending), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col w-[300px] flex-shrink-0">
      {/* Header */}
      <div className="text-body font-sans font-semibold text-gray-700 mb-1 text-center">
        Spending Trends
      </div>
      <div className="text-caption font-sans text-gray-400 text-center mb-4">
        Last 6 months
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="text-center">
          <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider">Total</div>
          <div className="text-body font-mono font-bold text-orange-500">
            ${totalSpend.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider">Peak</div>
          <div className="text-body font-mono font-bold text-gray-700">
            ${maxSpend.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider">Avg/mo</div>
          <div className="text-body font-mono font-bold text-gray-700">
            ${chartData.length > 0 ? Math.round(totalSpend / chartData.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-caption text-gray-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#D1D5DB', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FEF3C7' }} />
              <Bar
                dataKey="spending"
                fill="#F59E0B"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Empty state hint */}
      {!loading && totalSpend === 0 && (
        <p className="text-[10px] text-center text-gray-400 mt-2">
          No invoices in the last 6 months
        </p>
      )}
    </div>
  );
};

export default SpendingChart;
