import { Card } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string;
  subtitle: string;
  type: "income" | "expense";
}

const StatsCard = ({ label, value, subtitle, type }: StatsCardProps) => {
  const isIncome = type === "income";
  const valueColor = isIncome ? "text-green-500" : "text-red-500";
  const iconName = isIncome ? "trending_up" : "trending_down";
  const iconColor = isIncome ? "text-green-500" : "text-red-500";

  return (
    <Card className="flex flex-1 flex-col gap-1.5 md:gap-2 p-3 md:p-5">
      <div className="flex w-full items-center justify-between">
        <span className="font-secondary text-[12px] md:text-[13px] font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={`material-symbols-rounded ${iconColor}`}
          style={{ fontSize: 18 }}
        >
          {iconName}
        </span>
      </div>
      <span className={`font-primary text-xl md:text-[26px] font-bold ${valueColor}`}>
        {value}
      </span>
      <span className="font-secondary text-[11px] md:text-xs text-muted-foreground">
        {subtitle}
      </span>
    </Card>
  );
};

export default StatsCard;
