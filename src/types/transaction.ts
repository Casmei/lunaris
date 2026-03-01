export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  account: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
}

export interface LocalTransaction {
  localId?: number;
  id?: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  account: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface SyncQueueItem {
  id?: number;
  transactionLocalId: number;
  operation: "create" | "update" | "delete";
  payload: string;
  createdAt: string;
}
