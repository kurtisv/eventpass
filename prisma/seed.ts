import { PrismaClient, Role } from "../apps/web/src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.AUTH_DEMO_EMAIL ?? "admin@example.com";
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Demo Admin",
    },
  });
  const organization = await prisma.organization.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Default Organization",
      slug: "default",
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: { role: Role.OWNER },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: Role.OWNER,
    },
  });

  await prisma.service.upsert({
    where: { slug: "consultation" },
    update: {},
    create: {
      name: "Consultation",
      slug: "consultation",
      description: "Service de demonstration pour le module booking.",
      durationMin: 60,
      priceCents: 12500,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
