"use client";

import { useState } from "react";
import { Search, UserPlus, MoreHorizontal, Shield, Ban } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { authors } from "@/lib/data";

const extendedUsers = [
  ...authors,
  { id: "6", name: "James Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesP", role: "Writer", bio: "" },
  { id: "7", name: "Elena Vasquez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaV", role: "Editor", bio: "" },
  { id: "8", name: "Kai Tanaka", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KaiT", role: "Researcher", bio: "" },
];

const userRoles: Record<string, "admin" | "user" | "banned"> = {
  "1": "user",
  "2": "user",
  "3": "admin",
  "4": "user",
  "5": "user",
  "6": "user",
  "7": "user",
  "8": "banned",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = extendedUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <h1 className="font-semibold">Users</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
            <UserPlus size={14} />
            Invite User
          </button>
        </div>

        <div className="p-6 space-y-6 max-w-6xl">
          {/* Search + stats */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span><span className="font-medium text-foreground">{extendedUsers.length}</span> total</span>
              <span><span className="font-medium text-green-400">7</span> active</span>
              <span><span className="font-medium text-red-400">1</span> banned</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Articles</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => {
                  const status = userRoles[user.id] ?? "user";
                  return (
                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} alt={user.name} size="sm" />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.name.toLowerCase().replace(" ", ".")}@example.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">{user.role}</td>
                      <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground">{Math.floor(Math.random() * 15 + 1)}</td>
                      <td className="px-5 py-4">
                        <Badge variant={status === "admin" ? "purple" : status === "banned" ? "red" : "green"}>
                          {status === "admin" ? "Admin" : status === "banned" ? "Banned" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Make admin">
                            <Shield size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" title="Ban user">
                            <Ban size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
