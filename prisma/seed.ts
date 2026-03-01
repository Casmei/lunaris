import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const transactions = [
  {
    type: "income",
    amount: 5200.0,
    description: "Salário mensal",
    category: "Salário",
    account: "Nubank",
    date: new Date("2026-02-01"),
  },
  {
    type: "income",
    amount: 870.0,
    description: "Freelance design",
    category: "Salário",
    account: "Inter",
    date: new Date("2026-02-05"),
  },
  {
    type: "income",
    amount: 300.0,
    description: "Cashback acumulado",
    category: "Outros",
    account: "Nubank",
    date: new Date("2026-02-10"),
  },
  {
    type: "expense",
    amount: 45.9,
    description: "Supermercado Dia",
    category: "Alimentação",
    account: "Nubank",
    date: new Date("2026-02-03"),
  },
  {
    type: "expense",
    amount: 89.9,
    description: "Conta de luz",
    category: "Utilidades",
    account: "Bradesco",
    date: new Date("2026-02-07"),
  },
  {
    type: "expense",
    amount: 55.9,
    description: "Netflix + Spotify",
    category: "Assinatura",
    account: "Nubank",
    date: new Date("2026-02-08"),
  },
  {
    type: "expense",
    amount: 32.0,
    description: "Uber para o trabalho",
    category: "Transporte",
    account: "Inter",
    date: new Date("2026-02-12"),
  },
  {
    type: "expense",
    amount: 37.84,
    description: "Farmácia São Paulo",
    category: "Saúde",
    account: "Itaú",
    date: new Date("2026-02-15"),
  },
  {
    type: "expense",
    amount: 120.0,
    description: "Cinema + jantar",
    category: "Entretenimento",
    account: "Nubank",
    date: new Date("2026-02-18"),
  },
  {
    type: "expense",
    amount: 210.5,
    description: "Compras do mês",
    category: "Alimentação",
    account: "Bradesco",
    date: new Date("2026-02-20"),
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.transaction.deleteMany();

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }

  const count = await prisma.transaction.count();
  console.log(`Seed complete: ${count} transactions created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
