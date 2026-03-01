"use client";

import { useMemo, useState } from "react";
// import Sidebar from "@/components/ui/Sidebar";
import TopBar from "@/components/transactions/TopBar";
import StatsCard from "@/components/transactions/StatsCard";
import DonutChart from "@/components/transactions/DonutChart";
import TransactionTable from "@/components/transactions/TransactionTable";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import BottomNav from "@/components/BottomNav";
import useTransactions from "@/hooks/useTransactions";

const formatCurrency = (amount: number) =>
  amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function TransactionsPage() {
  const { transactions, loading, addTransaction } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => {
    const incomes = transactions.filter((tx) => tx.type === "income");
    const expenses = transactions.filter((tx) => tx.type === "expense");
    const totalIncome = incomes.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalIncome,
      totalExpense,
      incomeCount: incomes.length,
      expenseCount: expenses.length,
    };
  }, [transactions]);

  return (
    <div className="flex min-h-full flex-col">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      {/* <Sidebar /> */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          actions={
            <AddTransactionModal
              onSubmit={addTransaction}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />
          }
        />
        <div className="flex flex-1 flex-col gap-4 md:gap-5 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
          {/* Stats Row */}
          <div className="flex flex-col md:flex-row w-full gap-3 md:gap-4">
            <StatsCard
              label="Total de Entradas"
              value={`+${formatCurrency(stats.totalIncome)}`}
              subtitle={`${stats.incomeCount} transações recebidas`}
              type="income"
            />
            <StatsCard
              label="Total de Saídas"
              value={`-${formatCurrency(stats.totalExpense)}`}
              subtitle={`${stats.expenseCount} transações de saída`}
              type="expense"
            />
            <DonutChart transactions={transactions} />
          </div>

          {/* Transaction Table / Card List */}
          <TransactionTable transactions={transactions} loading={loading} />
        </div>
      </main>

      <BottomNav onAddTransaction={() => setModalOpen(true)} />
    </div>
  );
}
