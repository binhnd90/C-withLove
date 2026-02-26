import {
  Heart,
  TrendingUp,
  Wallet,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { projects, getFinancialSummary, donations, expenses } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import StatCard from "@/components/StatCard";
import ProjectCard from "@/components/ProjectCard";

export default function DashboardPage() {
  const summary = getFinancialSummary();
  const recentDonations = [...donations]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tổng Quan</h1>
        <p className="text-muted mt-1">
          Theo dõi tình hình tài chính và tiến độ các dự án từ thiện
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng nhận được"
          value={formatCurrency(summary.totalRaised)}
          icon={Heart}
          color="text-primary"
        />
        <StatCard
          label="Đã chi tiêu"
          value={formatCurrency(summary.totalSpent)}
          icon={Wallet}
          color="text-accent"
        />
        <StatCard
          label="Dự án đang hoạt động"
          value={String(summary.activeProjects)}
          icon={TrendingUp}
          color="text-success"
        />
        <StatCard
          label="Tổng dự án"
          value={String(summary.totalProjects)}
          icon={FolderOpen}
          color="text-muted"
        />
      </div>

      {/* Active projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Dự Án Đang Thực Hiện</h2>
          <Link
            href="/projects"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects
            .filter((p) => p.status === "active")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </section>

      {/* Recent Financial Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-lg mb-4">Đóng Góp Gần Đây</h3>
          <div className="space-y-3">
            {recentDonations.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">
                    {d.donor.anonymous ? "Nhà hảo tâm ẩn danh" : d.donor.name}
                  </p>
                  <p className="text-xs text-muted">
                    {projects.find((p) => p.id === d.projectId)?.name}
                  </p>
                </div>
                <span className="text-sm font-bold text-success">
                  +{formatCurrency(d.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Expenses */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-lg mb-4">Chi Tiêu Gần Đây</h3>
          <div className="space-y-3">
            {recentExpenses.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{e.description}</p>
                  <p className="text-xs text-muted">
                    Duyệt bởi: {e.approvedBy}
                  </p>
                </div>
                <span className="text-sm font-bold text-danger">
                  -{formatCurrency(e.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
