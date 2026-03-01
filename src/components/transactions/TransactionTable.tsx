import type { LocalTransaction } from "@/types/transaction";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Salário: { bg: "#222924", text: "#B6FFCE" },
  Alimentação: { bg: "#2E2E2E", text: "#FFFFFF" },
  Utilidades: { bg: "#291C0F", text: "#FF8400" },
  Assinatura: { bg: "#222229", text: "#B2B2FF" },
  Entretenimento: { bg: "#24100B", text: "#FF5C33" },
  Transporte: { bg: "#2E2E2E", text: "#FFFFFF" },
  Saúde: { bg: "#222924", text: "#B6FFCE" },
  Outros: { bg: "#2E2E2E", text: "#FFFFFF" },
};

const ACCOUNT_COLORS: Record<string, string> = {
  Nubank: "#a855f7",
  Bradesco: "#f97316",
  Inter: "#22c55e",
  Itaú: "#3b82f6",
};

const formatCurrency = (amount: number) =>
  amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface TransactionTableProps {
  transactions: LocalTransaction[];
  loading: boolean;
}

const TransactionCard = ({ tx }: { tx: LocalTransaction }) => {
  const isIncome = tx.type === "income";
  const catStyle = CATEGORY_STYLES[tx.category] ?? {
    bg: "#2E2E2E",
    text: "#FFFFFF",
  };
  const accountColor = ACCOUNT_COLORS[tx.account] ?? "#666666";
  const isUnsynced = tx.syncedAt === null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-secondary text-sm font-medium text-foreground truncate">
            {tx.description}
          </span>
          {isUnsynced && (
            <span
              className="material-symbols-rounded text-muted-foreground opacity-50 shrink-0"
              style={{ fontSize: 10 }}
            >
              cloud_off
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className="text-[10px] px-1.5 py-0"
            style={{
              backgroundColor: catStyle.bg,
              color: catStyle.text,
            }}
          >
            {tx.category}
          </Badge>
          <div className="flex items-center gap-1">
            <span
              className="h-[6px] w-[6px] shrink-0 rounded-full"
              style={{ backgroundColor: accountColor }}
            />
            <span className="font-secondary text-[11px] text-muted-foreground">
              {tx.account}
            </span>
          </div>
          <span className="font-secondary text-[11px] text-muted-foreground">
            {formatDate(tx.date)}
          </span>
        </div>
      </div>
      <span
        className={`font-primary text-sm font-bold shrink-0 ${
          isIncome ? "text-green-500" : "text-red-500"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(tx.amount)}
      </span>
    </div>
  );
};

const TransactionTable = ({ transactions, loading }: TransactionTableProps) => {
  return (
    <>
      {/* Mobile: Card list */}
      <div className="flex flex-col rounded-lg border border-border bg-card md:hidden">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="font-secondary text-sm text-muted-foreground">
              Carregando...
            </span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <span className="font-secondary text-sm text-muted-foreground">
              Nenhuma transação encontrada
            </span>
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionCard key={tx.localId ?? tx.id} tx={tx} />
          ))
        )}
        <div className="border-t border-border px-4 py-2.5">
          <span className="font-secondary text-[12px] text-muted-foreground">
            Mostrando {transactions.length} transações
          </span>
        </div>
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[160px]">Categoria</TableHead>
              <TableHead className="w-[150px]">Conta</TableHead>
              <TableHead className="w-[130px] text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <span className="font-secondary text-sm text-muted-foreground">
                    Carregando...
                  </span>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <span className="font-secondary text-sm text-muted-foreground">
                    Nenhuma transação encontrada
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === "income";
                const catStyle = CATEGORY_STYLES[tx.category] ?? {
                  bg: "#2E2E2E",
                  text: "#FFFFFF",
                };
                const accountColor = ACCOUNT_COLORS[tx.account] ?? "#666666";
                const isUnsynced = tx.syncedAt === null;

                return (
                  <TableRow key={tx.localId ?? tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-secondary text-[13px] text-muted-foreground">
                          {formatDate(tx.date)}
                        </span>
                        {isUnsynced && (
                          <span
                            className="material-symbols-rounded text-muted-foreground opacity-50"
                            style={{ fontSize: 10 }}
                          >
                            cloud_off
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-secondary text-sm font-medium text-foreground">
                        {tx.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: catStyle.bg,
                          color: catStyle.text,
                        }}
                      >
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-[7px] w-[7px] shrink-0 rounded-full"
                          style={{ backgroundColor: accountColor }}
                        />
                        <span className="font-secondary text-[13px] text-foreground">
                          {tx.account}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-primary text-sm font-bold ${
                          isIncome ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <span className="font-secondary text-[13px] text-muted-foreground">
                  Mostrando {transactions.length} transações
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
};

export default TransactionTable;
