import Dexie, { type Table } from "dexie";
import type { LocalTransaction, SyncQueueItem } from "@/types/transaction";

class LunarisDB extends Dexie {
  transactions!: Table<LocalTransaction>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("lunaris-db");
    this.version(1).stores({
      transactions: "++localId, id, type, date, syncedAt",
      syncQueue: "++id, transactionLocalId, operation, createdAt",
    });
  }
}

export const db = new LunarisDB();
