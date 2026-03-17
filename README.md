# Personal Finance Tracker

A full‑stack web app to track personal income and expenses with a clean dashboard, recent transactions view, and category‑wise analysis.

- **Frontend**: React (Vite), shadcn‑style UI components
- **Backend**: Node + Express
- **Database**: Supabase (PostgreSQL)
- **Hosting target**: Frontend on Vercel, backend on Render (or any Node host)

---

## Features

- **Add / edit / delete transactions**
  - Amount, description, type (income/expense), category
  - Custom categories saved in local storage

- **Dashboard analytics**
  - Total balance, total income, total expenses
  - Top spending category
  - Recent transactions and top spending categories with mini bars

- **Home overview**
  - Summary cards (balance, income, expenses)
  - 3 most recent transactions
  - CTA to add a new transaction

- **Transactions page**
  - Current balance card (green if positive, red if negative)
  - Add New Transaction card
  - Recent Transactions card with inline edit + delete

- **Consistent UX**
  - Same green/red shades for all amounts on all pages
  - Card‑based layout with responsive grid
  - Simple navbar for `Home`, `Transactions`, `Dashboard`

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- shadcn‑style UI primitives (`Card`, `Button`, `Input`)
- Tailwind‑based utility classes via CSS

### Backend

- Node.js + Express
- Supabase JavaScript client (`@supabase/supabase-js`)

### Database (Supabase)

Tables expected:

create table if not exists transactions (
  id bigint primary key,         -- timestamp from Date.now()
  amount numeric,
  description text,
  type text,                     -- 'income' or 'expense'
  category text
);

create table if not exists logs (
  id bigserial primary key,
  action text,                   -- 'ADD', 'EDIT', 'DELETE'
  transaction_id bigint,
  data jsonb,
  timestamp text
);
