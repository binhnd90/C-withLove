import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
}: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-primary-light ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="text-xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}
