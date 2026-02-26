"use client";

import { useState } from "react";
import {
  Shield,
  Upload,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Users,
} from "lucide-react";
import { fieldWorkers, fieldReports, projects } from "@/lib/data";
import { formatDate, formatCurrency } from "@/lib/format";
import type { UserRole, FieldReport } from "@/lib/types";

const roleLabels: Record<UserRole, { label: string; className: string }> = {
  admin: { label: "Quản trị viên", className: "bg-purple-100 text-purple-800" },
  field_worker: {
    label: "Cộng tác viên",
    className: "bg-blue-100 text-blue-800",
  },
  auditor: {
    label: "Kiểm toán viên",
    className: "bg-amber-100 text-amber-800",
  },
  public: { label: "Công khai", className: "bg-gray-100 text-gray-800" },
};

const reportStatusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle; className: string }
> = {
  submitted: {
    label: "Đã gửi",
    icon: Clock,
    className: "text-amber-600",
  },
  reviewed: {
    label: "Đã xem xét",
    icon: Eye,
    className: "text-blue-600",
  },
  approved: {
    label: "Đã duyệt",
    icon: CheckCircle,
    className: "text-green-600",
  },
};

const reportTypeConfig: Record<
  string,
  { label: string; icon: typeof Camera; className: string }
> = {
  progress: {
    label: "Tiến độ",
    icon: Camera,
    className: "bg-primary-light text-primary-dark",
  },
  invoice: {
    label: "Hóa đơn",
    icon: FileText,
    className: "bg-amber-100 text-amber-800",
  },
  issue: {
    label: "Sự cố",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-800",
  },
};

