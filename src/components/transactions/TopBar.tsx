import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  actions?: ReactNode;
}

const TopBar = ({ actions }: TopBarProps) => {
  return (
    <div className="flex h-14 md:h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-primary text-lg md:text-xl font-bold text-foreground">
          Transactions
        </h1>
        <p className="font-secondary text-[12px] md:text-[13px] text-muted-foreground hidden md:block">
          All income and expense entries
        </p>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button variant="outline" className="hidden md:flex">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 0.5V9.5M0.5 5H9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Export
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
