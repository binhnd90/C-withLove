"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Search, ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { projects } from "@/lib/data";

export default function ScanPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchId.trim();
    if (!trimmed) return;

    const project = projects.find(
      (p) =>
        p.id === trimmed ||
        p.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (project) {
      router.push(`/projects/${project.id}`);
    } else {
      setError("Không tìm thấy dự án. Vui lòng kiểm tra lại mã dự án.");
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quét Mã Dự Án</h1>
        <p className="text-muted mt-1">
          Truy cập nhanh thông tin dự án bằng mã QR hoặc tìm kiếm trực tiếp
        </p>
      </div>

      {/* Search Form */}
      <section className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-primary" />
          <h2 className="font-bold text-lg">Tìm Kiếm Dự Án</h2>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setError("");
            }}
            placeholder="Nhập mã dự án (vd: proj-001) hoặc tên dự án..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            Tìm kiếm <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {error && <p className="text-sm text-danger mt-2">{error}</p>}
      </section>

      {/* QR Codes for all projects */}
      <section className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-6 h-6 text-primary" />
          <h2 className="font-bold text-lg">Mã QR Các Dự Án</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Quét mã QR bên dưới bằng điện thoại để truy cập trực tiếp vào trang
          chi tiết dự án. Mỗi mã QR chứa đường dẫn công khai tới dữ liệu minh
          bạch của dự án.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <QRCodeSVG
                value={`/projects/${project.id}`}
                size={140}
                level="M"
              />
              <div className="text-center">
                <p className="text-sm font-semibold">{project.name}</p>
                <p className="text-xs text-muted font-mono">{project.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-bold text-lg mb-4">Cách Sử Dụng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold">Quét Mã QR</h3>
            <p className="text-sm text-muted">
              Sử dụng camera điện thoại để quét mã QR trên vật phẩm hoặc bảng
              thông tin dự án
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold">Truy Cập Dữ Liệu</h3>
            <p className="text-sm text-muted">
              Được chuyển tới trang dự án với đầy đủ thông tin tài chính và tiến
              độ công khai
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold">Giám Sát Minh Bạch</h3>
            <p className="text-sm text-muted">
              Xem toàn bộ nguồn thu, chi tiêu, hóa đơn và tiến độ thực hiện
              theo thời gian thực
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
