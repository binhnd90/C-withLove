import {
  Project,
  Donation,
  Expense,
  Invoice,
  ProgressEntry,
  FinancialSummary,
} from "./types";

// ── Mock Projects ──────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: "proj-001",
    name: "Xây Trường Học Vùng Cao",
    description:
      "Xây dựng trường tiểu học 8 phòng học cho trẻ em vùng cao tại Hà Giang, cung cấp cơ sở vật chất và trang thiết bị học tập đầy đủ.",
    goal: 2_000_000_000,
    raised: 1_750_000_000,
    spent: 1_200_000_000,
    currency: "VND",
    status: "active",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    location: "Hà Giang",
    category: "Giáo dục",
    imageUrl: "/images/school.jpg",
    completionPercent: 65,
  },
  {
    id: "proj-002",
    name: "Nước Sạch Cho Bản Làng",
    description:
      "Lắp đặt hệ thống lọc nước và đường ống dẫn nước sạch cho 5 bản làng tại Lai Châu, đảm bảo nguồn nước an toàn cho hơn 2.000 người dân.",
    goal: 800_000_000,
    raised: 800_000_000,
    spent: 780_000_000,
    currency: "VND",
    status: "completed",
    startDate: "2025-03-15",
    endDate: "2025-11-20",
    location: "Lai Châu",
    category: "Nước sạch",
    imageUrl: "/images/water.jpg",
    completionPercent: 100,
  },
  {
    id: "proj-003",
    name: "Hỗ Trợ Y Tế Miền Trung",
    description:
      "Cung cấp thiết bị y tế và tổ chức khám bệnh miễn phí cho người dân vùng lũ tại Quảng Bình và Quảng Trị.",
    goal: 1_500_000_000,
    raised: 920_000_000,
    spent: 450_000_000,
    currency: "VND",
    status: "active",
    startDate: "2025-11-01",
    location: "Quảng Bình, Quảng Trị",
    category: "Y tế",
    imageUrl: "/images/medical.jpg",
    completionPercent: 35,
  },
  {
    id: "proj-004",
    name: "Thư Viện Cộng Đồng",
    description:
      "Xây dựng 3 thư viện cộng đồng tại các khu vực nông thôn ở Đắk Lắk, cung cấp sách và không gian học tập cho trẻ em.",
    goal: 500_000_000,
    raised: 150_000_000,
    spent: 0,
    currency: "VND",
    status: "planning",
    startDate: "2026-04-01",
    endDate: "2026-12-31",
    location: "Đắk Lắk",
    category: "Giáo dục",
    imageUrl: "/images/library.jpg",
    completionPercent: 0,
  },
];

// ── Mock Donations ─────────────────────────────────────────────
export const donations: Donation[] = [
  {
    id: "don-001",
    projectId: "proj-001",
    donor: { id: "d1", name: "Nguyễn Văn An", anonymous: false },
    amount: 50_000_000,
    currency: "VND",
    date: "2025-09-05",
    message: "Chúc dự án thành công!",
  },
  {
    id: "don-002",
    projectId: "proj-001",
    donor: { id: "d2", name: "Công ty TNHH ABC", anonymous: false },
    amount: 500_000_000,
    currency: "VND",
    date: "2025-09-10",
    message: "Đóng góp từ quỹ CSR của công ty",
  },
  {
    id: "don-003",
    projectId: "proj-001",
    donor: { id: "d3", name: "Ẩn danh", anonymous: true },
    amount: 200_000_000,
    currency: "VND",
    date: "2025-10-01",
  },
  {
    id: "don-004",
    projectId: "proj-002",
    donor: { id: "d4", name: "Trần Thị Bình", anonymous: false },
    amount: 100_000_000,
    currency: "VND",
    date: "2025-04-12",
  },
  {
    id: "don-005",
    projectId: "proj-002",
    donor: { id: "d5", name: "Quỹ Tình Thương", anonymous: false },
    amount: 300_000_000,
    currency: "VND",
    date: "2025-05-20",
    message: "Hỗ trợ nước sạch cho bà con",
  },
  {
    id: "don-006",
    projectId: "proj-003",
    donor: { id: "d6", name: "Lê Hoàng Minh", anonymous: false },
    amount: 20_000_000,
    currency: "VND",
    date: "2025-11-05",
  },
  {
    id: "don-007",
    projectId: "proj-003",
    donor: { id: "d2", name: "Công ty TNHH ABC", anonymous: false },
    amount: 400_000_000,
    currency: "VND",
    date: "2025-11-15",
  },
  {
    id: "don-008",
    projectId: "proj-004",
    donor: { id: "d7", name: "Phạm Quốc Huy", anonymous: false },
    amount: 50_000_000,
    currency: "VND",
    date: "2026-01-10",
    message: "Ủng hộ thư viện cho các em",
  },
  {
    id: "don-009",
    projectId: "proj-001",
    donor: { id: "d8", name: "Hội Cựu Sinh Viên ĐH BK", anonymous: false },
    amount: 1_000_000_000,
    currency: "VND",
    date: "2025-12-01",
    message: "Quỹ tập thể cựu sinh viên khóa 2010",
  },
  {
    id: "don-010",
    projectId: "proj-004",
    donor: { id: "d9", name: "Ẩn danh", anonymous: true },
    amount: 100_000_000,
    currency: "VND",
    date: "2026-02-15",
  },
];

