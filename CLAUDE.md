# CLAUDE.md — Lunaris Finance PWA

## Visão Geral do Projeto

PWA de controle financeiro pessoal para uso mobile-first.
Permite inserção e listagem de transações financeiras com suporte offline e sincronização automática ao reconectar à internet.

---

## Stack Técnica

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS — usar os componentes da lib local do projeto (em `/src/components/ui`)
- **Formulários:** React Hook Form + Zod (validação)
- **Design Tool:** Pencil (`.pen` files na raiz do projeto) — ao gerar componentes a partir de designs, usar: `Generate Next.js TypeScript component with Tailwind CSS`

### Backend
- **API:** Next.js API Routes (`/app/api/...`) ou Server Actions
- **ORM:** Prisma
- **Banco de dados:** SQLite (desenvolvimento) → PostgreSQL (produção futura)

### PWA / Offline
- **Armazenamento offline:** IndexedDB via **Dexie.js** (wrapper tipado para IndexedDB)
- **Service Worker:** `next-pwa` (baseado em Workbox)
- **Sync strategy:** Background Sync API — fila de operações pendentes sincronizadas automaticamente ao reconectar

### Autenticação
- **MVP:** Sem autenticação (single user)
- **Futuro:** Planejado, mas não implementar agora. Deixar estrutura preparada (ex: campo `userId` nullable no schema)

---

## Arquitetura Offline-First

```
[Usuário insere transação]
        ↓
[Dexie.js salva no IndexedDB]  ← sempre, independente de conexão
        ↓
[Online?]
  ├── SIM → API Route → Prisma → SQLite  (sync imediato)
  └── NÃO → Adiciona à fila de sync (IndexedDB: tabela `syncQueue`)
              ↓
        [Service Worker detecta reconexão]
              ↓
        [Drena fila → API Route → Prisma → SQLite]
              ↓
        [Marca itens como sincronizados no IndexedDB]
```

### Resolução de Conflitos (MVP)
- Estratégia: **last-write-wins** com `updatedAt` timestamp
- Transações com `syncedAt = null` são consideradas pendentes

---

## Estrutura de Pastas

```
lunaris/
├── design.pen                    ← Arquivo de design do Pencil
├── prisma/
│   ├── schema.prisma
│   └── dev.db                    ← SQLite local
├── public/
│   ├── manifest.json             ← PWA manifest
│   └── icons/                    ← Ícones PWA (192x192, 512x512)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Redireciona para /transactions
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── transactions/
│   │           └── route.ts      ← GET, POST
│   ├── components/
│   │   ├── ui/                   ← Lib de componentes (NÃO editar diretamente)
│   │   └── transactions/
│   │       ├── TransactionList.tsx
│   │       ├── TransactionForm.tsx
│   │       └── TransactionCard.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── prisma.ts         ← Singleton do Prisma client
│   │   │   └── dexie.ts          ← Instância do Dexie (IndexedDB)
│   │   ├── sync/
│   │   │   └── syncQueue.ts      ← Lógica de fila de sincronização
│   │   └── validations/
│   │       └── transaction.ts    ← Schemas Zod
│   ├── hooks/
│   │   ├── useTransactions.ts    ← CRUD com fallback offline
│   │   ├── useOnlineStatus.ts    ← Detecta conectividade
│   │   └── useSync.ts            ← Dispara sync ao reconectar
│   └── types/
│       └── transaction.ts        ← Types TypeScript
└── CLAUDE.md
```

---

## Schema do Banco (Prisma)

```prisma
model Transaction {
  id          String   @id @default(cuid())
  type        String   // "income" | "expense"
  amount      Float
  description String
  category    String
  account     String
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String?  // nullable — preparado para auth futura
}
```

---

## Schema Zod (validação)

```typescript
// src/lib/validations/transaction.ts
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória").max(100),
  category: z.string().min(1, "Categoria é obrigatória"),
  account: z.string().min(1, "Conta é obrigatória"),
  date: z.date().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
```

---

## Dexie (IndexedDB) — Schema

```typescript
// src/lib/db/dexie.ts
class LunarisDB extends Dexie {
  transactions!: Table<LocalTransaction>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super("lunaris-db")
    this.version(1).stores({
      transactions: "++localId, id, type, date, syncedAt",
      syncQueue: "++id, transactionLocalId, operation, createdAt",
    })
  }
}
```

---

## Convenções de Código

