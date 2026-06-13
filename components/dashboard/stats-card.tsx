import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  color?: "purple" | "blue" | "green" | "orange";
}

const colorMap = {
  purple: {
    icon: "bg-purple-500/15 text-purple-400",
    glow: "hover:shadow-purple-500/10",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-400",
    glow: "hover:shadow-blue-500/10",
  },
  green: {
    icon: "bg-green-500/15 text-green-400",
    glow: "hover:shadow-green-500/10",
  },
  orange: {
    icon: "bg-orange-500/15 text-orange-400",
    glow: "hover:shadow-orange-500/10",
  },
};

export function StatsCard({ title, value, change, positive, icon: Icon, color = "purple" }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className={cn(
      "bg-card border border-border rounded-2xl p-5 hover:border-border/80 hover:shadow-lg transition-all duration-200",
      colors.glow
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.icon)}>
          <Icon size={18} />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-lg",
            positive
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
          )}>
            {positive ? "+" : ""}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
