import { redirect } from "next/navigation";

import { Role } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { canBootstrapDashboard, dashboardRoles, isDashboardRole } from "@/lib/dashboard-auth-rules";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function requireDashboardAccess() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: session.user.name,
      image: session.user.image,
    },
    create: {
      email,
      name: session.user.name,
      image: session.user.image,
    },
    select: { id: true },
  });

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      role: { in: [...dashboardRoles] },
    },
    select: {
      organizationId: true,
      role: true,
    },
  });

  if (membership && isDashboardRole(membership.role)) {
    return {
      userId: user.id,
      email,
      organizationId: membership.organizationId,
      role: membership.role,
    };
  }

  const membershipCount = await prisma.membership.count();

  if (
    canBootstrapDashboard({
      email,
      bootstrapEmails: env.DASHBOARD_BOOTSTRAP_EMAILS,
      membershipCount,
      nodeEnv: process.env.NODE_ENV,
    })
  ) {
    const organization = await prisma.organization.upsert({
      where: { slug: "default" },
      update: {},
      create: {
        name: "Default Organization",
        slug: "default",
      },
      select: { id: true },
    });

    const bootstrapped = await prisma.membership.upsert({
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
      select: { organizationId: true, role: true },
    });

    return {
      userId: user.id,
      email,
      organizationId: bootstrapped.organizationId,
      role: bootstrapped.role,
    };
  }

  redirect("/dashboard?error=forbidden");
}
