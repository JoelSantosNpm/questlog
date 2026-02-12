"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCampaign(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.campaign.create({
    data: {
      name,
    },
  });

  revalidatePath("/");
}
