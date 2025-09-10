import { logLeadSubmit } from "@/lib/events";
import { getMongo } from "@/lib/mongo";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema
const LeadRequestSchema = z.object({
  submissionId: z.string().min(1),
  email: z.string().email(),
  moduleId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = LeadRequestSchema.parse(body);

    // Check if submission exists - try Supabase first, then MongoDB fallback
    let submission: any = null;
    let moduleId: string = validatedData.moduleId || "ktb";

    // Primary read: Supabase
    try {
      const sb = getSupabaseServiceRole();
      if (sb) {
        const { data, error } = await sb
          .from("submissions")
          .select("id, module_id")
          .eq("id", validatedData.submissionId)
          .single();

        if (!error && data) {
          submission = data;
          moduleId = data.module_id || moduleId;
          console.log("Found submission in Supabase:", data.id);
        }
      }
    } catch (supabaseError) {
      console.error("Supabase read error:", supabaseError);
    }

    // Fallback read: MongoDB
    if (!submission) {
      try {
        const mongo = await getMongo();
        if (mongo) {
          const { ObjectId } = await import("mongodb");
          let query: any = { id: validatedData.submissionId };
          try {
            query = { _id: new ObjectId(validatedData.submissionId) };
          } catch {}
          submission = await mongo.db.collection("submissions").findOne(query);

          if (submission) {
            moduleId = submission.moduleId || moduleId;
            console.log(
              "Found submission in MongoDB fallback:",
              submission._id || submission.id
            );
          }
        }
      } catch (mongoError) {
        console.error("MongoDB fallback read error:", mongoError);
      }
    }

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Save lead - primary write to Supabase
    let leadSaved = false;
    try {
      const sb = getSupabaseServiceRole();
      if (sb) {
        const { error } = await sb.from("leads").insert({
          submission_id: validatedData.submissionId,
          module_id: moduleId,
          email: validatedData.email,
          source: "assessment",
        });

        if (error) {
          console.error("Supabase lead write error:", error);
          throw error;
        }

        leadSaved = true;
        console.log("Successfully saved lead to Supabase");
      }
    } catch (supabaseError) {
      console.error("Supabase lead write failed:", supabaseError);
    }

    // Fallback write to MongoDB (during transition)
    if (!leadSaved) {
      try {
        const mongo = await getMongo();
        if (mongo) {
          await mongo.db.collection("leads").insertOne({
            moduleId,
            submissionId: validatedData.submissionId,
            email: validatedData.email,
            source: "assessment",
            createdAt: new Date(),
          });
          leadSaved = true;
          console.log("Fallback lead write to MongoDB successful");
        }
      } catch (mongoError) {
        console.error("MongoDB fallback lead write failed:", mongoError);
      }
    }

    // Dual-write to MongoDB for transition period (if Supabase was primary)
    if (leadSaved) {
      try {
        const mongo = await getMongo();
        if (mongo) {
          await mongo.db.collection("leads").insertOne({
            moduleId,
            submissionId: validatedData.submissionId,
            email: validatedData.email,
            source: "assessment",
            createdAt: new Date(),
          });
          console.log("Dual-write lead to MongoDB successful");
        }
      } catch (dualWriteError) {
        console.error(
          "Dual-write lead to MongoDB failed (non-critical):",
          dualWriteError
        );
      }
    }

    if (!leadSaved) {
      throw new Error("Failed to save lead to any database");
    }

    // Log lead submission
    logLeadSubmit(validatedData.submissionId, validatedData.email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead submission error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
