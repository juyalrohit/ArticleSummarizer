"use client";

import { useState } from "react";
import { Bell, Lock, Globe, Trash2 } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        enabled ? "bg-purple-500" : "bg-secondary"
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, browser: false, weekly: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showEmail: false });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center">
          <h1 className="font-semibold">Settings</h1>
        </div>

        <div className="p-6 max-w-2xl space-y-6">
          {/* Notifications */}
          <SettingsSection title="Notifications">
            <div className="space-y-4 divide-y divide-border">
              <SettingRow label="Email notifications" description="Receive updates about your articles via email">
                <Toggle enabled={notifications.email} onToggle={() => setNotifications(n => ({ ...n, email: !n.email }))} />
              </SettingRow>
              <div className="pt-4">
                <SettingRow label="Browser notifications" description="Real-time alerts in your browser">
                  <Toggle enabled={notifications.browser} onToggle={() => setNotifications(n => ({ ...n, browser: !n.browser }))} />
                </SettingRow>
              </div>
              <div className="pt-4">
                <SettingRow label="Weekly digest" description="A summary of trending articles every Monday">
                  <Toggle enabled={notifications.weekly} onToggle={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))} />
                </SettingRow>
              </div>
            </div>
          </SettingsSection>

          {/* Privacy */}
          <SettingsSection title="Privacy">
            <div className="space-y-4 divide-y divide-border">
              <SettingRow label="Public profile" description="Allow others to find and view your profile">
                <Toggle enabled={privacy.publicProfile} onToggle={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))} />
              </SettingRow>
              <div className="pt-4">
                <SettingRow label="Show email publicly" description="Display your email on your public profile">
                  <Toggle enabled={privacy.showEmail} onToggle={() => setPrivacy(p => ({ ...p, showEmail: !p.showEmail }))} />
                </SettingRow>
              </div>
            </div>
          </SettingsSection>

          {/* Security */}
          <SettingsSection title="Security">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Current password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">New password</label>
                <Input type="password" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Confirm new password</label>
                <Input type="password" placeholder="Repeat new password" />
              </div>
              <Button variant="outline" size="sm">
                <Lock size={13} />
                Update password
              </Button>
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently remove your account and all data. This cannot be undone.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/20 transition-colors shrink-0">
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
