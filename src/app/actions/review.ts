"use server";

import { db } from "@/db";
import { reviews, bookings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createReviewAction(data: {
  tenantId: string;
  bookingId: string;
  staffId: string;
  rating: number;
  comment?: string;
}) {
  try {
    // Check if review already exists for this booking
    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.bookingId, data.bookingId)
    });

    if (existing) {
      return { success: false, error: "REVIEW_ALREADY_EXISTS" };
    }

    const [newReview] = await db.insert(reviews).values({
      tenantId: data.tenantId,
      bookingId: data.bookingId,
      staffId: data.staffId,
      rating: data.rating,
      comment: data.comment,
    }).returning();

    revalidatePath("/[locale]/admin/staff", "page");
    return { success: true, review: newReview };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
}

export async function getStaffReviewsAction(staffId: string) {
  try {
    return await db.query.reviews.findMany({
      where: eq(reviews.staffId, staffId),
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)]
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
