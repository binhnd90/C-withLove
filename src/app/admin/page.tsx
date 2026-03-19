"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Landmark,
  Users,
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Shield,
  LogIn,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  bankAccounts as initialBankAccounts,
  fieldWorkers as initialFieldWorkers,
  projects as initialProjects,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { BankAccount, FieldWorker, UserRole, Project, ProjectStatus } from "@/lib/types";

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

const statusLabels: Record<ProjectStatus, { label: string; className: string }> = {
  active: { label: "Đang thực hiện", className: "bg-primary-light text-primary-dark" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
  planning: { label: "Đang lên kế hoạch", className: "bg-amber-100 text-amber-800" },
};

type Tab = "projects" | "bank" | "workers";

// ── Form States ────────────────────────────────────────────────
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

interface ProjectFormState {
  name: string;
  description: string;
  goal: string;
  raised: string;
  spent: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  completionPercent: string;
}

const emptyProjectForm: ProjectFormState = {
  name: "",
  description: "",
  goal: "",
  raised: "0",
  spent: "0",
  status: "planning",
  startDate: "",
  endDate: "",
  location: "",
  category: "",
  completionPercent: "0",
};

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  // ── Projects State ───────────────────────────────────────────────
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm);

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

  // ── Auth Check ─────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted text-sm">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold">Yêu Cầu Đăng Nhập</h1>
          <p className="text-muted">
            Trang quản trị chỉ dành cho quản trị viên. Vui lòng đăng nhập bằng
            tài khoản Google, Apple hoặc email được cấp quyền.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // ── Project Handlers ───────────────────────────────────────────
  function startEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      description: project.description,
      goal: String(project.goal),
      raised: String(project.raised),
      spent: String(project.spent),
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || "",
      location: project.location,
      category: project.category,
      completionPercent: String(project.completionPercent),
    });
    setShowProjectForm(true);
  }

  function startAddProject() {
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
    setShowProjectForm(true);
  }

  function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    if (editingProjectId) {
      setProjectsList((prev) =>
        prev.map((p) =>
          p.id === editingProjectId
            ? {
                ...p,
                name: projectForm.name,
                description: projectForm.description,
                goal: Number(projectForm.goal),
                raised: Number(projectForm.raised),
                spent: Number(projectForm.spent),
                status: projectForm.status,
                startDate: projectForm.startDate,
                endDate: projectForm.endDate || undefined,
                location: projectForm.location,
                category: projectForm.category,
                completionPercent: Number(projectForm.completionPercent),
              }
            : p
        )
      );
    } else {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: projectForm.name,
        description: projectForm.description,
        goal: Number(projectForm.goal),
        raised: Number(projectForm.raised),
        spent: Number(projectForm.spent),
        currency: "VND",
        status: projectForm.status,
        startDate: projectForm.startDate,
        endDate: projectForm.endDate || undefined,
        location: projectForm.location,
        category: projectForm.category,
        imageUrl: "/images/default.jpg",
        completionPercent: Number(projectForm.completionPercent),
      };
      setProjectsList((prev) => [...prev, newProject]);
    }
    setShowProjectForm(false);
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
  }

  function handleDeleteProject(id: string) {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Quản Trị Hệ Thống
          </h1>
          <p className="text-muted mt-1">
            Xin chào, <strong>{session.user?.name || session.user?.email}</strong>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "projects"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Dự Án ({projectsList.length})
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "bank"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Landmark className="w-4 h-4" />
          Tài Khoản NH ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab("workers")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          TAB: Projects
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              Quản lý thông tin dự án, trạng thái và ngân sách
            </p>
            <button
              onClick={startAddProject}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm dự án
            </button>
          </div>

          {/* Project Form */}
          {showProjectForm && (
            <form
              onSubmit={handleSaveProject}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                {editingProjectId ? "Chỉnh Sửa Dự Án" : "Thêm Dự Án Mới"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Tên dự án
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: Xây Trường Học Vùng Cao"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Mô tả
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Danh mục
                  </label>
                  <select
                    required
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Giáo dục">Giáo dục</option>
                    <option value="Y tế">Y tế</option>
                    <option value="Hạ tầng">Hạ tầng</option>
                    <option value="Nước sạch">Nước sạch</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: Hà Giang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trạng thái
                  </label>
                  <select
                    required
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="planning">Đang lên kế hoạch</option>
                    <option value="active">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tiến độ (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={projectForm.completionPercent}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, completionPercent: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mục tiêu (VND)
                  </label>
                  <input
                    type="number"
                    required
                    value={projectForm.goal}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, goal: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="VD: 2000000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Đã nhận (VND)
                  </label>
                  <input
                    type="number"
                    required
                    value={projectForm.raised}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, raised: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Đã chi (VND)
                  </label>
                  <input
                    type="number"
                    required
                    value={projectForm.spent}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, spent: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    required
                    value={projectForm.startDate}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ngày kết thúc (tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  <Save className="w-4 h-4" />
                  {editingProjectId ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProjectId(null);
                    setProjectForm(emptyProjectForm);
                  }}
                  className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Projects List */}
          <div className="space-y-3">
            {projectsList.map((project) => {
              const st = statusLabels[project.status];
              return (
                <div
                  key={project.id}
                  className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold">{project.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.className}`}>
                        {st.label}
                      </span>
                      <span className="text-xs font-mono text-muted">{project.id}</span>
                    </div>
                    <p className="text-sm text-muted line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(project.startDate)}
                        {project.endDate && ` - ${formatDate(project.endDate)}`}
                      </span>
                      <span>{project.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span>
                        Mục tiêu: <strong>{formatCurrency(project.goal)}</strong>
                      </span>
                      <span>
                        Đã nhận: <strong className="text-success">{formatCurrency(project.raised)}</strong>
                      </span>
                      <span>
                        Đã chi: <strong className="text-danger">{formatCurrency(project.spent)}</strong>
                      </span>
                      <span>
                        Tiến độ: <strong>{project.completionPercent}%</strong>
                      </span>
                    </div>
                    {/* Workers assigned to this project */}
                    <div className="flex flex-wrap gap-1.5">
                      {workers
                        .filter((w) => w.assignedProjects.includes(project.id))
                        .map((w) => (
                          <span
                            key={w.id}
                            className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[w.role]}`}
                          >
                            {w.name}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button
                      onClick={() => startEditProject(project)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-primary hover:border-primary transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-danger hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-medium mb-1">Tên ngân hàng</label>
                  <input type="text" required value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: Vietcombank, TPBank..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số tài khoản (ẩn)</label>
                  <input type="text" required value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: ****1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại tài khoản</label>
                  <select required value={bankForm.accountType} onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Chọn loại</option>
                    <option value="Tài khoản thanh toán">Tài khoản thanh toán</option>
                    <option value="Tiết kiệm có kỳ hạn 3 tháng">Tiết kiệm có kỳ hạn 3 tháng</option>
                    <option value="Tiết kiệm có kỳ hạn 6 tháng">Tiết kiệm có kỳ hạn 6 tháng</option>
                    <option value="Tiết kiệm có kỳ hạn 12 tháng">Tiết kiệm có kỳ hạn 12 tháng</option>
                    <option value="Tiết kiệm online 3 tháng">Tiết kiệm online 3 tháng</option>
                    <option value="Tiết kiệm online 6 tháng">Tiết kiệm online 6 tháng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số dư (VND)</label>
                  <input type="number" required value={bankForm.balance} onChange={(e) => setBankForm({ ...bankForm, balance: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lãi suất (%/năm)</label>
                  <input type="number" step="0.01" required value={bankForm.interestRate} onChange={(e) => setBankForm({ ...bankForm, interestRate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"><Save className="w-4 h-4" />{editingBankId ? "Cập nhật" : "Thêm mới"}</button>
                <button type="button" onClick={() => { setShowBankForm(false); setEditingBankId(null); setBankForm(emptyBankForm); }} className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"><X className="w-4 h-4" />Hủy</button>
              </div>
            </form>
          )}

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
                    <tr key={acc.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3 font-semibold">{acc.bankName}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted">{acc.accountNumber}</td>
                      <td className="px-5 py-3 text-xs">{acc.accountType}</td>
                      <td className="px-5 py-3 text-right font-semibold">{formatCurrency(acc.balance)}</td>
                      <td className="px-5 py-3 text-right text-accent font-medium">{acc.interestRate}%/năm</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => startEditBank(acc)} className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-light/50 transition-colors" title="Chỉnh sửa"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteBank(acc.id)} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
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

          {showWorkerForm && (
            <form
              onSubmit={handleSaveWorker}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <h2 className="font-bold text-lg">
                {editingWorkerId ? "Chỉnh Sửa Cộng Tác Viên" : "Thêm Cộng Tác Viên Mới"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ và tên</label>
                  <input type="text" required value={workerForm.name} onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vai trò</label>
                  <select required value={workerForm.role} onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value as UserRole })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="field_worker">Cộng tác viên hiện trường</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="auditor">Kiểm toán viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" required value={workerForm.email} onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: name@cwl.org" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input type="text" required value={workerForm.phone} onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="VD: 0912***456" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dự án được phân công</label>
                  <div className="flex flex-wrap gap-2">
                    {projectsList.map((p) => (
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
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"><Save className="w-4 h-4" />{editingWorkerId ? "Cập nhật" : "Thêm mới"}</button>
                <button type="button" onClick={() => { setShowWorkerForm(false); setEditingWorkerId(null); setWorkerForm(emptyWorkerForm); }} className="flex items-center gap-2 px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"><X className="w-4 h-4" />Hủy</button>
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[worker.role]}`}>
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
                      const proj = projectsList.find((p) => p.id === pid);
                      return (
                        <span key={pid} className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full">
                          {proj?.name || pid}
                        </span>
                      );
                    })}
                    {worker.assignedProjects.length === 0 && (
                      <span className="text-xs text-muted italic">Chưa phân công dự án</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  <button onClick={() => startEditWorker(worker)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-primary hover:border-primary transition-colors">
                    <Pencil className="w-3.5 h-3.5" />Sửa
                  </button>
                  <button onClick={() => handleDeleteWorker(worker.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-danger hover:border-red-300 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />Xóa
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
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Quản trị viên</span>
                <p className="text-muted mt-2">Toàn quyền quản lý: duyệt báo cáo, quản lý tài khoản, thêm xóa cộng tác viên, phê duyệt chi tiêu.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">CTV Hiện trường</span>
                <p className="text-muted mt-2">Tải ảnh tiến độ, số hóa hóa đơn, báo cáo sự cố tại hiện trường. Chỉ thao tác trên dự án được phân công.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Kiểm toán viên</span>
                <p className="text-muted mt-2">Xem tất cả báo cáo từ mọi dự án, duyệt báo cáo, đối chiếu chi phí và hóa đơn. Không tạo báo cáo mới.</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
