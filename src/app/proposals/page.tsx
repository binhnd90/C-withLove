"use client";

import { useState } from "react";
import {
  Vote,
  ThumbsUp,
  ThumbsDown,
  Plus,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { proposals as initialProposals, projects } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Proposal, ProposalStatus } from "@/lib/types";

const statusConfig: Record<
  ProposalStatus,
  { label: string; className: string }
> = {
  open: { label: "Đang bình chọn", className: "bg-blue-100 text-blue-800" },
  approved: { label: "Đã phê duyệt", className: "bg-green-100 text-green-800" },
  rejected: { label: "Không đạt", className: "bg-red-100 text-red-800" },
  implemented: {
    label: "Đã triển khai",
    className: "bg-primary-light text-primary-dark",
  },
};

export default function ProposalsPage() {
  const [proposalsList, setProposals] = useState<Proposal[]>(initialProposals);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    estimatedBudget: "",
    proposedBy: "",
  });

  const filtered =
    filterStatus === "all"
      ? proposalsList
      : proposalsList.filter((p) => p.status === filterStatus);

  const sorted = [...filtered].sort((a, b) => {
    const scoreA = a.votesFor - a.votesAgainst;
    const scoreB = b.votesFor - b.votesAgainst;
    return scoreB - scoreA;
  });

  function handleVote(id: string, type: "for" | "against") {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              votesFor: type === "for" ? p.votesFor + 1 : p.votesFor,
              votesAgainst:
                type === "against" ? p.votesAgainst + 1 : p.votesAgainst,
            }
          : p
      )
    );
  }

  function handleSubmitProposal(e: React.FormEvent) {
    e.preventDefault();
    const proposal: Proposal = {
      id: `prop-${Date.now()}`,
      title: newProposal.title,
      description: newProposal.description,
      category: newProposal.category,
      location: newProposal.location,
      estimatedBudget: Number(newProposal.estimatedBudget),
      currency: "VND",
      proposedBy: newProposal.proposedBy,
      createdDate: new Date().toISOString().split("T")[0],
      status: "open",
      votesFor: 0,
      votesAgainst: 0,
    };
    setProposals((prev) => [proposal, ...prev]);
    setNewProposal({
      title: "",
      description: "",
      category: "",
      location: "",
      estimatedBudget: "",
      proposedBy: "",
    });
    setShowForm(false);
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Đề Xuất & Bình Chọn</h1>
          <p className="text-muted mt-1">
            Cộng đồng đề xuất dự án mới và bình chọn độ ưu tiên
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Đề xuất dự án mới
        </button>
      </div>

      {/* Proposal Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitProposal}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="font-bold text-lg">Tạo Đề Xuất Mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên dự án
              </label>
              <input
                type="text"
                required
                value={newProposal.title}
                onChange={(e) =>
                  setNewProposal({ ...newProposal, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="VD: Xây cầu cho bản làng..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Người đề xuất
              </label>
              <input
                type="text"
                required
                value={newProposal.proposedBy}
                onChange={(e) =>
                  setNewProposal({ ...newProposal, proposedBy: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Tên của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Danh mục
              </label>
              <select
                required
                value={newProposal.category}
                onChange={(e) =>
                  setNewProposal({ ...newProposal, category: e.target.value })
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
                value={newProposal.location}
                onChange={(e) =>
                  setNewProposal({ ...newProposal, location: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="VD: Hà Giang"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Ngân sách dự kiến (VND)
              </label>
              <input
                type="number"
                required
                value={newProposal.estimatedBudget}
                onChange={(e) =>
                  setNewProposal({
                    ...newProposal,
                    estimatedBudget: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="VD: 500000000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                required
                rows={3}
                value={newProposal.description}
                onChange={(e) =>
                  setNewProposal({
                    ...newProposal,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Mô tả mục đích, đối tượng thụ hưởng, kết quả mong đợi..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              Gửi đề xuất
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Tất cả" },
          { key: "open", label: "Đang bình chọn" },
          { key: "approved", label: "Đã phê duyệt" },
          { key: "implemented", label: "Đã triển khai" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === key
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {sorted.map((proposal, index) => {
          const st = statusConfig[proposal.status];
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const approvalRate =
            totalVotes > 0
              ? Math.round((proposal.votesFor / totalVotes) * 100)
              : 0;
          const linkedProject = proposal.linkedProjectId
            ? projects.find((p) => p.id === proposal.linkedProjectId)
            : null;

          return (
            <div
              key={proposal.id}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Rank */}
                <div className="flex lg:flex-col items-center justify-center gap-1 lg:w-16">
                  <span className="text-2xl font-bold text-muted">
                    #{index + 1}
                  </span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg">{proposal.title}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${st.className}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{proposal.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {proposal.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {formatDate(proposal.createdDate)}
                    </span>
                    <span>
                      Ngân sách:{" "}
                      <strong>
                        {formatCurrency(proposal.estimatedBudget)}
                      </strong>
                    </span>
                    <span>Đề xuất bởi: {proposal.proposedBy}</span>
                  </div>
                  {linkedProject && (
                    <p className="text-xs text-primary">
                      Liên kết dự án: {linkedProject.name}
                    </p>
                  )}
                </div>

                {/* Voting */}
                <div className="flex lg:flex-col items-center gap-3 lg:w-40">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(proposal.id, "for")}
                      disabled={proposal.status !== "open"}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {proposal.votesFor}
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, "against")}
                      disabled={proposal.status !== "open"}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {proposal.votesAgainst}
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-success"
                        style={{ width: `${approvalRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {approvalRate}% ủng hộ ({totalVotes} phiếu)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How Voting Works */}
      <section className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Vote className="w-5 h-5 text-primary" /> Cơ Chế Bình Chọn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <h3 className="font-semibold">1. Đề xuất</h3>
            <p className="text-muted">
              Bất kỳ ai cũng có thể đề xuất dự án mới. Đề xuất cần mô tả rõ
              mục tiêu, địa điểm và ngân sách dự kiến.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">2. Bình chọn</h3>
            <p className="text-muted">
              Cộng đồng bình chọn ủng hộ hoặc phản đối. Các dự án được xếp hạng
              theo tỷ lệ ủng hộ để xác định độ ưu tiên.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">3. Triển khai</h3>
            <p className="text-muted">
              Đề xuất đạt ngưỡng sẽ được phê duyệt và chuyển thành dự án chính
              thức với hồ sơ đấu thầu công khai.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
