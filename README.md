# Billing System

A complete billing and customer management system built with Next.js, React, TypeScript, and Supabase.

## Features

- **Customer Management** - Add, edit, and organize customer information
- **Product Catalog** - Manage products and services with prices and VAT
- **Invoice Generation** - Create professional invoices with sequential numbers
- **Preview** - Preview invoices before sending them
- **Real-Time Dashboard** - Automatically updated statistics
- **Cloud Database** - Secure storage with Supabase

## Technologies

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI:** Tailwind CSS, Shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/jairoteran/billing-system.git
cd billing-system
```

2. **Install the dependencies:**

```bash
npm install
```

3. **Configure the environment variables:**

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials.

4. **Set up the database:**

- Run the `scripts/01-create-database-schema.sql` script in Supabase
- Optional: Run `scripts/02-seed-sample-data.sql` to add sample data

5. **Run the project:**

```bash
npm run dev
```

## Supabase Configuration

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anonymous key
3. Configure the variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key
```

## Usage

- **Dashboard:** Overview with statistics
- **Customers:** Complete customer management
- **Products:** Product and service catalog
- **Invoices:** Create and manage invoices
- **New Invoice:** Invoice generator with preview

## Deployment

The project is compatible with any provider that supports Next.js, such as Vercel, Netlify, Railway, and others.

## License

This project is open source and available under the MIT License.

## Developer

**Jairo Teran**

- Email: [jteran0901@gmail.com](mailto:jteran0901@gmail.com)
- GitHub: [@jairoteran](https://github.com/jairoteran)

---
