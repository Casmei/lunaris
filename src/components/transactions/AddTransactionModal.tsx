"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  TransactionInput,
  CATEGORIES,
  ACCOUNTS,
} from "@/lib/validations/transaction";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AddTransactionModalProps {
  onSubmit: (data: TransactionInput) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddTransactionModal = ({ onSubmit, open: controlledOpen, onOpenChange }: AddTransactionModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
      category: "",
      account: "",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    if (open) {
      form.reset({
        type: "expense",
        amount: 0,
        description: "",
        category: "",
        account: "",
      });
    }
  }, [open, form]);

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 0.5V9.5M0.5 5H9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent variant="bottom-sheet">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription className="sr-only">
              Adicione uma nova transação financeira
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 p-6">
            {/* Type Toggle */}
            <div className="flex h-10 items-center gap-2 rounded-full bg-secondary p-1">
              <button
                type="button"
                onClick={() => form.setValue("type", "income")}
                className={`flex flex-1 items-center justify-center rounded-full py-1.5 px-3 font-secondary text-sm font-medium transition-colors ${
                  selectedType === "income"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => form.setValue("type", "expense")}
                className={`flex flex-1 items-center justify-center rounded-full py-1.5 px-3 font-secondary text-sm font-medium transition-colors ${
                  selectedType === "expense"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Saída
              </button>
            </div>

            {/* Valor */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="$ 0,00"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <span className="font-secondary text-xs text-destructive">
                  {form.formState.errors.amount.message}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Compra no mercado"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <span className="font-secondary text-xs text-destructive">
                  {form.formState.errors.description.message}
                </span>
              )}
            </div>

            {/* Conta */}
            <div className="flex flex-col gap-1.5">
              <Label>Conta</Label>
              <Controller
                control={form.control}
                name="account"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.account && (
                <span className="font-secondary text-xs text-destructive">
                  {form.formState.errors.account.message}
                </span>
              )}
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1.5">
              <Label>Categoria</Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category && (
                <span className="font-secondary text-xs text-destructive">
                  {form.formState.errors.category.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              Salvar Transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
