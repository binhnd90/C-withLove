import Link from "next/link";
import { MapPin } from "lucide-react";
import { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import ProgressBar from "./ProgressBar";

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: "Đang thực hiện", className: "bg-primary-light text-primary-dark" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
  planning: { label: "Đang lên kế hoạch", className: "bg-amber-100 text-amber-800" },
};

export default function ProjectCard({ project }: { project: Project }) {
  const status = statusMap[project.status];
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <span className="text-5xl">
          {project.category === "Giáo dục"
            ? "🏫"
            : project.category === "Nước sạch"
            ? "💧"
            : project.category === "Y tế"
            ? "🏥"
            : "📚"}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight">{project.name}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <p className="text-sm text-muted line-clamp-2">{project.description}</p>

        <div className="flex items-center gap-1 text-sm text-muted">
          <MapPin className="w-4 h-4" />
          {project.location}
        </div>

        <ProgressBar percent={project.completionPercent} />

        <div className="flex justify-between text-sm">
          <span className="text-muted">
            Đã nhận:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(project.raised)}
            </span>
          </span>
          <span className="text-muted">
            Mục tiêu:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(project.goal)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
