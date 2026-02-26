import {
  TrendingUp,
  TrendingDown,
  Receipt,
  FileCheck,
  Landmark,
  Percent,
} from "lucide-react";
import {
  projects,
  donations,
  expenses,
  invoices,
  getFinancialSummary,
  bankAccounts,
  interestRecords,
  getTotalInterestEarned,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import StatCard from "@/components/StatCard";

const invoiceStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-amber-100 text-amber-800" },
  verified: { label: "Đã xác minh", className: "bg-blue-100 text-blue-800" },
  paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
};

export default function FinancialsPage() {
  const summary = getFinancialSummary();
  const balance = summary.totalRaised - summary.totalSpent;
  const totalInterest = getTotalInterestEarned();
  const totalBankBalance = bankAccounts.reduce((s, a) => s + a.balance, 0);

  const allDonations = [...donations].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const allExpenses = [...expenses].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const allInvoices = [...invoices].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  // Group interest by month for summary
  const monthlyInterest = new Map<string, number>();
  for (const record of interestRecords) {
    const current = monthlyInterest.get(record.month) || 0;
    monthlyInterest.set(record.month, current + record.interestEarned);
  }
  const sortedMonths = [...monthlyInterest.entries()].sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Minh Bạch Tài Chính</h1>
        <p className="text-muted mt-1">
          Toàn bộ nguồn thu, chi tiêu, lãi suất ngân hàng và hóa đơn được công
          khai
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng nguồn thu"
          value={formatCurrency(summary.totalRaised)}
          icon={TrendingUp}
          color="text-success"
        />
        <StatCard
          label="Tổng chi tiêu"
          value={formatCurrency(summary.totalSpent)}
          icon={TrendingDown}
          color="text-danger"
        />
        <StatCard
          label="Số dư hiện tại"
          value={formatCurrency(balance)}
          icon={Receipt}
          color="text-primary"
        />
        <StatCard
          label="Tổng lãi suất tích lũy"
          value={formatCurrency(totalInterest)}
          icon={Percent}
          color="text-accent"
        />
      </div>

      {/* Bank Accounts - Multi-account tracking */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" />
          Tài Khoản Ngân Hàng ({bankAccounts.length})
        </h2>
        <p className="text-sm text-muted mb-4">
          Theo dõi đa tài khoản - tổng số dư:{" "}
          <strong>{formatCurrency(totalBankBalance)}</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="rounded-lg border border-border p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{acc.bankName}</span>
                <span className="text-xs text-muted font-mono">
                  {acc.accountNumber}
                </span>
              </div>
              <p className="text-xs text-muted">{acc.accountType}</p>
              <p className="text-lg font-bold">
                {formatCurrency(acc.balance)}
              </p>
              <p className="text-xs">
                Lãi suất:{" "}
                <span className="font-semibold text-accent">
                  {acc.interestRate}%/năm
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Interest */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-accent" />
          Lãi Suất Ngân Hàng Hàng Tháng
        </h2>
        <p className="text-sm text-muted mb-4">
          Tổng lãi suất tích lũy:{" "}
          <strong className="text-accent">
            {formatCurrency(totalInterest)}
          </strong>{" "}
          - Toàn bộ lãi được sử dụng cho hoạt động từ thiện
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-2 pr-4">Tháng</th>
                {bankAccounts.map((acc) => (
                  <th key={acc.id} className="pb-2 pr-4 text-right">
                    {acc.bankName}
                  </th>
                ))}
                <th className="pb-2 text-right">Tổng lãi</th>
              </tr>
            </thead>
            <tbody>
              {sortedMonths.map(([month, total]) => (
                <tr
                  key={month}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 font-mono text-xs">{month}</td>
                  {bankAccounts.map((acc) => {
                    const record = interestRecords.find(
                      (r) => r.accountId === acc.id && r.month === month
                    );
                    return (
                      <td
                        key={acc.id}
                        className="py-2 pr-4 text-right text-accent"
                      >
                        {record
                          ? formatCurrency(record.interestEarned)
                          : "-"}
                      </td>
                    );
                  })}
                  <td className="py-2 text-right font-semibold text-accent">
                    {formatCurrency(total)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="py-2 pr-4">Tổng cộng</td>
                {bankAccounts.map((acc) => {
                  const accTotal = interestRecords
                    .filter((r) => r.accountId === acc.id)
                    .reduce((s, r) => s + r.interestEarned, 0);
                  return (
                    <td
                      key={acc.id}
                      className="py-2 pr-4 text-right text-accent"
                    >
                      {formatCurrency(accTotal)}
                    </td>
                  );
                })}
                <td className="py-2 text-right text-accent">
                  {formatCurrency(totalInterest)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Income & Expenses Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-bold text-lg mb-4 text-success">
            Nguồn Thu ({allDonations.length} khoản)
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {allDonations.map((d) => (
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
                  <p className="text-xs text-muted">
                    {projects.find((p) => p.id === d.projectId)?.name} &middot;{" "}
                    {formatDate(d.date)}
                  </p>
                </div>
                <span className="text-sm font-bold text-success whitespace-nowrap">
                  +{formatCurrency(d.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-bold text-lg mb-4 text-danger">
            Khoản Chi ({allExpenses.length} khoản)
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {allExpenses.map((e) => (
              <div
                key={e.id}
                className="flex justify-between items-start py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{e.description}</p>
                  <p className="text-xs text-muted">
                    {projects.find((p) => p.id === e.projectId)?.name} &middot;{" "}
                    {e.category} &middot; {formatDate(e.date)}
                  </p>
                  <p className="text-xs text-muted">
                    Duyệt bởi: {e.approvedBy}
                  </p>
                  {e.marketPrice && (
                    <p className="text-xs text-muted">
                      Giá thị trường: {formatCurrency(e.marketPrice)}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-danger whitespace-nowrap">
                  -{formatCurrency(e.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Per-Project Breakdown */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4">Đối Soát Theo Dự Án</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-2 pr-4">Dự án</th>
                <th className="pb-2 pr-4 text-right">Mục tiêu</th>
                <th className="pb-2 pr-4 text-right">Đã nhận</th>
                <th className="pb-2 pr-4 text-right">Đã chi</th>
                <th className="pb-2 text-right">Số dư</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4 text-right">
                    {formatCurrency(p.goal)}
                  </td>
                  <td className="py-3 pr-4 text-right text-success font-semibold">
                    {formatCurrency(p.raised)}
                  </td>
                  <td className="py-3 pr-4 text-right text-danger font-semibold">
                    {formatCurrency(p.spent)}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    {formatCurrency(p.raised - p.spent)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="py-3 pr-4">Tổng cộng</td>
                <td className="py-3 pr-4 text-right">
                  {formatCurrency(
                    projects.reduce((s, p) => s + p.goal, 0)
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-success">
                  {formatCurrency(summary.totalRaised)}
                </td>
                <td className="py-3 pr-4 text-right text-danger">
                  {formatCurrency(summary.totalSpent)}
                </td>
                <td className="py-3 text-right">
                  {formatCurrency(balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* All Invoices */}
      <section className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-accent" />
          Hóa Đơn Tự Động ({allInvoices.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-2 pr-4">Mã HĐ</th>
                <th className="pb-2 pr-4">Dự án</th>
                <th className="pb-2 pr-4">Nhà cung cấp</th>
                <th className="pb-2 pr-4">Số tiền</th>
                <th className="pb-2 pr-4">Ngày</th>
                <th className="pb-2 pr-4">Loại</th>
                <th className="pb-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv) => {
                const invStatus = invoiceStatusMap[inv.status];
                const proj = projects.find((p) => p.id === inv.projectId);
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{inv.id}</td>
                    <td className="py-2 pr-4 text-xs">{proj?.name}</td>
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
      </section>
    </div>
  );
}
