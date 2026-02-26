"use client";

import { useState } from "react";
import {
  Settings,
  Landmark,
  Users,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Shield,
} from "lucide-react";
import {
  bankAccounts as initialBankAccounts,
  fieldWorkers as initialFieldWorkers,
  projects,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { BankAccount, FieldWorker, UserRole } from "@/lib/types";

const roleLabels: Record<UserRole, string> = {
  admin: "Quản trị viên",
  field_worker: "Cộng tác viên hiện trường",
  auditor: "Kiểm toán viên",
  public: "Công khai",
};

const roleBadge: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  field_worker: "bg-blue-100 text-blue-800",
  auditor: "bg-amber-100 text-amber-800",
  public: "bg-gray-100 text-gray-800",
};

type Tab = "bank" | "workers";

// ── Bank Account Form ──────────────────────────────────────────
interface BankFormState {
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: string;
  interestRate: string;
}

const emptyBankForm: BankFormState = {
  bankName: "",
  accountNumber: "",
  accountType: "",
  balance: "",
  interestRate: "",
};

// ── Worker Form ────────────────────────────────────────────────
interface WorkerFormState {
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  assignedProjects: string[];
}

const emptyWorkerForm: WorkerFormState = {
  name: "",
  role: "field_worker",
  email: "",
  phone: "",
  assignedProjects: [],
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bank");

  // ── Bank Accounts State ────────────────────────────────────────
  const [accounts, setAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState<BankFormState>(emptyBankForm);

  // ── Field Workers State ────────────────────────────────────────
  const [workers, setWorkers] = useState<FieldWorker[]>(initialFieldWorkers);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerForm, setWorkerForm] = useState<WorkerFormState>(emptyWorkerForm);

  // ── Bank Account Handlers ──────────────────────────────────────
  function startEditBank(acc: BankAccount) {
    setEditingBankId(acc.id);
    setBankForm({
      bankName: acc.bankName,
      accountNumber: acc.accountNumber,
      accountType: acc.accountType,
      balance: String(acc.balance),
      interestRate: String(acc.interestRate),
    });
    setShowBankForm(true);
  }

  function startAddBank() {
    setEditingBankId(null);
    setBankForm(emptyBankForm);
    setShowBankForm(true);
  }

  function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    if (editingBankId) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingBankId
            ? {
                ...acc,
                bankName: bankForm.bankName,
                accountNumber: bankForm.accountNumber,
                accountType: bankForm.accountType,
                balance: Number(bankForm.balance),
                interestRate: Number(bankForm.interestRate),
              }
            : acc
        )
      );
    } else {
      const newAcc: BankAccount = {
        id: `acc-${Date.now()}`,
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        accountType: bankForm.accountType,
        balance: Number(bankForm.balance),
        currency: "VND",
        interestRate: Number(bankForm.interestRate),
      };
      setAccounts((prev) => [...prev, newAcc]);
    }
    setShowBankForm(false);
    setEditingBankId(null);
    setBankForm(emptyBankForm);
  }

  function handleDeleteBank(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  // ── Field Worker Handlers ──────────────────────────────────────
  function startEditWorker(worker: FieldWorker) {
    setEditingWorkerId(worker.id);
    setWorkerForm({
      name: worker.name,
      role: worker.role,
      email: worker.email,
      phone: worker.phone,
      assignedProjects: [...worker.assignedProjects],
    });
    setShowWorkerForm(true);
  }

  function startAddWorker() {
    setEditingWorkerId(null);
    setWorkerForm(emptyWorkerForm);
    setShowWorkerForm(true);
  }

  function handleSaveWorker(e: React.FormEvent) {
    e.preventDefault();
    if (editingWorkerId) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === editingWorkerId
            ? {
                ...w,
                name: workerForm.name,
                role: workerForm.role,
                email: workerForm.email,
                phone: workerForm.phone,
                assignedProjects: workerForm.assignedProjects,
              }
            : w
        )
      );
    } else {
      const newWorker: FieldWorker = {
        id: `fw-${Date.now()}`,
        name: workerForm.name,
        role: workerForm.role,
        email: workerForm.email,
        phone: workerForm.phone,
        assignedProjects: workerForm.assignedProjects,
      };
      setWorkers((prev) => [...prev, newWorker]);
    }
    setShowWorkerForm(false);
    setEditingWorkerId(null);
    setWorkerForm(emptyWorkerForm);
  }

  function handleDeleteWorker(id: string) {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  }

  function toggleProject(projectId: string) {
    setWorkerForm((prev) => ({
      ...prev,
      assignedProjects: prev.assignedProjects.includes(projectId)
        ? prev.assignedProjects.filter((p) => p !== projectId)
        : [...prev.assignedProjects, projectId],
    }));
  }

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Quản Trị Hệ Thống
        </h1>
        <p className="text-muted mt-1">
          Quản lý tài khoản ngân hàng và cộng tác viên
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "bank"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Landmark className="w-4 h-4" />
          Tài Khoản Ngân Hàng ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab("workers")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "workers"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Cộng Tác Viên ({workers.length})
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB: Bank Accounts
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "bank" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              Tổng số dư:{" "}
              <strong className="text-foreground">
                {formatCurrency(totalBalance)}
              </strong>
            </p>
            <button
              onClick={startAddBank}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm tài khoản
            </button>
          </div>

          {/* Bank Form */}
          {showBankForm && (
            <form
              onSubmit={handleSaveBank}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                {editingBankId ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.bankName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, bankName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: Vietcombank, TPBank..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số tài khoản (ẩn)
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.accountNumber}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: ****1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Loại tài khoản
                  </label>
                  <select
                    required
                    value={bankForm.accountType}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, accountType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Chọn loại</option>
                    <option value="Tài khoản thanh toán">
                      Tài khoản thanh toán
                    </option>
                    <option value="Tiết kiệm có kỳ hạn 3 tháng">
                      Tiết kiệm có kỳ hạn 3 tháng
                    </option>
                    <option value="Tiết kiệm có kỳ hạn 6 tháng">
                      Tiết kiệm có kỳ hạn 6 tháng
                    </option>
                    <option value="Tiết kiệm có kỳ hạn 12 tháng">
                      Tiết kiệm có kỳ hạn 12 tháng
                    </option>
                    <option value="Tiết kiệm online 3 tháng">
                      Tiết kiệm online 3 tháng
                    </option>
                    <option value="Tiết kiệm online 6 tháng">
                      Tiết kiệm online 6 tháng
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số dư (VND)
                  </label>
                  <input
                    type="number"
                    required
                    value={bankForm.balance}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, balance: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: 500000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lãi suất (%/năm)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={bankForm.interestRate}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        interestRate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: 4.4"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  <Save className="w-4 h-4" />
                  {editingBankId ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBankForm(false);
                    setEditingBankId(null);
                    setBankForm(emptyBankForm);
                  }}
                  className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Bank Accounts Table */}
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted bg-gray-50">
                    <th className="px-5 py-3">Ngân hàng</th>
                    <th className="px-5 py-3">Số TK</th>
                    <th className="px-5 py-3">Loại TK</th>
                    <th className="px-5 py-3 text-right">Số dư</th>
                    <th className="px-5 py-3 text-right">Lãi suất</th>
                    <th className="px-5 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className="border-b border-border last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-semibold">
                        {acc.bankName}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted">
                        {acc.accountNumber}
                      </td>
                      <td className="px-5 py-3 text-xs">{acc.accountType}</td>
                      <td className="px-5 py-3 text-right font-semibold">
                        {formatCurrency(acc.balance)}
                      </td>
                      <td className="px-5 py-3 text-right text-accent font-medium">
                        {acc.interestRate}%/năm
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => startEditBank(acc)}
                            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-light/50 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBank(acc.id)}
                            className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB: Field Workers
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "workers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              Tổng cộng tác viên:{" "}
              <strong className="text-foreground">{workers.length}</strong>
            </p>
            <button
              onClick={startAddWorker}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm cộng tác viên
            </button>
          </div>

          {/* Worker Form */}
          {showWorkerForm && (
            <form
              onSubmit={handleSaveWorker}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                {editingWorkerId
                  ? "Chỉnh Sửa Cộng Tác Viên"
                  : "Thêm Cộng Tác Viên Mới"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={workerForm.name}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Vai trò
                  </label>
                  <select
                    required
                    value={workerForm.role}
                    onChange={(e) =>
                      setWorkerForm({
                        ...workerForm,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="field_worker">
                      Cộng tác viên hiện trường
                    </option>
                    <option value="admin">Quản trị viên</option>
                    <option value="auditor">Kiểm toán viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={workerForm.email}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: name@cwl.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    value={workerForm.phone}
                    onChange={(e) =>
                      setWorkerForm({ ...workerForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: 0912***456"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Dự án được phân công
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProject(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          workerForm.assignedProjects.includes(p.id)
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-muted border-border hover:border-primary"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  <Save className="w-4 h-4" />
                  {editingWorkerId ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWorkerForm(false);
                    setEditingWorkerId(null);
                    setWorkerForm(emptyWorkerForm);
                  }}
                  className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Workers List */}
          <div className="space-y-3">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold">{worker.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        roleBadge[worker.role]
                      }`}
                    >
                      {roleLabels[worker.role]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted">
                    <span>{worker.email}</span>
                    <span>{worker.phone}</span>
                    <span className="font-mono">{worker.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {worker.assignedProjects.map((pid) => {
                      const proj = projects.find((p) => p.id === pid);
                      return (
                        <span
                          key={pid}
                          className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full"
                        >
                          {proj?.name || pid}
                        </span>
                      );
                    })}
                    {worker.assignedProjects.length === 0 && (
                      <span className="text-xs text-muted italic">
                        Chưa phân công dự án
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  <button
                    onClick={() => startEditWorker(worker)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteWorker(worker.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-danger hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Roles Info */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Mô Tả Vai Trò
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Quản trị viên
                </span>
                <p className="text-muted mt-2">
                  Toàn quyền quản lý: duyệt báo cáo, quản lý tài khoản, thêm
                  xóa cộng tác viên, phê duyệt chi tiêu.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  CTV Hiện trường
                </span>
                <p className="text-muted mt-2">
                  Tải ảnh tiến độ, số hóa hóa đơn, báo cáo sự cố tại hiện
                  trường. Chỉ thao tác trên dự án được phân công.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Kiểm toán viên
                </span>
                <p className="text-muted mt-2">
                  Xem tất cả báo cáo từ mọi dự án, duyệt báo cáo, đối chiếu
                  chi phí và hóa đơn. Không tạo báo cáo mới.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
