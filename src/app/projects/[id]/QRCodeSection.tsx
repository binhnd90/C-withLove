"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeSectionProps {
  projectId: string;
  projectName: string;
}

export default function QRCodeSection({
  projectId,
  projectName,
}: QRCodeSectionProps) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/${projectId}`
      : `/projects/${projectId}`;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <QRCodeSVG value={url} size={120} level="M" />
      <p className="text-xs text-muted text-center">
        Quét mã để xem
        <br />
        <strong>{projectName}</strong>
      </p>
    </div>
  );
}
