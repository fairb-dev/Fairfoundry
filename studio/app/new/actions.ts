"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createContract(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const oemName = (formData.get("oemName") as string)?.trim();
  const factoryName = (formData.get("factoryName") as string)?.trim();

  if (!title || !oemName || !factoryName) {
    throw new Error("All fields are required.");
  }

  // Upsert OEM company
  const oemSlug = slugify(oemName);
  let oem = await prisma.company.findUnique({ where: { slug: oemSlug } });
  if (!oem) {
    oem = await prisma.company.create({
      data: { name: oemName, slug: oemSlug, role: "OEM" },
    });
  }

  // Upsert Factory company
  const factorySlug = slugify(factoryName);
  let factory = await prisma.company.findUnique({
    where: { slug: factorySlug },
  });
  if (!factory) {
    factory = await prisma.company.create({
      data: { name: factoryName, slug: factorySlug, role: "FACTORY" },
    });
  }

  // Create contract with parties
  const contract = await prisma.contract.create({
    data: {
      title,
      status: "DRAFT",
      parties: {
        create: [
          { companyId: oem.id, role: "OEM" },
          { companyId: factory.id, role: "FACTORY" },
        ],
      },
    },
  });

  redirect(`/${contract.id}/data`);
}
