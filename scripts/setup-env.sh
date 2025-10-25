#!/bin/bash

# ============================================================================
# Trajectory2 Environment Setup Script
# ============================================================================
# This script helps you create your .env.local file with proper configuration
# 
# Usage:
#   chmod +x setup-env.sh
#   ./setup-env.sh
#
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    shift
    echo -e "${color}$@${NC}"
}

print_success() {
    print_color "$GREEN" "✅ $@"
}

print_error() {
    print_color "$RED" "❌ $@"
}

print_warning() {
    print_color "$YELLOW" "⚠️  $@"
}

print_info() {
    print_color "$BLUE" "ℹ️  $@"
}

print_header() {
    echo ""
    print_color "$BLUE" "════════════════════════════════════════════════════════════"
    print_color "$BLUE" "  $@"
    print_color "$BLUE" "════════════════════════════════════════════════════════════"
    echo ""
}

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local value
    
    if [ -n "$default" ]; then
        read -p "$(print_info "$prompt") [default: $default]: " value
        echo "${value:-$default}"
    else
        read -p "$(print_info "$prompt"): " value
        echo "$value"
    fi
}

# Function to prompt for secret input
prompt_secret() {
    local prompt="$1"
    local value
    
    read -s -p "$(print_info "$prompt"): " value
    echo ""
    echo "$value"
}

# Function to check if .env.local already exists
check_existing_env() {
    if [ -f ".env.local" ]; then
        print_warning ".env.local already exists!"
        echo "Options:"
        echo "  1) Backup and create new"
        echo "  2) Update existing (merge)"
        echo "  3) Cancel"
        read -p "Choose option [1-3]: " choice
        
        case $choice in
            1)
                backup_file=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
                mv .env.local "$backup_file"
                print_success "Backed up existing .env.local to $backup_file"
                return 0
                ;;
            2)
                print_info "Update mode - existing values will be preserved"
                return 1
                ;;
            3)
                print_info "Setup cancelled"
                exit 0
                ;;
            *)
                print_error "Invalid option"
                exit 1
                ;;
        esac
    fi
    return 0
}

