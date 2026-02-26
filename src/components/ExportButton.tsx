"use client";

import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";

interface ExportButtonProps {
  projectId: string;
  projectName: string;
}

export default function ExportButton({
  projectId,
  projectName,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function handleExport(format: "pdf" | "csv") {
    setExporting(true);
    setShowMenu(false);
    try {
      const res = await fetch(
        `/api/export?projectId=${projectId}&format=${format}`
      );
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, "_")}_BaoCao.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Không thể xuất báo cáo. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {exporting ? "Đang xuất..." : "Xuất báo cáo"}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-card rounded-lg border border-border shadow-lg z-10 min-w-48">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-t-lg"
          >
            <Table className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-medium">Xuất CSV (Excel)</p>
              <p className="text-xs text-muted">Bảng tính dữ liệu tài chính</p>
            </div>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 rounded-b-lg border-t border-border"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <div>
              <p className="font-medium">Xuất PDF</p>
              <p className="text-xs text-muted">
                Báo cáo minh bạch đầy đủ
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
