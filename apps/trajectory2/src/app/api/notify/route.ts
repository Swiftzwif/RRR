import { scheduleDailyEmails, sendAssessmentCompleteEmail } from "@/lib/email";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Validation schema
const notifySchema = z.object({
  email: z.string().email(),
  topic: z.enum(["course", "assessment", "experience"]),
  metadata: z
    .object({
      userName: z.string().optional(),
      avatar: z.enum(["Drifter", "Balancer", "Architect"]).optional(),
      overallScore: z.number().optional(),
      lowestDomains: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topic, metadata } = notifySchema.parse(body);

    // Store email in Supabase for future notifications
    const supabase = getSupabaseServiceRole();
    if (supabase) {
      await supabase.from("email_notifications").upsert(
        {
          email,
          topic,
          metadata,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "email,topic",
        }
      );
    }

    // Send appropriate email based on topic
    if (topic === "assessment" && metadata) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://trajectory.com";

      // Send assessment complete email
      await sendAssessmentCompleteEmail({
        to: email,
        userName: metadata.userName || "Commander",
        avatar: metadata.avatar || "Drifter",
        overallScore: metadata.overallScore || 0,
        lowestDomains: metadata.lowestDomains || [],
        assessmentUrl: `${baseUrl}/experience`,
      });

      // Schedule 7-day experience emails
      await scheduleDailyEmails(email, metadata.userName || "Commander");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Notification error", error as Error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save notification" },
      { status: 500 }
    );
  }
}