# Function to validate URL format
validate_url() {
    local url="$1"
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate email format
validate_email() {
    local email="$1"
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Main setup function
main() {
    clear
    print_header "🚀 Trajectory2 Environment Setup"
    
    print_info "This script will help you create your .env.local file"
    print_info "You'll need:"
    print_info "  - Supabase project credentials"
    print_info "  - Resend API key"
    print_info "  - (Optional) Square payment credentials"
    echo ""
    read -p "Press Enter to continue..."
    
    # Check for existing .env.local
    create_new=true
    check_existing_env || create_new=false
    
    # Initialize env file
    if [ "$create_new" = true ]; then
        cp env.template .env.local
        print_success "Created .env.local from template"
    fi
    
    # Supabase Configuration
    print_header "📦 Supabase Configuration"
    print_info "Get these from: https://supabase.com/dashboard/project/_/settings/api"
    echo ""
    
    supabase_url=$(prompt_with_default "Supabase Project URL" "https://xxxxx.supabase.co")
    while ! validate_url "$supabase_url"; do
        print_error "Invalid URL format. Must start with http:// or https://"
        supabase_url=$(prompt_with_default "Supabase Project URL" "https://xxxxx.supabase.co")
    done
    
    supabase_anon=$(prompt_secret "Supabase Anon Key (starts with eyJ)")
    
    supabase_service=$(prompt_secret "Supabase Service Role Key (starts with eyJ)")
    
    # Update .env.local with Supabase values
    sed -i.bak "s|TODO_https://your-project.supabase.co|$supabase_url|g" .env.local
    sed -i.bak "s|TODO_eyJ...your-anon-key|$supabase_anon|g" .env.local
    sed -i.bak "s|TODO_eyJ...your-service-role-key|$supabase_service|g" .env.local
    
    print_success "Supabase configuration saved"
    
    # Resend Configuration
    print_header "📧 Resend Email Configuration"
    print_info "Get your API key from: https://resend.com/api-keys"
    echo ""
    
    resend_key=$(prompt_secret "Resend API Key (starts with re_)")
    
    from_name=$(prompt_with_default "From Name" "Trajectory")
    from_email=$(prompt_with_default "From Email" "hello@your-domain.com")
    while ! validate_email "$from_email"; do
        print_error "Invalid email format"
        from_email=$(prompt_with_default "From Email" "hello@your-domain.com")
    done
    
    resend_from="$from_name <$from_email>"
    
    # Update .env.local with Resend values
    sed -i.bak "s|TODO_re_your_resend_api_key|$resend_key|g" .env.local
    sed -i.bak "s|TODO_Trajectory <hello@your-domain.com>|$resend_from|g" .env.local
    
    print_success "Resend configuration saved"
    
    # App URL Configuration
    print_header "🌐 Application URL"
    echo ""
    
    app_url=$(prompt_with_default "App URL" "http://localhost:3003")
    while ! validate_url "$app_url"; do
        print_error "Invalid URL format. Must start with http:// or https://"
        app_url=$(prompt_with_default "App URL" "http://localhost:3003")
    done
    
    # Update .env.local with App URL
    sed -i.bak "s|TODO_http://localhost:3003|$app_url|g" .env.local
    
    print_success "App URL configuration saved"
    
    # Square Configuration (Optional)
    print_header "💳 Square Payments (Optional)"
    print_info "Skip this if you're not ready to set up payments yet"
    echo ""
    
    read -p "Do you want to configure Square payments now? [y/N]: " setup_square
    
    if [[ $setup_square =~ ^[Yy]$ ]]; then
        print_info "Get these from: https://developer.squareup.com/apps"
        echo ""
        
        square_token=$(prompt_secret "Square Access Token")
        square_location=$(prompt_with_default "Square Location ID" "")
        square_env=$(prompt_with_default "Square Environment (sandbox/production)" "sandbox")
        square_webhook=$(prompt_secret "Square Webhook Signature Key (optional)")
        
        # Uncomment Square lines in .env.local
        sed -i.bak "s|# SQUARE_ACCESS_TOKEN=TODO_your_square_access_token|SQUARE_ACCESS_TOKEN=$square_token|g" .env.local
        sed -i.bak "s|# SQUARE_LOCATION_ID=TODO_your_square_location_id|SQUARE_LOCATION_ID=$square_location|g" .env.local
        sed -i.bak "s|# SQUARE_ENVIRONMENT=sandbox|SQUARE_ENVIRONMENT=$square_env|g" .env.local
        
        if [ -n "$square_webhook" ]; then
            sed -i.bak "s|# SQUARE_WEBHOOK_SIGNATURE_KEY=TODO_your_webhook_signature_key|SQUARE_WEBHOOK_SIGNATURE_KEY=$square_webhook|g" .env.local
        fi
        
        print_success "Square configuration saved"
    else
        print_info "Skipped Square configuration (you can add it later)"
    fi
    
    # Clean up backup files
    rm -f .env.local.bak
    
    # Final verification
    print_header "✅ Setup Complete!"
    echo ""
    print_success ".env.local has been created successfully!"
    echo ""
    print_info "Next steps:"
    echo "  1. Review .env.local to ensure all values are correct"
    echo "  2. Set up your Supabase database (see SUPABASE_BACKEND_SETUP.md)"
    echo "  3. Run 'npm run dev' to start the development server"
    echo "  4. Visit $app_url to test your setup"
    echo ""
    print_warning "IMPORTANT: Never commit .env.local to git!"
    print_info ".env.local is already in .gitignore"
    echo ""
    
    read -p "Do you want to view the created .env.local file? [y/N]: " view_file
    if [[ $view_file =~ ^[Yy]$ ]]; then
        echo ""
        print_header "📄 .env.local Contents"
        cat .env.local
    fi
    
    echo ""
    print_success "🎉 You're all set! Happy coding!"
    echo ""
}

# Run main function
main
