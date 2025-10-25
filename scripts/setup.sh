#!/bin/bash

echo "🚀 Trajectory Setup Script"
echo "========================="

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Copy environment template
echo "✅ Copying environment variables..."
cp env.template .env.local

echo ""
echo "📋 Next Steps:"
echo "1. Add your Supabase credentials to .env.local"
echo "2. Verify your domain in Resend dashboard"
echo "3. Deploy to Vercel"
echo ""
echo "🔗 Quick Links:"
echo "- Supabase: https://app.supabase.com"
echo "- Resend: https://resend.com/domains"
echo "- Vercel: https://vercel.com/new"
echo ""
echo "Ready to launch! 🎉"