### Geral
- TypeScript strict: sem `any`, tipar tudo explicitamente
- Componentes: arrow functions com `export default`
- Nomes de arquivos: PascalCase para componentes, camelCase para hooks/utils
- Imports: usar alias `@/` (ex: `import { X } from "@/components/ui/X"`)

### Componentes
- Usar **sempre** os componentes da lib local (`/src/components/ui`) quando disponíveis
- Não duplicar componentes — verificar a lib antes de criar um novo
- Componentes de página ficam em `/src/components/[feature]/`

### Formulários
- **Sempre** usar React Hook Form + Zod via `zodResolver`
- Não usar `useState` para campos de formulário
- Exemplo padrão:
  ```typescript
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "expense", amount: 0 }
  })
  ```

### API Routes
- Sempre validar body com Zod antes de qualquer operação no banco
- Retornar erros padronizados: `{ error: string, details?: unknown }`
- Usar try/catch em todas as rotas

### Hooks de Dados
- `useTransactions` deve:
  1. Ler sempre do IndexedDB primeiro (resposta imediata)
  2. Tentar sincronizar com API se online
  3. Nunca bloquear a UI esperando resposta da API

---

## Dados Fake (MVP)

As seguintes funcionalidades usam dados hardcoded no MVP:
- **Categorias:** `["Salário", "Alimentação", "Utilidades", "Assinatura", "Entretenimento", "Transporte", "Saúde", "Outros"]`
- **Contas:** `["Nubank", "Bradesco", "Inter", "Itaú"]`
- **Dashboard/Gráficos:** Calcular a partir das transações reais, sem API separada
- **Transações recorrentes:** UI fake, sem lógica real

---

## PWA Config

```json
// public/manifest.json
{
  "name": "Lunaris Finance",
  "short_name": "Lunaris",
  "theme_color": "#0a0a0a",
  "background_color": "#0a0a0a",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/transactions",
  "icons": [...]
}
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Prisma
npx prisma migrate dev --name <nome>
npx prisma studio

# Type check
npx tsc --noEmit

# Build PWA
npm run build
```

---

## Fluxo de Desenvolvimento com Pencil (via MCP)

O Pencil roda como um servidor MCP local que expõe o canvas diretamente ao Claude Code — não é necessário referenciar o `.pen` file manualmente nos prompts. O Claude Code "enxerga" o design em tempo real via protocolo MCP.

> **Nota:** O `.pen` file ainda é salvo no repositório (versionado com Git), mas isso acontece automaticamente pelo Pencil. Você não precisa interagir com ele diretamente.

### Fluxo padrão

1. Abrir o Pencil (extensão IDE ou app desktop) com o projeto
2. Selecionar o frame/componente desejado no canvas
3. No Claude Code, descrever o que quer gerar — o MCP passa o contexto visual automaticamente
4. Prompt padrão recomendado:
   > _"Generate a Next.js TypeScript component from the selected Pencil frame, using Tailwind CSS and components from /src/components/ui when available"_
5. Revisar o código gerado e ajustar imports para a lib local se necessário

### Comandos úteis no Claude Code com Pencil MCP ativo

```bash
# Gerar componente a partir do frame selecionado
> Create a React component from this Pencil design using our component library

# Sincronizar mudança de estilo
> Update the TransactionCard component to match the updated Pencil design

# Gerar página inteira
> Generate the /transactions Next.js page from the current Pencil canvas
```

---

## Perguntas Frequentes ao Iniciar uma Task

Antes de implementar qualquer feature, Claude deve verificar:
1. **Existe componente na lib local** (`/src/components/ui`) para o que preciso?
2. **A operação precisa funcionar offline?** → Usar Dexie, não fetch direto
3. **Há validação Zod** para os dados dessa feature?
4. **O schema do Prisma** precisa de migração?

Se houver dúvida sobre qualquer decisão de arquitetura, **perguntar antes de implementar**.

---

## Status do MVP

- [ ] Setup inicial (Next.js + Prisma + Dexie + next-pwa)
- [ ] Schema Prisma + migração SQLite
- [ ] IndexedDB schema (Dexie)
- [ ] API Route: POST /api/transactions
- [ ] API Route: GET /api/transactions
- [ ] Hook: useTransactions (offline-first)
- [ ] Hook: useOnlineStatus
- [ ] Hook: useSync (auto-sync ao reconectar)
- [ ] Componente: TransactionForm (React Hook Form + Zod)
- [ ] Componente: TransactionList
- [ ] Página: /transactions
- [ ] PWA manifest + service worker
- [ ] Teste offline/sync
