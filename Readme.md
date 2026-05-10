# 🚀 k8-stack CLI

**The fastest way to scaffold modern, free-tier-friendly Next.js full-stack applications.**

`k8-stack` is a zero-configuration CLI tool that completely bypasses tedious setup prompts. It instantly scaffolds a Next.js app (App Router, Tailwind, TypeScript) and automatically installs/initializes your preferred Auth, Database, and ORM stack in seconds.

**Bonus:** It automatically detects if you have [Bun](https://bun.sh/) installed and will use it for ultra-fast package installations. Otherwise, it gracefully falls back to NPM.

---

## 📦 Usage

You don't even need to install it! Just run it using `npx` or `bunx`:

```bash
# Using NPM
npx k8-stack my-awesome-app --standard

# Using Bun
bunx k8-stack my-awesome-app --modern
```

*(Note: If you don't provide a project name, it defaults to `my-app`)*

---

## 🛠️ Available Stacks

Pass one of the following flags to instantly generate your preferred stack. All databases and auth providers selected have generous **free tiers** perfect for indie hackers and side projects.

| Flag | Auth | Database | ORM / ODM |
| :--- | :--- | :--- | :--- |
| `--standard` | NextAuth.js | SQL (Neon/Turso) | Prisma |
| `--modern` | Clerk | SQL (Neon/Turso) | Drizzle |
| `--ultra-fast` | Clerk | SQL (Neon/Turso) | Drizzle |
| `--baas-sql` | SupaAuth | Supabase | SupaSDK |
| `--bass-nosql` | FireAuth | Firebase | SDK |
| `--classic` | NextAuth | MongoDB Atlas | Mongoose |
| `--open-source` | NextAuth | SQL (Neon/Turso) | Drizzle |
| `--kinde-standard`| Kinde | SQL (Neon/Turso) | Prisma |
| `--kinde-edge` | Kinde Auth | SQL (Neon/Turso) | Drizzle |
| `--mongo-standard`| NextAuth.js | MongoDB Atlas | Mongoose |
| `--mongo-kinde` | Kinde | MongoDB Atlas | Mongoose |
| `--mongo-clerk` | Clerk | MongoDB Atlas | Mongoose |

### Example
```bash
npx k8-stack saas-dashboard --modern
```
**What this does:**
1. Runs `create-next-app` with the `-y` flag (skips all prompts, sets up TS + Tailwind + App Router).
2. Installs `@clerk/nextjs`, `drizzle-orm`, and `@neondatabase/serverless`.
3. Installs `drizzle-kit` as a dev dependency.
4. Uses `bun` automatically if detected on your system!

---

## ✨ Features

- **Prompt-Free Setup:** Skips the interactive Next.js setup menu to save you time.
- **Smart Package Manager Detection:** Automatically uses `bun` if available, falling back to `npm`.
- **Cross-Platform Execution:** Safely executes commands across Windows, macOS, and Linux without breaking directory contexts.
- **Production-Ready Stacks:** Curated combinations of the most popular modern tooling.

---

## 📝 Next Steps (Post-Installation)

Because these are full-stack applications, you will need to set up your environment variables after the CLI finishes.

Navigate into your new project:
```bash
cd my-awesome-app
```
Create a `.env.local` file and add the required keys based on your chosen stack:

### For Prisma / Drizzle + Neon (SQL)
```env
DATABASE_URL="postgres://<user>:<password>@<endpoint>.neon.tech/neondb"
```

### For MongoDB + Mongoose (NoSQL)
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myDatabaseName"
```

### For Clerk Auth
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### For Kinde Auth
```env
KINDE_CLIENT_ID="<your_kinde_client_id>"
KINDE_CLIENT_SECRET="<your_kinde_client_secret>"
KINDE_ISSUER_URL="https://<your_kinde_subdomain>.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"
```

---

## 👨‍💻 Local Development

Want to add your own custom stack to this CLI? 

1. Clone the repository
2. Run `npm install`
3. Link the package locally to test it globally on your machine:
```bash
npm link
```
4. Test the command anywhere on your computer:
```bash
k8-stack test-app --modern
```
5. When you're done, unlink it:
```bash
npm unlink -g k8-stack
```

## 📄 License
MIT