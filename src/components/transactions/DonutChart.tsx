import { Card } from "@/components/ui/card";
import type { LocalTransaction } from "@/types/transaction";

const CATEGORY_COLORS: Record<string, string> = {
  Salário: "#22c55e",
  Alimentação: "#f97316",
  Utilidades: "#3b82f6",
  Assinatura: "#a855f7",
  Entretenimento: "#ef4444",
  Transporte: "#eab308",
  Saúde: "#06b6d4",
  Outros: "#6b7280",
};

interface DonutChartProps {
  transactions: LocalTransaction[];
}

const DonutChart = ({ transactions }: DonutChartProps) => {
  const expenseTxs = transactions.filter((tx) => tx.type === "expense");
  const totalExpenses = expenseTxs.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryTotals: Record<string, number> = {};
  for (const tx of expenseTxs) {
    categoryTotals[tx.category] = (categoryTotals[tx.category] ?? 0) + tx.amount;
  }

  const segments = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      percent: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: CATEGORY_COLORS[category] ?? "#6b7280",
    }));

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <Card className="flex w-full md:flex-1 flex-col gap-3 p-3 md:p-5">
      <div className="flex w-full items-center justify-between">
        <span className="font-secondary text-[13px] font-medium text-muted-foreground">
          Por Categoria
        </span>
        <span
          className="material-symbols-rounded text-muted-foreground"
          style={{ fontSize: 18 }}
        >
          donut_large
        </span>
      </div>
      <div className="flex w-full items-center gap-4">
        {/* Donut SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80">
          {segments.length === 0 ? (
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#2E2E2E"
              strokeWidth="14"
            />
          ) : (
            segments.map((seg, i) => {
              const dashLength = (seg.percent / 100) * circumference;
              const dashGap = circumference - dashLength;
              const offset =
                -(cumulativePercent / 100) * circumference +
                circumference * 0.25;
              cumulativePercent += seg.percent;
              return (
                <circle
                  key={i}
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${dashLength} ${dashGap}`}
                  strokeDashoffset={offset}
                />
              );
            })
          )}
        </svg>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-1.5">
          {segments.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-secondary text-[11px] text-foreground">
                {item.category}&nbsp;&nbsp;{Math.round(item.percent)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DonutChart;