// ── Mock Expenses ──────────────────────────────────────────────
export const expenses: Expense[] = [
  {
    id: "exp-001",
    projectId: "proj-001",
    description: "Mua vật liệu xây dựng đợt 1 (xi măng, gạch, sắt thép)",
    amount: 450_000_000,
    currency: "VND",
    date: "2025-10-15",
    category: "Vật liệu",
    invoiceId: "inv-001",
    approvedBy: "Nguyễn Minh Tuấn",
  },
  {
    id: "exp-002",
    projectId: "proj-001",
    description: "Chi phí nhân công thi công tháng 10-11",
    amount: 300_000_000,
    currency: "VND",
    date: "2025-11-30",
    category: "Nhân công",
    invoiceId: "inv-002",
    approvedBy: "Nguyễn Minh Tuấn",
  },
  {
    id: "exp-003",
    projectId: "proj-001",
    description: "Mua bàn ghế và thiết bị lớp học",
    amount: 200_000_000,
    currency: "VND",
    date: "2026-01-10",
    category: "Trang thiết bị",
    invoiceId: "inv-003",
    approvedBy: "Trần Thu Hà",
  },
  {
    id: "exp-004",
    projectId: "proj-001",
    description: "Vận chuyển vật liệu lên vùng cao",
    amount: 250_000_000,
    currency: "VND",
    date: "2025-10-20",
    category: "Vận chuyển",
    invoiceId: "inv-004",
    approvedBy: "Nguyễn Minh Tuấn",
  },
  {
    id: "exp-005",
    projectId: "proj-002",
    description: "Mua hệ thống lọc nước RO công nghiệp x5",
    amount: 350_000_000,
    currency: "VND",
    date: "2025-06-01",
    category: "Thiết bị",
    invoiceId: "inv-005",
    approvedBy: "Phạm Văn Đức",
  },
  {
    id: "exp-006",
    projectId: "proj-002",
    description: "Thi công đường ống dẫn nước 12km",
    amount: 280_000_000,
    currency: "VND",
    date: "2025-08-15",
    category: "Thi công",
    invoiceId: "inv-006",
    approvedBy: "Phạm Văn Đức",
  },
  {
    id: "exp-007",
    projectId: "proj-002",
    description: "Kiểm tra chất lượng nước và nghiệm thu",
    amount: 150_000_000,
    currency: "VND",
    date: "2025-11-01",
    category: "Kiểm định",
    invoiceId: "inv-007",
    approvedBy: "Phạm Văn Đức",
  },
  {
    id: "exp-008",
    projectId: "proj-003",
    description: "Mua thiết bị y tế (máy siêu âm, máy đo huyết áp)",
    amount: 250_000_000,
    currency: "VND",
    date: "2025-11-20",
    category: "Thiết bị y tế",
    invoiceId: "inv-008",
    approvedBy: "BS. Lê Thanh Hải",
  },
  {
    id: "exp-009",
    projectId: "proj-003",
    description: "Chi phí thuốc men và vật tư y tế",
    amount: 120_000_000,
    currency: "VND",
    date: "2025-12-05",
    category: "Thuốc men",
    invoiceId: "inv-009",
    approvedBy: "BS. Lê Thanh Hải",
  },
  {
    id: "exp-010",
    projectId: "proj-003",
    description: "Chi phí tổ chức đoàn khám bệnh",
    amount: 80_000_000,
    currency: "VND",
    date: "2026-01-15",
    category: "Tổ chức",
    invoiceId: "inv-010",
    approvedBy: "BS. Lê Thanh Hải",
  },
];

// ── Mock Invoices ──────────────────────────────────────────────
export const invoices: Invoice[] = [
  {
    id: "inv-001",
    projectId: "proj-001",
    expenseId: "exp-001",
    vendor: "Công ty VLXD Hòa Phát",
    amount: 450_000_000,
    currency: "VND",
    date: "2025-10-15",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-002",
    projectId: "proj-001",
    expenseId: "exp-002",
    vendor: "Đội thi công Sơn Hà",
    amount: 300_000_000,
    currency: "VND",
    date: "2025-11-30",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-003",
    projectId: "proj-001",
    expenseId: "exp-003",
    vendor: "Nội thất Trường Học Việt",
    amount: 200_000_000,
    currency: "VND",
    date: "2026-01-10",
    autoGenerated: true,
    status: "verified",
  },
  {
    id: "inv-004",
    projectId: "proj-001",
    expenseId: "exp-004",
    vendor: "Vận tải Bắc Hà",
    amount: 250_000_000,
    currency: "VND",
    date: "2025-10-20",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-005",
    projectId: "proj-002",
    expenseId: "exp-005",
    vendor: "Hệ thống lọc nước Karofi Pro",
    amount: 350_000_000,
    currency: "VND",
    date: "2025-06-01",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-006",
    projectId: "proj-002",
    expenseId: "exp-006",
    vendor: "Xây dựng Thủy Lợi Tây Bắc",
    amount: 280_000_000,
    currency: "VND",
    date: "2025-08-15",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-007",
    projectId: "proj-002",
    expenseId: "exp-007",
    vendor: "Viện Kiểm Nghiệm Quốc Gia",
    amount: 150_000_000,
    currency: "VND",
    date: "2025-11-01",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-008",
    projectId: "proj-003",
    expenseId: "exp-008",
    vendor: "Thiết bị Y tế Medicon",
    amount: 250_000_000,
    currency: "VND",
    date: "2025-11-20",
    autoGenerated: true,
    status: "paid",
  },
  {
    id: "inv-009",
    projectId: "proj-003",
    expenseId: "exp-009",
    vendor: "Dược phẩm Hậu Giang",
    amount: 120_000_000,
    currency: "VND",
    date: "2025-12-05",
    autoGenerated: true,
    status: "verified",
  },
  {
    id: "inv-010",
    projectId: "proj-003",
    expenseId: "exp-010",
    vendor: "Dịch vụ Sự kiện Miền Trung",
    amount: 80_000_000,
    currency: "VND",
    date: "2026-01-15",
    autoGenerated: true,
    status: "pending",
  },
];

