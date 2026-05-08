"use server";

import { redirect } from "next/navigation";
import { getSample } from "@/lib/sample-catalog";

export async function startSampleSandbox(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const sample = getSample(slug);
  if (!sample) {
    throw new Error("Unknown sandbox sample.");
  }

  redirect(`/sandbox/${sample.slug}`);
}
