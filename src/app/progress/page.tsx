import { CalendarClock, Filter } from "lucide-react";
import { progressEntries, projects } from "@/lib/data";
import { formatDate, formatPercent } from "@/lib/format";
import Link from "next/link";

export default function ProgressPage() {
  const allProgress = [...progressEntries].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  // Group by date
  const grouped = allProgress.reduce<Record<string, typeof allProgress>>(
    (acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    },
    {}
  );

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tiến Độ Hàng Ngày</h1>
        <p className="text-muted mt-1">
          Cập nhật tiến độ thực hiện các dự án theo thời gian thực
        </p>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-5 flex flex-wrap gap-6">
        <div className="flex items-center gap-3">
          <CalendarClock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted">Tổng cập nhật</p>
            <p className="text-xl font-bold">{allProgress.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted">Dự án đang cập nhật</p>
            <p className="text-xl font-bold">
              {new Set(allProgress.map((e) => e.projectId)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {dates.map((date) => (
          <section key={date}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <h2 className="text-lg font-bold">{formatDate(date)}</h2>
            </div>

            <div className="ml-1.5 border-l-2 border-border pl-6 space-y-4">
              {grouped[date].map((entry) => {
                const project = projects.find(
                  (p) => p.id === entry.projectId
                );
                return (
                  <div
                    key={entry.id}
                    className="bg-card rounded-xl border border-border p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/projects/${entry.projectId}`}
                            className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full hover:underline"
                          >
                            {project?.name}
                          </Link>
                          <span className="text-xs text-muted">
                            Hoàn thành:{" "}
                            <strong>
                              {formatPercent(entry.completionPercent)}
                            </strong>
                          </span>
                        </div>
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-sm text-muted">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            entry.completionPercent === 100
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          style={{
                            width: `${entry.completionPercent}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted font-mono">
                        {entry.completionPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
