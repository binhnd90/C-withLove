import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Receipt,
  TrendingUp,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  getProject,
  getDonationsByProject,
  getExpensesByProject,
  getInvoicesByProject,
  getProgressByProject,
  getBidDocument,
  getAnomalyAlertsByProject,
} from "@/lib/data";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import ProgressBar from "@/components/ProgressBar";
import QRCodeSection from "./QRCodeSection";
import ExportButton from "@/components/ExportButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusMap: Record<string, { label: string; className: string }> = {
  active: {
    label: "Đang thực hiện",
    className: "bg-primary-light text-primary-dark",
  },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
  planning: {
    label: "Đang lên kế hoạch",
    className: "bg-amber-100 text-amber-800",
  },
};

const invoiceStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-amber-100 text-amber-800" },
  verified: { label: "Đã xác minh", className: "bg-blue-100 text-blue-800" },
  paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
};

const severityColors: Record<string, string> = {
  low: "border-blue-300 bg-blue-50",
  medium: "border-amber-300 bg-amber-50",
  high: "border-orange-300 bg-orange-50",
  critical: "border-red-300 bg-red-50",
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const donations = getDonationsByProject(id);
  const expenses = getExpensesByProject(id);
  const invoices = getInvoicesByProject(id);
  const progress = getProgressByProject(id);
  const bid = getBidDocument(id);
  const alerts = getAnomalyAlertsByProject(id).filter((a) => !a.dismissed);
  const status = statusMap[project.status];

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-muted">{project.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatDate(project.startDate)}
                {project.endDate && ` - ${formatDate(project.endDate)}`}
              </span>
            </div>
            <ProgressBar percent={project.completionPercent} height="h-3" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                Tiến độ:{" "}
                <strong>{formatPercent(project.completionPercent)}</strong>
              </p>
              <ExportButton
                projectId={project.id}
                projectName={project.name}
              />
            </div>
          </div>
          <QRCodeSection projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* AI Alerts for this project */}
      {alerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            Cảnh Báo AI ({alerts.length})
          </h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${severityColors[alert.severity]}`}
            >
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-xs text-muted mt-1">{alert.suggestion}</p>
              {alert.marketReference && alert.actualAmount && (
                <p className="text-xs mt-1">
                  Thực tế:{" "}
                  <strong className="text-danger">
                    {formatCurrency(alert.actualAmount)}
                  </strong>{" "}
                  vs Thị trường:{" "}
                  <strong className="text-success">
                    {formatCurrency(alert.marketReference)}
                  </strong>
                </p>
              )}
            </div>
          ))}
          <Link
            href="/anomalies"
            className="text-xs text-primary hover:underline"
          >
            Xem tất cả cảnh báo AI &rarr;
          </Link>
        </section>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-sm text-muted">Mục tiêu</p>
          <p className="text-xl font-bold mt-1">
            {formatCurrency(project.goal)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-success" /> Đã nhận
          </p>
          <p className="text-xl font-bold text-success mt-1">
            {formatCurrency(totalDonations)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-1">
            <Receipt className="w-4 h-4 text-accent" /> Đã chi
          </p>
          <p className="text-xl font-bold text-accent mt-1">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Bid Document / Bill of Quantities */}
      {bid && (
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Hồ Sơ Dự Toán (Bill of Quantities)
          </h2>
          <p className="text-xs text-muted mb-4">
            Dự toán chi tiết hạng mục - công khai để cộng đồng phản biện trước
            khi triển khai
            {bid.approvedDate &&
              ` | Phê duyệt: ${formatDate(bid.approvedDate)}`}
            {bid.publicReviewDeadline &&
              ` | Hạn phản biện: ${formatDate(bid.publicReviewDeadline)}`}
          </p>

          {/* Technical Standards */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">
              Tiêu chuẩn kỹ thuật áp dụng
            </h3>
            <ul className="space-y-1">
              {bid.technicalStandards.map((std, i) => (
                <li key={i} className="text-xs text-muted flex gap-2">
                  <span className="text-primary shrink-0">&#8226;</span>
                  {std}
                </li>
              ))}
            </ul>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2 pr-3">#</th>
                  <th className="pb-2 pr-3">Hạng mục</th>
                  <th className="pb-2 pr-3">Quy cách</th>
                  <th className="pb-2 pr-3 text-right">SL</th>
                  <th className="pb-2 pr-3">ĐVT</th>
                  <th className="pb-2 pr-3 text-right">Đơn giá</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {bid.items.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 pr-3 text-muted text-xs">{i + 1}</td>
                    <td className="py-2 pr-3 font-medium">{item.name}</td>
                    <td className="py-2 pr-3 text-xs text-muted max-w-[200px]">
                      {item.specification}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-xs">{item.unit}</td>
                    <td className="py-2 pr-3 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td colSpan={6} className="py-2 pr-3 text-right">
                    Tổng dự toán:
                  </td>
                  <td className="py-2 text-right">
                    {formatCurrency(bid.totalEstimate)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Nguồn Thu (
            {donations.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {donations.length === 0 ? (
              <p className="text-sm text-muted">Chưa có đóng góp nào.</p>
            ) : (
              donations.map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-start py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {d.donor.anonymous
                        ? "Nhà hảo tâm ẩn danh"
                        : d.donor.name}
                    </p>
                    <p className="text-xs text-muted">{formatDate(d.date)}</p>
                    {d.message && (
                      <p className="text-xs text-muted italic mt-0.5">
                        &ldquo;{d.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-success whitespace-nowrap">
                    +{formatCurrency(d.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Expenses with market price comparison */}
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-accent" /> Khoản Chi (
            {expenses.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-sm text-muted">Chưa có khoản chi nào.</p>
            ) : (
              expenses.map((e) => {
                const deviation =
                  e.marketPrice && e.marketPrice > 0
                    ? Math.round(
                        ((e.amount - e.marketPrice) / e.marketPrice) * 100
                      )
                    : null;
                return (
                  <div
                    key={e.id}
                    className="flex justify-between items-start py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{e.description}</p>
                      <p className="text-xs text-muted">
                        {e.category} &middot; {formatDate(e.date)} &middot;
                        Duyệt: {e.approvedBy}
                      </p>
                      {e.marketPrice && (
                        <p className="text-xs mt-0.5">
                          <span className="text-muted">
                            Giá TT: {formatCurrency(e.marketPrice)}
                          </span>
                          {deviation !== null && deviation > 10 && (
                            <span className="text-danger ml-2">
                              (+{deviation}%)
                            </span>
                          )}
                          {deviation !== null && deviation <= 10 && (
                            <span className="text-success ml-2">
                              (+{deviation}%)
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-danger whitespace-nowrap">
                      -{formatCurrency(e.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Invoices */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4">
          Hóa Đơn Tự Động ({invoices.length})
        </h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted">Chưa có hóa đơn nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-2 pr-4">Mã HĐ</th>
                  <th className="pb-2 pr-4">Nhà cung cấp</th>
                  <th className="pb-2 pr-4">Số tiền</th>
                  <th className="pb-2 pr-4">Ngày</th>
                  <th className="pb-2 pr-4">Tự động</th>
                  <th className="pb-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const invStatus = invoiceStatusMap[inv.status];
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">
                        {inv.id}
                      </td>
                      <td className="py-2 pr-4">{inv.vendor}</td>
                      <td className="py-2 pr-4 font-semibold">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-2 pr-4">{formatDate(inv.date)}</td>
                      <td className="py-2 pr-4">
                        {inv.autoGenerated ? (
                          <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full">
                            Tự động
                          </span>
                        ) : (
                          <span className="text-xs">Thủ công</span>
                        )}
                      </td>
                      <td className="py-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${invStatus.className}`}
                        >
                          {invStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Daily Progress */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4">Tiến Độ Hàng Ngày</h2>
        {progress.length === 0 ? (
          <p className="text-sm text-muted">Chưa có cập nhật tiến độ.</p>
        ) : (
          <div className="space-y-4">
            {progress.map((entry) => (
              <div
                key={entry.id}
                className="border-l-4 border-primary pl-4 py-1"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted font-mono">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full">
                    {formatPercent(entry.completionPercent)}
                  </span>
                  {entry.author && (
                    <span className="text-xs text-muted">
                      {entry.author}
                      {entry.role && ` (${entry.role})`}
                    </span>
                  )}
                </div>
                <h4 className="font-semibold mt-1">{entry.title}</h4>
                <p className="text-sm text-muted mt-0.5">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
