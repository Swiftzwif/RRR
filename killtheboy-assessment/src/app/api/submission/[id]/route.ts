import { getMongo } from "@/lib/mongo";
import { getSupabaseServiceRole } from "@/lib/supabase";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let submission: any = null;

    // Primary read: Supabase
    try {
      const sb = getSupabaseServiceRole();
      if (sb) {
        const { data, error } = await sb
          .from("submissions")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          // Transform Supabase data to match expected format
          submission = {
            id: data.id,
            moduleId: data.module_id,
            answers: data.answers,
            reflective: data.reflective,
            domainScores: data.domain_scores,
            overall: data.overall,
            avatar: data.avatar,
            lowestDomains: data.lowest_domains,
            createdAt: data.created_at,
          };
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
          let query: any = { id };
          try {
            query = { _id: new ObjectId(id) };
          } catch {}
          submission = await mongo.db.collection("submissions").findOne(query);

          if (submission) {
            submission.id = submission._id?.toString?.() || submission.id;
            console.log("Found submission in MongoDB fallback:", submission.id);
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

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Fetch submission error:", error);

    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