export default function PortalPage() {
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newReport, setNewReport] = useState({
    projectId: "",
    type: "progress" as "progress" | "invoice" | "issue",
    title: "",
    description: "",
    invoiceAmount: "",
  });

  const currentWorker = selectedWorker
    ? fieldWorkers.find((w) => w.id === selectedWorker)
    : null;

  const visibleReports: FieldReport[] = currentWorker
    ? currentWorker.role === "auditor"
      ? fieldReports
      : fieldReports.filter((r) => r.workerId === currentWorker.id)
    : [];

  const assignedProjects = currentWorker
    ? projects.filter((p) =>
        currentWorker.assignedProjects.includes(p.id)
      )
    : [];

  function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    setShowUploadForm(false);
    setNewReport({
      projectId: "",
      type: "progress",
      title: "",
      description: "",
      invoiceAmount: "",
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Cổng Cộng Tác Viên
        </h1>
        <p className="text-muted mt-1">
          Giao diện chuyên biệt cho cộng tác viên hiện trường - tải lên hình
          ảnh, số hóa hóa đơn và báo cáo tiến độ
        </p>
      </div>

      {/* Worker Selection (simulated login) */}
      {!selectedWorker ? (
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Chọn Tài Khoản
          </h2>
          <p className="text-sm text-muted mb-4">
            Chọn tài khoản để truy cập cổng cộng tác viên (mô phỏng đăng nhập)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fieldWorkers.map((worker) => {
              const role = roleLabels[worker.role];
              return (
                <button
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker.id)}
                  className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-light/30 transition-colors"
                >
                  <p className="font-semibold">{worker.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${role.className}`}
                  >
                    {role.label}
                  </span>
                  <p className="text-xs text-muted mt-2">
                    Dự án:{" "}
                    {worker.assignedProjects
                      .map(
                        (pid) =>
                          projects.find((p) => p.id === pid)?.name || pid
                      )
                      .join(", ")}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Role Permissions Table */}
          <div className="mt-8">
            <h3 className="font-semibold text-sm mb-3">Phân Quyền Theo Vai Trò</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="pb-2 pr-4">Quyền hạn</th>
                    <th className="pb-2 pr-4 text-center">Quản trị</th>
                    <th className="pb-2 pr-4 text-center">CTV Hiện trường</th>
                    <th className="pb-2 pr-4 text-center">Kiểm toán</th>
                    <th className="pb-2 text-center">Công khai</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    ["Xem dữ liệu dự án", true, true, true, true],
                    ["Tải ảnh tiến độ", true, true, false, false],
                    ["Số hóa hóa đơn", true, true, false, false],
                    ["Báo cáo sự cố", true, true, false, false],
                    ["Duyệt báo cáo", true, false, true, false],
                    ["Xem tất cả báo cáo", true, false, true, false],
                    ["Quản lý tài khoản", true, false, false, false],
                  ].map(([permission, admin, field, auditor, pub], i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-2 pr-4 font-medium">
                        {permission as string}
                      </td>
                      {[admin, field, auditor, pub].map((allowed, j) => (
                        <td key={j} className="py-2 pr-4 text-center">
                          {allowed ? (
                            <span className="text-success">&#10003;</span>
                          ) : (
                            <span className="text-muted">&#10005;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Worker Dashboard */}
          <div className="bg-card rounded-xl border border-border p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Đăng nhập với tư cách</p>
              <p className="font-bold text-lg">{currentWorker?.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  roleLabels[currentWorker?.role || "public"].className
                }`}
              >
                {roleLabels[currentWorker?.role || "public"].label}
              </span>
            </div>
            <div className="flex gap-2">
              {(currentWorker?.role === "field_worker" ||
                currentWorker?.role === "admin") && (
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  <Upload className="w-4 h-4" />
                  Tải lên báo cáo
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedWorker(null);
                  setShowUploadForm(false);
                }}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
              >
                Đổi tài khoản
              </button>
            </div>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <form
              onSubmit={handleSubmitReport}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">Tạo Báo Cáo Mới</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dự án
                  </label>
                  <select
                    required
                    value={newReport.projectId}
                    onChange={(e) =>
                      setNewReport({ ...newReport, projectId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Chọn dự án</option>
                    {assignedProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Loại báo cáo
                  </label>
                  <select
                    required
                    value={newReport.type}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        type: e.target.value as "progress" | "invoice" | "issue",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="progress">Cập nhật tiến độ</option>
                    <option value="invoice">Số hóa hóa đơn</option>
                    <option value="issue">Báo cáo sự cố</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    required
                    value={newReport.title}
                    onChange={(e) =>
                      setNewReport({ ...newReport, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                {newReport.type === "invoice" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Số tiền hóa đơn (VND)
                    </label>
                    <input
                      type="number"
                      value={newReport.invoiceAmount}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          invoiceAmount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Mô tả
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReport.description}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Tải ảnh lên
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-light/10">
                    <Camera className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">
                      Kéo thả hoặc nhấn để chọn ảnh
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Hỗ trợ JPG, PNG. Tối đa 10MB/ảnh
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  Gửi báo cáo
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Assigned Projects */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-lg mb-4">
              Dự Án Được Phân Công ({assignedProjects.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentWorker?.role === "auditor"
                ? projects
                : assignedProjects
              ).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-lg border border-border"
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted mt-1">{p.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          p.completionPercent === 100
                            ? "bg-success"
                            : "bg-primary"
                        }`}
                        style={{ width: `${p.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">
                      {p.completionPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reports */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-lg mb-4">
              Báo Cáo ({visibleReports.length})
            </h2>
            {visibleReports.length === 0 ? (
              <p className="text-sm text-muted">Chưa có báo cáo nào.</p>
            ) : (
              <div className="space-y-3">
                {visibleReports.map((report) => {
                  const typeConf = reportTypeConfig[report.type];
                  const statusConf = reportStatusConfig[report.status];
                  const StatusIcon = statusConf.icon;
                  const project = projects.find(
                    (p) => p.id === report.projectId
                  );
                  const worker = fieldWorkers.find(
                    (w) => w.id === report.workerId
                  );

                  return (
                    <div
                      key={report.id}
                      className="flex flex-col sm:flex-row gap-4 py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${typeConf.className}`}
                          >
                            {typeConf.label}
                          </span>
                          <span className="text-xs text-muted">
                            {project?.name}
                          </span>
                          <span className="text-xs text-muted">
                            &middot; {formatDate(report.date)}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{report.title}</p>
                        <p className="text-xs text-muted">
                          {report.description}
                        </p>
                        {report.invoiceAmount && (
                          <p className="text-xs font-semibold text-accent">
                            Số tiền: {formatCurrency(report.invoiceAmount)}
                          </p>
                        )}
                        <p className="text-xs text-muted">
                          Người gửi: {worker?.name} &middot;{" "}
                          {report.imageUrls.length} ảnh đính kèm
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusIcon
                          className={`w-4 h-4 ${statusConf.className}`}
                        />
                        <span
                          className={`text-xs font-medium ${statusConf.className}`}
                        >
                          {statusConf.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