// ── Mock Progress Entries ──────────────────────────────────────
export const progressEntries: ProgressEntry[] = [
  {
    id: "prg-001",
    projectId: "proj-001",
    date: "2026-02-26",
    title: "Hoàn thành đổ mái tầng 2",
    description:
      "Đội thi công đã hoàn thành đổ bê tông mái tầng 2. Chất lượng bê tông đạt chuẩn M300. Dự kiến tháo ván khuôn sau 7 ngày.",
    completionPercent: 65,
  },
  {
    id: "prg-002",
    projectId: "proj-001",
    date: "2026-02-25",
    title: "Tiếp nhận vật liệu hoàn thiện",
    description:
      "Nhận đợt gạch ốp lát và sơn nước cho giai đoạn hoàn thiện. Kiểm tra đủ số lượng theo đơn hàng.",
    completionPercent: 63,
  },
  {
    id: "prg-003",
    projectId: "proj-001",
    date: "2026-02-24",
    title: "Lắp đặt hệ thống điện tầng 1",
    description:
      "Hoàn thành đi dây điện âm tường và lắp đặt bảng điện cho 4 phòng học tầng 1.",
    completionPercent: 60,
  },
  {
    id: "prg-004",
    projectId: "proj-001",
    date: "2026-02-23",
    title: "Xây tường ngăn phòng học tầng 2",
    description:
      "Thi công xây tường ngăn chia 4 phòng học tầng 2. Tiến độ đạt 100% theo kế hoạch ngày.",
    completionPercent: 58,
  },
  {
    id: "prg-005",
    projectId: "proj-003",
    date: "2026-02-26",
    title: "Khám bệnh miễn phí tại xã Quảng Ninh",
    description:
      "Đoàn y bác sĩ khám cho 150 người dân. Phát hiện 12 ca cần chuyển tuyến. Phát thuốc miễn phí cho toàn bộ bệnh nhân.",
    completionPercent: 35,
  },
  {
    id: "prg-006",
    projectId: "proj-003",
    date: "2026-02-25",
    title: "Chuẩn bị điểm khám tại xã Quảng Ninh",
    description:
      "Lắp đặt thiết bị y tế và bố trí khu vực khám tại trạm y tế xã. Kiểm tra máy siêu âm và các thiết bị đo.",
    completionPercent: 33,
  },
  {
    id: "prg-007",
    projectId: "proj-002",
    date: "2025-11-20",
    title: "Nghiệm thu và bàn giao hệ thống",
    description:
      "Hoàn thành nghiệm thu hệ thống nước sạch cho 5 bản. Nước đạt tiêu chuẩn QCVN 01:2009/BYT. Bàn giao cho cộng đồng quản lý.",
    completionPercent: 100,
  },
  {
    id: "prg-008",
    projectId: "proj-002",
    date: "2025-11-18",
    title: "Kiểm tra chất lượng nước cuối cùng",
    description:
      "Lấy mẫu nước tại 5 điểm đầu ra. Gửi Viện Kiểm Nghiệm phân tích. Tất cả chỉ tiêu đều đạt chuẩn.",
    completionPercent: 98,
  },
];

// ── Helper Functions ───────────────────────────────────────────
export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getDonationsByProject(projectId: string): Donation[] {
  return donations.filter((d) => d.projectId === projectId);
}

export function getExpensesByProject(projectId: string): Expense[] {
  return expenses.filter((e) => e.projectId === projectId);
}

export function getInvoicesByProject(projectId: string): Invoice[] {
  return invoices.filter((i) => i.projectId === projectId);
}

export function getProgressByProject(projectId: string): ProgressEntry[] {
  return progressEntries
    .filter((p) => p.projectId === projectId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFinancialSummary(): FinancialSummary {
  return {
    totalRaised: projects.reduce((sum, p) => sum + p.raised, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    currency: "VND",
  };
}
