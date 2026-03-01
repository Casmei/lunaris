"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface BottomNavProps {
  onAddTransaction?: () => void;
}

const BottomNav = ({ onAddTransaction }: BottomNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background md:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 px-4 py-2 ${
          pathname === "/" ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 22 }}>
          dashboard
        </span>
        <span className="font-secondary text-[10px]">Home</span>
      </Link>

      {onAddTransaction && (
        <button
          onClick={onAddTransaction}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg -mt-5"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 26 }}>
            add
          </span>
        </button>
      )}

      <Link
        href="/transactions"
        className={`flex flex-col items-center gap-0.5 px-4 py-2 ${
          pathname === "/transactions"
            ? "text-foreground"
            : "text-muted-foreground"
        }`}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 22 }}>
          receipt_long
        </span>
        <span className="font-secondary text-[10px]">Transações</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
