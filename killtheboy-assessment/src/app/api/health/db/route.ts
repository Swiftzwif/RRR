import { NextResponse } from 'next/server';
import { closeMongo, getMongo } from '../../../../lib/mongo';
import { getSupabaseServiceRole } from '../../../../lib/supabase';

export async function GET() {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    databases: {
      supabase: { status: 'unknown', message: '' },
      mongodb: { status: 'unknown', message: '' }
    }
  };

  // Test Supabase connection
  try {
    const sb = getSupabaseServiceRole();
    if (sb) {
      const { data, error } = await sb.from('submissions').select('count').limit(1);
      if (error) {
        healthStatus.databases.supabase = { 
          status: 'error', 
          message: `Supabase query failed: ${error.message}` 
        };
      } else {
        healthStatus.databases.supabase = { 
          status: 'healthy', 
          message: 'Supabase connection and query successful' 
        };
      }
    } else {
      healthStatus.databases.supabase = { 
        status: 'error', 
        message: 'Supabase not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE)' 
      };
    }
  } catch (error) {
    healthStatus.databases.supabase = { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown Supabase error' 
    };
  }

  // Test MongoDB connection
  try {
    const mongo = await getMongo();
    
    if (!mongo) {
      healthStatus.databases.mongodb = { 
        status: 'error', 
        message: 'MongoDB connection failed' 
      };
    } else {
      const { client, db } = mongo;
      
      // Test a simple operation
      const collections = await db.listCollections().toArray();
      
      healthStatus.databases.mongodb = {
        status: 'healthy',
        message: `Connected to ${db.databaseName}, ${collections.length} collections`
      };
    }
  } catch (error) {
    healthStatus.databases.mongodb = { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown MongoDB error' 
    };
  } finally {
    await closeMongo();
  }

  // Determine overall status
  const hasHealthyDb = Object.values(healthStatus.databases).some(db => db.status === 'healthy');
  const overallStatus = hasHealthyDb ? 'healthy' : 'error';

  return NextResponse.json({
    status: overallStatus,
    ...healthStatus
  }, { 
    status: overallStatus === 'healthy' ? 200 : 500 
  });
}
