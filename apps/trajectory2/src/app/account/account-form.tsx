'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from '@supabase/supabase-js'
import { AnimatedDiv } from '@/components/animation/AnimatedComponents'
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";

export default function AccountForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    // Create a form and submit it
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Profile Information */}
      <Card className="bg-elev-2 border-[var(--border-default)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-primary">Profile Information</CardTitle>
              <CardDescription className="text-secondary">
                Your account details and preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <Input
              type="email"
              value={user.email || ''}
              disabled
              className="bg-elev-1 text-white border-[var(--border-default)]"
            />
            <p className="text-xs text-muted">
              Your email address is verified and cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Member Since
            </label>
            <Input
              type="text"
              value={new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              disabled
              className="bg-elev-1 text-white border-[var(--border-default)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Premium Access */}
      <Card className="bg-elev-2 border-[var(--border-gold)]">
        <CardHeader>
          <CardTitle className="text-primary">Premium Access</CardTitle>
          <CardDescription className="text-secondary">
            Your current membership status
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="p-4 bg-elev-1 rounded-lg border border-[var(--border-default)]">
            <p className="text-secondary">
              Access to days 1-7 of the transformation experience
            </p>
            <p className="text-sm text-muted mt-2">
              Schedule a meeting with Jean to unlock all 31 days
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-elev-2 border-[var(--border-default)]">
        <CardHeader>
          <CardTitle className="text-primary">Account Actions</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </CardContent>
      </Card>
    </AnimatedDiv>
  )
}
