import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // ---------- Usuário admin padrão ----------
  const adminUsername = "admin";
  const adminPassword = "admin"; // senha padrão — trocar em produção
  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashed,
      name: "Administrador",
      role: "admin",
    },
  });
  console.log(`✅ Usuário admin garantido: ${admin.username}`);

  // ---------- Categorias padrão ----------
  const categoriasPadrao = [
    { name: "Notebooks", description: "Computadores portáteis", color: "#3b82f6" },
    { name: "Desktops", description: "Computadores de mesa", color: "#8b5cf6" },
    { name: "Monitores", description: "Telas e displays", color: "#06b6d4" },
    { name: "Periféricos", description: "Teclados, mouses, headsets etc.", color: "#10b981" },
    { name: "Smartphones", description: "Celulares corporativos", color: "#f59e0b" },
    { name: "Impressoras", description: "Impressoras e multifuncionais", color: "#ef4444" },
    { name: "Redes", description: "Switches, roteadores e access points", color: "#6366f1" },
  ];

  for (const cat of categoriasPadrao) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    console.log(`✅ Categoria garantida: ${created.name}`);
  }

  // ---------- Dispositivos de exemplo ----------
  const notebooks = await prisma.category.findUnique({ where: { name: "Notebooks" } });
  const monitores = await prisma.category.findUnique({ where: { name: "Monitores" } });

  if (notebooks) {
    await prisma.device.upsert({
      where: { serialNumber: "NB-0001" },
      update: {},
      create: {
        name: "Dell Latitude 5430",
        serialNumber: "NB-0001",
        model: "Latitude 5430",
        manufacturer: "Dell",
        status: "available",
        location: "Almoxarifado TI",
        quantity: 1,
        categoryId: notebooks.id,
      },
    });
    console.log("✅ Dispositivo exemplo: Dell Latitude 5430");
  }

  if (monitores) {
    await prisma.device.upsert({
      where: { serialNumber: "MN-0001" },
      update: {},
      create: {
        name: "LG UltraWide 29WL500",
        serialNumber: "MN-0001",
        model: "29WL500",
        manufacturer: "LG",
        status: "in_use",
        location: "Sala Diretoria",
        quantity: 1,
        categoryId: monitores.id,
      },
    });
    console.log("✅ Dispositivo exemplo: LG UltraWide 29WL500");
  }

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
