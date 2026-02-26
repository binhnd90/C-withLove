"use client";

import { useState } from "react";
import { ShieldCheck, Search, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { verifyDonorCode, projects } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/lib/types";

export default function VerifyDonationPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Donation | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    const found = verifyDonorCode(trimmed);
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  }

  const project = result
    ? projects.find((p) => p.id === result.projectId)
    : null;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Quét mã
      </Link>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Xác Minh Ẩn Danh
        </h1>
        <p className="text-muted mt-1">
          Nhập mã xác minh riêng của bạn để đối soát khoản đóng góp ẩn danh.
          Thông tin chỉ hiển thị cho người sở hữu mã.
        </p>
      </div>

      {/* Verification Form */}
      <section className="bg-card rounded-xl border border-border p-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã xác minh cá nhân
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setNotFound(false);
                setResult(null);
              }}
              placeholder="VD: CWL-AD-2025-X7K9"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <p className="text-xs text-muted mt-1">
              Mã này được cung cấp khi bạn đóng góp ở chế độ ẩn danh
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Search className="w-4 h-4" />
            Xác minh
          </button>
        </form>
      </section>

      {/* Not Found */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-800 font-medium">
            Không tìm thấy khoản đóng góp nào khớp với mã này.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Vui lòng kiểm tra lại mã xác minh. Mã có dạng CWL-AD-XXXX-XXXX.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <section className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-success flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Xác minh thành công
            </h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-muted hover:text-foreground"
            >
              {showDetails ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showDetails ? "Ẩn chi tiết" : "Hiện chi tiết"}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted">Mã giao dịch</span>
              <span className="text-sm font-mono font-medium">{result.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted">Số tiền</span>
              <span className="text-sm font-bold text-success">
                {formatCurrency(result.amount)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted">Ngày đóng góp</span>
              <span className="text-sm font-medium">
                {formatDate(result.date)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted">Dự án</span>
              <Link
                href={`/projects/${result.projectId}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {project?.name}
              </Link>
            </div>

            {showDetails && (
              <>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted">
                    Hiển thị công khai
                  </span>
                  <span className="text-sm font-medium">
                    &quot;Nhà hảo tâm ẩn danh&quot;
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted">
                    Trạng thái dự án
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {project?.status === "active"
                      ? "Đang thực hiện"
                      : project?.status === "completed"
                      ? "Hoàn thành"
                      : "Đang lên kế hoạch"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted">
                    Tiến độ dự án
                  </span>
                  <span className="text-sm font-medium">
                    {project?.completionPercent}%
                  </span>
                </div>
                {result.message && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted">Lời nhắn</span>
                    <span className="text-sm italic">
                      &quot;{result.message}&quot;
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              Thông tin xác minh này chỉ hiển thị cho bạn với mã riêng. Trên
              trang công khai, khoản đóng góp của bạn được hiển thị dưới tên
              &quot;Nhà hảo tâm ẩn danh&quot; để bảo vệ danh tính.
            </p>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-bold text-lg mb-3">Cách Hoạt Động</h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-primary-light text-primary-dark rounded-full flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <p className="text-muted">
              Khi đóng góp ở chế độ ẩn danh, hệ thống tạo một mã xác minh duy
              nhất (VD: CWL-AD-2025-X7K9).
            </p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-primary-light text-primary-dark rounded-full flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <p className="text-muted">
              Trên trang công khai, khoản đóng góp hiển thị là &quot;Nhà hảo
              tâm ẩn danh&quot; - không ai biết danh tính thật.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-primary-light text-primary-dark rounded-full flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <p className="text-muted">
              Bạn dùng mã riêng tại đây để đối soát số tiền, kiểm tra dự án
              mà mình đã đóng góp, hoàn toàn riêng tư.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
