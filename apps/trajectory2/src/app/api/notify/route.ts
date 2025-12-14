import { scheduleDailyEmails, sendAssessmentCompleteEmail } from "@/lib/email";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

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

    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      return errorResponse(
        ErrorCodes.INVALID_INPUT,
        "Invalid email address",
        undefined,
        400
      );
    }

    // Sanitize user name if present
    const sanitizedMetadata = metadata ? {
      ...metadata,
      userName: metadata.userName ? sanitizeText(metadata.userName) : undefined,
      lowestDomains: metadata.lowestDomains?.map(d => sanitizeText(d)),
    } : undefined;

    // Store email in Supabase for future notifications
    const supabase = getSupabaseServiceRole();
    if (supabase) {
      const { error: dbError } = await supabase.from("email_notifications").upsert(
        {
          email: sanitizedEmail,
          topic,
          metadata: sanitizedMetadata,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "email,topic",
        }
      );

      if (dbError) {
        logger.error("Database error storing notification", dbError);
        return errorResponse(
          ErrorCodes.DATABASE_ERROR,
          "Failed to store notification",
          undefined,
          500
        );
      }
    }

    // Send appropriate email based on topic
    if (topic === "assessment" && sanitizedMetadata) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://trajectory.com";

      try {
        // Send assessment complete email
        await sendAssessmentCompleteEmail({
          to: sanitizedEmail,
          userName: sanitizedMetadata.userName || "Commander",
          avatar: sanitizedMetadata.avatar || "Drifter",
          overallScore: sanitizedMetadata.overallScore || 0,
          lowestDomains: sanitizedMetadata.lowestDomains || [],
          assessmentUrl: `${baseUrl}/experience`,
        });

        // Schedule 7-day experience emails
        await scheduleDailyEmails(sanitizedEmail, sanitizedMetadata.userName || "Commander");
      } catch (emailError) {
        logger.error("Email sending error", emailError as Error);
        return errorResponse(
          ErrorCodes.EXTERNAL_SERVICE_ERROR,
          "Failed to send email",
          undefined,
          502
        );
      }
    }

    return successResponse({ message: "Notification saved successfully" });
  } catch (error) {
    logger.error("Notification error", error as Error);

    if (error instanceof z.ZodError) {
      return errorResponse(
        ErrorCodes.INVALID_INPUT,
        "Invalid request data",
        error.issues,
        400
      );
    }

    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      "Failed to process notification",
      undefined,
      500
    );
  }
}
