import questionsData from "@/content/questions.json";
import { logAssessmentComplete } from "@/lib/events";
import { getMongo } from "@/lib/mongo";
import {
  avatarFromOverall,
  computeDomainAverages,
  getLowestTwoDomains,
  overallAverage,
  type Domain,
} from "@/lib/scoring";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schemas
const SubmitRequestSchema = z.object({
  answers: z.record(z.string(), z.number().min(1).max(5)),
  reflective: z.record(z.string(), z.string()).optional(),
});

// Load domain mapping from questions.json
function loadDomainMapping(): Record<string, Domain> {
  try {
    if (!questionsData.scored || !Array.isArray(questionsData.scored)) {
      throw new Error("scored questions missing from questions.json");
    }

    const domainMapping: Record<string, Domain> = {};
    questionsData.scored.forEach((question: any) => {
      if (question.id && question.domain) {
        domainMapping[question.id] = question.domain as Domain;
      }
    });

    if (Object.keys(domainMapping).length === 0) {
      throw new Error("No valid domain mappings found in questions.json");
    }

    return domainMapping;
  } catch (error) {
    throw new Error(
      "TBD – paste verbatim questions and run npm run validate:questions"
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = SubmitRequestSchema.parse(body);
    const moduleId: string =
      (typeof body?.moduleId === "string" && body.moduleId) || "ktb";

    // Load domain mapping
    const domainMapping = loadDomainMapping();

    // Compute domain averages
    const domainScores = computeDomainAverages(validatedData.answers);

    // Compute overall average
    const overall = overallAverage(domainScores);

    // Determine avatar
    const avatar = avatarFromOverall(overall);

    // Find lowest two domains
    const lowestDomains = getLowestTwoDomains(domainScores);

    // Log completion event
    logAssessmentComplete(overall, avatar, lowestDomains);

    // Generate a unique ID for the submission
    const submissionId = crypto.randomUUID();

    // Prepare submission data
    const submissionData = {
      id: submissionId,
      moduleId,
      answers: validatedData.answers,
      reflective: validatedData.reflective || undefined,
      domainScores,
      overall,
      avatar,
      lowestDomains: lowestDomains.map((d) => d.toString()),
      createdAt: new Date(),
    };

    let submission: any = null;
    let writeSuccess = false;

    // Primary write path: Supabase
    try {
      const sb = getSupabaseServiceRole();
      if (sb) {
        const { data, error } = await sb
          .from("submissions")
          .insert({
            id: submissionId,
            module_id: moduleId,
            answers: validatedData.answers,
            reflective: validatedData.reflective || null,
            domain_scores: domainScores,
            overall,
            avatar,
            lowest_domains: lowestDomains.map((d) => d.toString()),
            created_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (error) {
          console.error("Supabase write error:", error);
          throw error;
        }

        submission = { ...submissionData, id: data.id };
        writeSuccess = true;
        console.log("Successfully wrote to Supabase:", data.id);
      }
    } catch (supabaseError) {
      console.error("Supabase primary write failed:", supabaseError);
    }

    // Fallback write path: MongoDB (during transition)
    if (!writeSuccess) {
      try {
        const mongo = await getMongo();
        if (mongo) {
          const doc = {
            moduleId,
            answers: validatedData.answers,
            reflective: validatedData.reflective || undefined,
            domainScores,
            overall,
            avatar,
            lowestDomains: lowestDomains.map((d) => d.toString()),
            createdAt: new Date(),
          };
          const res = await mongo.db.collection("submissions").insertOne(doc);
          submission = { id: res.insertedId.toString(), ...doc };
          writeSuccess = true;
          console.log("Fallback write to MongoDB successful:", res.insertedId);
        }
      } catch (mongoError) {
        console.error("MongoDB fallback write failed:", mongoError);
      }
    }

    // Dual-write to MongoDB for transition period (if Supabase was primary)
    if (writeSuccess && submission?.id) {
      try {
        const mongo = await getMongo();
        if (mongo) {
          const doc = {
            _id: submission.id, // Use the same ID for consistency
            moduleId,
            answers: validatedData.answers,
            reflective: validatedData.reflective || undefined,
            domainScores,
            overall,
            avatar,
            lowestDomains: lowestDomains.map((d) => d.toString()),
            createdAt: new Date(),
          };
          await mongo.db.collection("submissions").insertOne(doc);
          console.log("Dual-write to MongoDB successful");
        }
      } catch (dualWriteError) {
        console.error(
          "Dual-write to MongoDB failed (non-critical):",
          dualWriteError
        );
      }
    }

    if (!writeSuccess || !submission) {
      throw new Error("Failed to write submission to any database");
    }

    return NextResponse.json({
      id: submission.id,
      moduleId,
      overall,
      avatar,
      domainScores,
      lowestDomains: lowestDomains.map((d) => d.toString()),
    });
  } catch (error) {
    console.error("Submission error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    // Handle questions.json errors
    if (error instanceof Error && error.message.includes("TBD")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
