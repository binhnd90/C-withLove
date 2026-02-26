import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status === "active");
  const completed = projects.filter((p) => p.status === "completed");
  const planning = projects.filter((p) => p.status === "planning");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tất Cả Dự Án</h1>
        <p className="text-muted mt-1">
          Danh sách đầy đủ các dự án từ thiện - tất cả đều công khai
        </p>
      </div>

      {active.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Đang Thực Hiện ({active.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {planning.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Đang Lên Kế Hoạch ({planning.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {planning.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Đã Hoàn Thành ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completed.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
