"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db/dexie";
import type { LocalTransaction } from "@/types/transaction";
import type { TransactionInput } from "@/lib/validations/transaction";
import useOnlineStatus from "@/hooks/useOnlineStatus";

const useTransactions = () => {
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  const loadFromIndexedDB = useCallback(async () => {
    const local = await db.transactions.orderBy("date").reverse().toArray();
    setTransactions(local);
    setLoading(false);
  }, []);

  const drainSyncQueue = useCallback(async () => {
    const queue = await db.syncQueue.toArray();
    if (queue.length === 0) return;

    for (const item of queue) {
      if (item.operation !== "create") continue;

      try {
        const payload = JSON.parse(item.payload);
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const saved = await res.json();
          const now = new Date().toISOString();
          await db.transactions.update(item.transactionLocalId, {
            id: saved.id,
            syncedAt: now,
          });
          await db.syncQueue.delete(item.id!);
        }
      } catch {
        // Ainda offline ou erro de rede — tenta no próximo ciclo
      }
    }

    await loadFromIndexedDB();
  }, [loadFromIndexedDB]);

  const syncFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=100");
      if (!res.ok) return;

      const data = await res.json();
      const serverTxs: LocalTransaction[] = data.transactions.map(
        (tx: Record<string, unknown>) => ({
          id: tx.id as string,
          type: tx.type as "income" | "expense",
          amount: tx.amount as number,
          description: tx.description as string,
          category: tx.category as string,
          account: tx.account as string,
          date:
            typeof tx.date === "string"
              ? tx.date
              : (tx.date as Date).toISOString(),
          createdAt:
            typeof tx.createdAt === "string"
              ? tx.createdAt
              : (tx.createdAt as Date).toISOString(),
          updatedAt:
            typeof tx.updatedAt === "string"
              ? tx.updatedAt
              : (tx.updatedAt as Date).toISOString(),
          syncedAt: new Date().toISOString(),
        })
      );

      await db.transaction("rw", db.transactions, async () => {
        for (const tx of serverTxs) {
          const existing = await db.transactions.where("id").equals(tx.id!).first();
          if (existing) {
            await db.transactions.update(existing.localId!, tx);
          } else {
            await db.transactions.add(tx);
          }
        }
      });

      await loadFromIndexedDB();
    } catch {
      // Offline ou erro de rede — usa dados locais
    }
  }, [loadFromIndexedDB]);

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      const now = new Date().toISOString();
      const localTx: LocalTransaction = {
        type: input.type,
        amount: input.amount,
        description: input.description,
        category: input.category,
        account: input.account,
        date: input.date?.toISOString() ?? now,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      };

      const localId = await db.transactions.add(localTx);

      if (isOnline) {
        try {
          const res = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          });

          if (res.ok) {
            const saved = await res.json();
            await db.transactions.update(localId, {
              id: saved.id,
              syncedAt: now,
            });
          } else {
            await db.syncQueue.add({
              transactionLocalId: localId as number,
              operation: "create",
              payload: JSON.stringify(input),
              createdAt: now,
            });
          }
        } catch {
          await db.syncQueue.add({
            transactionLocalId: localId as number,
            operation: "create",
            payload: JSON.stringify(input),
            createdAt: now,
          });
        }
      } else {
        await db.syncQueue.add({
          transactionLocalId: localId as number,
          operation: "create",
          payload: JSON.stringify(input),
          createdAt: now,
        });
      }

      await loadFromIndexedDB();
    },
    [isOnline, loadFromIndexedDB]
  );

  useEffect(() => {
    loadFromIndexedDB();
  }, [loadFromIndexedDB]);

  useEffect(() => {
    if (isOnline) {
      drainSyncQueue().then(() => syncFromServer());
    }
  }, [isOnline, drainSyncQueue, syncFromServer]);

  return { transactions, loading, addTransaction, refresh: syncFromServer };
};

export default useTransactions;
