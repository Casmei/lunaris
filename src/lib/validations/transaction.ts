import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória").max(100),
  category: z.string().min(1, "Categoria é obrigatória"),
  account: z.string().min(1, "Conta é obrigatória"),
  date: z.date().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const CATEGORIES = [
  "Salário",
  "Alimentação",
  "Utilidades",
  "Assinatura",
  "Entretenimento",
  "Transporte",
  "Saúde",
  "Outros",
] as const;

export const ACCOUNTS = ["Nubank", "Bradesco", "Inter", "Itaú"] as const;
