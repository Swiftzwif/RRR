import { scheduleDailyEmails, sendAssessmentCompleteEmail } from "@/lib/email";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Validation schema for notification API payload.
 *
 * Validates email, notification topic, and optional metadata for personalization.
 */
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

/**
 * POST /api/notify
 *
 * Handles notification and engagement email requests for the platform.
 *
 * Main responsibilities:
 * 1. Stores email subscription to email_notifications table for future campaigns
 * 2. For assessment topic: Sends immediate assessment completion email
 * 3. Schedules 7-day experience email sequence for ongoing engagement
 *
 * Request body must include email and topic. Metadata is used for personalization
 * when sending emails (userName, avatar, scores, lowest domains).
 *
 * @param request - POST request containing email, topic, and optional metadata
 * @returns 200 with success on completion, 400 for validation errors, 500 for server errors
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/notify', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     topic: 'assessment',
 *     metadata: {
 *       userName: 'John',
 *       avatar: 'Drifter',
 *       overallScore: 2.8,
 *       lowestDomains: ['finances', 'focus']
 *     }
 *   })
 * });
 * // => { "success": true }
 * ```
 */
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
