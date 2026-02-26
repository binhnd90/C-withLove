import {
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { anomalyAlerts, aiSuggestions, projects, expenses } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AlertSeverity } from "@/lib/types";

const severityConfig: Record<
  AlertSeverity,
  { label: string; className: string; bgClass: string }
> = {
  low: {
    label: "Thấp",
    className: "text-blue-800",
    bgClass: "bg-blue-50 border-blue-200",
  },
  medium: {
    label: "Trung bình",
    className: "text-amber-800",
    bgClass: "bg-amber-50 border-amber-200",
  },
  high: {
    label: "Cao",
    className: "text-orange-800",
    bgClass: "bg-orange-50 border-orange-200",
  },
  critical: {
    label: "Nghiêm trọng",
    className: "text-red-800",
    bgClass: "bg-red-50 border-red-200",
  },
};

const typeLabels: Record<string, string> = {
  price_anomaly: "Giá bất thường",
  spending_pattern: "Mẫu chi tiêu",
  timeline_delay: "Chậm tiến độ",
  efficiency: "Hiệu suất",
};

export default function AnomaliesPage() {
  const activeAlerts = anomalyAlerts.filter((a) => !a.dismissed);
  const totalPotentialSaving = aiSuggestions.reduce(
    (sum, s) => sum + s.potentialSaving,
    0
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          AI Phân Tích & Cảnh Báo
        </h1>
        <p className="text-muted mt-1">
          Hệ thống AI tự động phát hiện chi phí bất thường và đề xuất tối ưu
          hóa hiệu quả dự án
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-100 text-red-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted">Cảnh báo đang hoạt động</p>
            <p className="text-xl font-bold">{activeAlerts.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted">Đề xuất AI</p>
            <p className="text-xl font-bold">{aiSuggestions.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 text-green-700">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted">Tiết kiệm tiềm năng</p>
            <p className="text-xl font-bold text-success">
              {formatCurrency(totalPotentialSaving)}
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly Alerts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger" />
          Cảnh Báo Bất Thường ({activeAlerts.length})
        </h2>
        {activeAlerts.map((alert) => {
          const sev = severityConfig[alert.severity];
          const project = projects.find((p) => p.id === alert.projectId);
          const expense = alert.relatedExpenseId
            ? expenses.find((e) => e.id === alert.relatedExpenseId)
            : null;

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-5 ${sev.bgClass}`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sev.className} ${sev.bgClass}`}
                    >
                      {sev.label}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {typeLabels[alert.type]}
                    </span>
                    <Link
                      href={`/projects/${alert.projectId}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {project?.name}
                    </Link>
                    <span className="text-xs text-muted">
                      {formatDate(alert.detectedDate)}
                    </span>
                  </div>
                  <h3 className="font-bold">{alert.title}</h3>
                  <p className="text-sm text-muted">{alert.description}</p>

                  {alert.marketReference && alert.actualAmount && (
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        Giá thực tế:{" "}
                        <strong className="text-danger">
                          {formatCurrency(alert.actualAmount)}
                        </strong>
                      </span>
                      <span>
                        Giá thị trường:{" "}
                        <strong className="text-success">
                          {formatCurrency(alert.marketReference)}
                        </strong>
                      </span>
                      <span>
                        Chênh lệch:{" "}
                        <strong className="text-danger">
                          {formatCurrency(
                            alert.actualAmount - alert.marketReference
                          )}{" "}
                          (
                          {Math.round(
                            ((alert.actualAmount - alert.marketReference) /
                              alert.marketReference) *
                              100
                          )}
                          %)
                        </strong>
                      </span>
                    </div>
                  )}

                  {expense && (
                    <p className="text-xs text-muted">
                      Khoản chi liên quan: {expense.description} ({expense.id})
                    </p>
                  )}
                </div>
                <div className="lg:w-80 bg-white/50 rounded-lg p-4 border border-white/80">
                  <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Đề xuất xử lý:
                  </p>
                  <p className="text-sm text-muted">{alert.suggestion}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* AI Suggestions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Đề Xuất Tối Ưu Hóa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiSuggestions.map((suggestion) => {
            const project = projects.find(
              (p) => p.id === suggestion.projectId
            );
            return (
              <div
                key={suggestion.id}
                className="bg-card rounded-xl border border-border p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {suggestion.category}
                  </span>
                  <span className="text-xs text-muted">
                    {formatDate(suggestion.createdDate)}
                  </span>
                </div>
                <h3 className="font-semibold">{suggestion.title}</h3>
                <p className="text-sm text-muted">{suggestion.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm">
                    Tiết kiệm:{" "}
                    <strong className="text-success">
                      {formatCurrency(suggestion.potentialSaving)}
                    </strong>
                  </span>
                  <Link
                    href={`/projects/${suggestion.projectId}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {project?.name} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How AI Works */}
      <section className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-bold text-lg mb-4">Cơ Chế Phân Tích AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-1">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
              1
            </div>
            <h3 className="font-semibold">Thu thập dữ liệu</h3>
            <p className="text-muted">
              AI liên tục thu thập giá thị trường, dữ liệu chi tiêu và tiến độ
              từ tất cả dự án.
            </p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
              2
            </div>
            <h3 className="font-semibold">So sánh & phân tích</h3>
            <p className="text-muted">
              So sánh giá thực tế với giá tham chiếu, phát hiện bất thường
              trong mẫu chi tiêu.
            </p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
              3
            </div>
            <h3 className="font-semibold">Cảnh báo tự động</h3>
            <p className="text-muted">
              Tạo cảnh báo khi phát hiện chênh lệch vượt ngưỡng, xếp hạng mức
              độ nghiêm trọng.
            </p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
              4
            </div>
            <h3 className="font-semibold">Đề xuất giải pháp</h3>
            <p className="text-muted">
              Đưa ra gợi ý cụ thể để tối ưu chi phí và nâng cao hiệu quả dự
              án.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
