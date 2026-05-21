# LocalDeviceManager

Ferramenta web moderna de controle de estoque de dispositivos, com autenticação simples, CRUD de dispositivos e categorias, e persistência em SQLite local.

## 🚀 Tecnologias
- Next.js 14 (App Router) + TypeScript
- TailwindCSS + shadcn/ui + Lucide Icons
- Prisma ORM + SQLite
- Autenticação via cookie httpOnly (JWT)
- React Hook Form + Zod
- Recharts

## 📦 Como executar localmente

git clone <url-do-repo>
cd LocalDeviceManager
cp .env.example .env
npm run setup
npm run dev

Acesse: http://localhost:3000
Login padrão: admin / admin

## 🗄️ Resetar banco
rm prisma/dev.db && npm run setup
