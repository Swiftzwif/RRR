#!/usr/bin/env tsx

/**
 * Backfill script to migrate historical data from MongoDB to Supabase
 * 
 * Usage:
 * 1. Set environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE, MONGODB_URI
 * 2. Run: npx tsx scripts/backfill-to-supabase.ts
 * 
 * This script:
 * - Reads all submissions from MongoDB
 * - Reads all leads from MongoDB  
 * - Upserts them into Supabase
 * - Provides progress reporting and error handling
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables
config({ path: '.env.local' });
config();

interface MongoSubmission {
  _id: ObjectId;
  id?: string;
  moduleId: string;
  answers: Record<string, number>;
  reflective?: Record<string, string>;
  domainScores: Record<string, number>;
  overall: number;
  avatar: string;
  lowestDomains: string[];
  createdAt: Date;
}

interface MongoLead {
  _id: ObjectId;
  moduleId: string;
  submissionId: string;
  email: string;
  source: string;
  createdAt: Date;
}

class BackfillService {
  private mongoClient: MongoClient | null = null;
  private supabase: any = null;
  private stats = {
    submissions: { read: 0, written: 0, errors: 0 },
    leads: { read: 0, written: 0, errors: 0 }
  };

  async initialize() {
    console.log('🚀 Initializing backfill service...');

    // Initialize MongoDB
    const mongoUri = process.env.MONGODB_URI;
    const mongoDb = process.env.MONGODB_DB || 'trajectory';
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    this.mongoClient = new MongoClient(mongoUri);
    await this.mongoClient.connect();
    console.log('✅ Connected to MongoDB');

    // Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    console.log('✅ Connected to Supabase');

    // Test Supabase connection
    const { error } = await this.supabase.from('submissions').select('count').limit(1);
    if (error) {
      throw new Error(`Supabase connection test failed: ${error.message}`);
    }
    console.log('✅ Supabase connection verified');
  }

  async backfillSubmissions() {
    console.log('\n📊 Starting submissions backfill...');
    
    const db = this.mongoClient!.db(process.env.MONGODB_DB || 'trajectory');
    const submissions = db.collection('submissions');
    
    const cursor = submissions.find({});
    const batchSize = 100;
    let batch: MongoSubmission[] = [];

    for await (const doc of cursor) {
      batch.push(doc as MongoSubmission);
      this.stats.submissions.read++;

      if (batch.length >= batchSize) {
        await this.processSubmissionBatch(batch);
        batch = [];
      }
    }

    // Process remaining items
    if (batch.length > 0) {
      await this.processSubmissionBatch(batch);
    }

    console.log(`✅ Submissions backfill complete: ${this.stats.submissions.written} written, ${this.stats.submissions.errors} errors`);
  }

  private async processSubmissionBatch(batch: MongoSubmission[]) {
    const supabaseData = batch.map(doc => ({
      id: doc.id || doc._id.toString(),
      module_id: doc.moduleId || 'ktb',
      answers: doc.answers,
      reflective: doc.reflective || null,
      domain_scores: doc.domainScores,
      overall: doc.overall,
      avatar: doc.avatar,
      lowest_domains: doc.lowestDomains || [],
      created_at: doc.createdAt.toISOString()
    }));

    try {
      const { error } = await this.supabase
        .from('submissions')
        .upsert(supabaseData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Batch upsert error:', error);
        this.stats.submissions.errors += batch.length;
      } else {
        this.stats.submissions.written += batch.length;
        console.log(`📝 Processed batch of ${batch.length} submissions`);
      }
    } catch (error) {
      console.error('❌ Batch processing error:', error);
      this.stats.submissions.errors += batch.length;
    }
  }

  async backfillLeads() {
    console.log('\n📧 Starting leads backfill...');
    
    const db = this.mongoClient!.db(process.env.MONGODB_DB || 'trajectory');
    const leads = db.collection('leads');
    
    const cursor = leads.find({});
    const batchSize = 100;
    let batch: MongoLead[] = [];

    for await (const doc of cursor) {
      batch.push(doc as MongoLead);
      this.stats.leads.read++;

      if (batch.length >= batchSize) {
        await this.processLeadBatch(batch);
        batch = [];
      }
    }

    // Process remaining items
    if (batch.length > 0) {
      await this.processLeadBatch(batch);
    }

    console.log(`✅ Leads backfill complete: ${this.stats.leads.written} written, ${this.stats.leads.errors} errors`);
  }

  private async processLeadBatch(batch: MongoLead[]) {
    const supabaseData = batch.map(doc => ({
      submission_id: doc.submissionId,
      module_id: doc.moduleId || 'ktb',
      email: doc.email,
      source: doc.source || 'assessment',
      created_at: doc.createdAt.toISOString()
    }));

    try {
      const { error } = await this.supabase
        .from('leads')
        .upsert(supabaseData, { 
          onConflict: 'submission_id,email',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Lead batch upsert error:', error);
        this.stats.leads.errors += batch.length;
      } else {
        this.stats.leads.written += batch.length;
        console.log(`📝 Processed batch of ${batch.length} leads`);
      }
    } catch (error) {
      console.error('❌ Lead batch processing error:', error);
      this.stats.leads.errors += batch.length;
    }
  }

  async verifyBackfill() {
    console.log('\n🔍 Verifying backfill...');
    
    const db = this.mongoClient!.db(process.env.MONGODB_DB || 'trajectory');
    
    // Count MongoDB documents
    const mongoSubmissions = await db.collection('submissions').countDocuments();
    const mongoLeads = await db.collection('leads').countDocuments();
    
    // Count Supabase documents
    const { count: supabaseSubmissions } = await this.supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true });
    
    const { count: supabaseLeads } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    console.log('\n📊 Verification Results:');
    console.log(`Submissions - MongoDB: ${mongoSubmissions}, Supabase: ${supabaseSubmissions}`);
    console.log(`Leads - MongoDB: ${mongoLeads}, Supabase: ${supabaseLeads}`);
    
    const submissionsMatch = mongoSubmissions === supabaseSubmissions;
    const leadsMatch = mongoLeads === supabaseLeads;
    
    if (submissionsMatch && leadsMatch) {
      console.log('✅ All counts match! Backfill successful.');
    } else {
      console.log('⚠️  Count mismatches detected. Review the data.');
    }
  }

  async cleanup() {
    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log('🔌 MongoDB connection closed');
    }
  }

  printStats() {
    console.log('\n📈 Final Statistics:');
    console.log('Submissions:', this.stats.submissions);
    console.log('Leads:', this.stats.leads);
  }
}

async function main() {
  const backfill = new BackfillService();
  
  try {
    await backfill.initialize();
    await backfill.backfillSubmissions();
    await backfill.backfillLeads();
    await backfill.verifyBackfill();
    backfill.printStats();
    
    console.log('\n🎉 Backfill completed successfully!');
  } catch (error) {
    console.error('💥 Backfill failed:', error);
    process.exit(1);
  } finally {
    await backfill.cleanup();
  }
}

// Run the script
if (require.main === module) {
  main();
}
