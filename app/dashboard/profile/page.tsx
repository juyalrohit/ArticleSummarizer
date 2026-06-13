"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center">
          <h1 className="font-semibold">Profile</h1>
        </div>

        <div className="p-6 max-w-2xl space-y-8">
          {/* Avatar */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AriaC"
                  alt="Aria Chen"
                  size="xl"
                />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-400 transition-colors">
                  <Camera size={12} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Aria Chen</p>
                <p className="text-xs text-muted-foreground mb-3">aria@example.com</p>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                  Change photo
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">First name</label>
                <Input defaultValue="Aria" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Last name</label>
                <Input defaultValue="Chen" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email address</label>
              <Input type="email" defaultValue="aria@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Job title</label>
              <Input defaultValue="Senior Engineer" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bio</label>
              <Textarea
                defaultValue="Full-stack engineer obsessed with performance and developer experience."
                rows={3}
              />
            </div>
          </div>

          {/* Social */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold">Social Links</h2>
            <div className="space-y-4">
              {["Twitter", "GitHub", "LinkedIn", "Website"].map((platform) => (
                <div key={platform}>
                  <label className="text-sm font-medium mb-1.5 block">{platform}</label>
                  <Input placeholder={`Your ${platform} URL`} />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <Button
            variant={saved ? "outline" : "gradient"}
            size="md"
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            <Save size={14} />
            {saved ? "Changes saved!" : "Save changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
