import {
  Project,
  Donation,
  Expense,
  Invoice,
  ProgressEntry,
  FinancialSummary,
  Proposal,
  BankAccount,
  InterestRecord,
  FieldWorker,
  FieldReport,
  AnomalyAlert,
  AISuggestion,
  BidDocument,
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
    donor: { id: "d3", name: "Ẩn danh", anonymous: true, verificationCode: "CWL-AD-2025-X7K9" },
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
    donor: { id: "d9", name: "Ẩn danh", anonymous: true, verificationCode: "CWL-AD-2026-M3P5" },
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
    marketPrice: 430_000_000,
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
    marketPrice: 290_000_000,
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
    marketPrice: 180_000_000,
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
    marketPrice: 180_000_000,
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
    marketPrice: 340_000_000,
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
    marketPrice: 270_000_000,
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
    marketPrice: 145_000_000,
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
    marketPrice: 240_000_000,
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
    marketPrice: 115_000_000,
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
    marketPrice: 75_000_000,
  },
];

// ── Mock Invoices ──────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: "inv-001", projectId: "proj-001", expenseId: "exp-001", vendor: "Công ty VLXD Hòa Phát", amount: 450_000_000, currency: "VND", date: "2025-10-15", autoGenerated: true, status: "paid" },
  { id: "inv-002", projectId: "proj-001", expenseId: "exp-002", vendor: "Đội thi công Sơn Hà", amount: 300_000_000, currency: "VND", date: "2025-11-30", autoGenerated: true, status: "paid" },
  { id: "inv-003", projectId: "proj-001", expenseId: "exp-003", vendor: "Nội thất Trường Học Việt", amount: 200_000_000, currency: "VND", date: "2026-01-10", autoGenerated: true, status: "verified" },
  { id: "inv-004", projectId: "proj-001", expenseId: "exp-004", vendor: "Vận tải Bắc Hà", amount: 250_000_000, currency: "VND", date: "2025-10-20", autoGenerated: true, status: "paid" },
  { id: "inv-005", projectId: "proj-002", expenseId: "exp-005", vendor: "Hệ thống lọc nước Karofi Pro", amount: 350_000_000, currency: "VND", date: "2025-06-01", autoGenerated: true, status: "paid" },
  { id: "inv-006", projectId: "proj-002", expenseId: "exp-006", vendor: "Xây dựng Thủy Lợi Tây Bắc", amount: 280_000_000, currency: "VND", date: "2025-08-15", autoGenerated: true, status: "paid" },
  { id: "inv-007", projectId: "proj-002", expenseId: "exp-007", vendor: "Viện Kiểm Nghiệm Quốc Gia", amount: 150_000_000, currency: "VND", date: "2025-11-01", autoGenerated: true, status: "paid" },
  { id: "inv-008", projectId: "proj-003", expenseId: "exp-008", vendor: "Thiết bị Y tế Medicon", amount: 250_000_000, currency: "VND", date: "2025-11-20", autoGenerated: true, status: "paid" },
  { id: "inv-009", projectId: "proj-003", expenseId: "exp-009", vendor: "Dược phẩm Hậu Giang", amount: 120_000_000, currency: "VND", date: "2025-12-05", autoGenerated: true, status: "verified" },
  { id: "inv-010", projectId: "proj-003", expenseId: "exp-010", vendor: "Dịch vụ Sự kiện Miền Trung", amount: 80_000_000, currency: "VND", date: "2026-01-15", autoGenerated: true, status: "pending" },
];

// ── Mock Progress Entries ──────────────────────────────────────
export const progressEntries: ProgressEntry[] = [
  { id: "prg-001", projectId: "proj-001", date: "2026-02-26", title: "Hoàn thành đổ mái tầng 2", description: "Đội thi công đã hoàn thành đổ bê tông mái tầng 2. Chất lượng bê tông đạt chuẩn M300. Dự kiến tháo ván khuôn sau 7 ngày.", completionPercent: 65, author: "Trần Văn Hùng", role: "Giám sát hiện trường" },
  { id: "prg-002", projectId: "proj-001", date: "2026-02-25", title: "Tiếp nhận vật liệu hoàn thiện", description: "Nhận đợt gạch ốp lát và sơn nước cho giai đoạn hoàn thiện. Kiểm tra đủ số lượng theo đơn hàng.", completionPercent: 63, author: "Nguyễn Thị Lan", role: "Cộng tác viên" },
  { id: "prg-003", projectId: "proj-001", date: "2026-02-24", title: "Lắp đặt hệ thống điện tầng 1", description: "Hoàn thành đi dây điện âm tường và lắp đặt bảng điện cho 4 phòng học tầng 1.", completionPercent: 60, author: "Trần Văn Hùng", role: "Giám sát hiện trường" },
  { id: "prg-004", projectId: "proj-001", date: "2026-02-23", title: "Xây tường ngăn phòng học tầng 2", description: "Thi công xây tường ngăn chia 4 phòng học tầng 2. Tiến độ đạt 100% theo kế hoạch ngày.", completionPercent: 58, author: "Trần Văn Hùng", role: "Giám sát hiện trường" },
  { id: "prg-005", projectId: "proj-003", date: "2026-02-26", title: "Khám bệnh miễn phí tại xã Quảng Ninh", description: "Đoàn y bác sĩ khám cho 150 người dân. Phát hiện 12 ca cần chuyển tuyến. Phát thuốc miễn phí cho toàn bộ bệnh nhân.", completionPercent: 35, author: "BS. Lê Thanh Hải", role: "Trưởng đoàn y tế" },
  { id: "prg-006", projectId: "proj-003", date: "2026-02-25", title: "Chuẩn bị điểm khám tại xã Quảng Ninh", description: "Lắp đặt thiết bị y tế và bố trí khu vực khám tại trạm y tế xã. Kiểm tra máy siêu âm và các thiết bị đo.", completionPercent: 33, author: "Phạm Minh Đức", role: "Cộng tác viên" },
  { id: "prg-007", projectId: "proj-002", date: "2025-11-20", title: "Nghiệm thu và bàn giao hệ thống", description: "Hoàn thành nghiệm thu hệ thống nước sạch cho 5 bản. Nước đạt tiêu chuẩn QCVN 01:2009/BYT. Bàn giao cho cộng đồng quản lý.", completionPercent: 100, author: "Phạm Văn Đức", role: "Quản lý dự án" },
  { id: "prg-008", projectId: "proj-002", date: "2025-11-18", title: "Kiểm tra chất lượng nước cuối cùng", description: "Lấy mẫu nước tại 5 điểm đầu ra. Gửi Viện Kiểm Nghiệm phân tích. Tất cả chỉ tiêu đều đạt chuẩn.", completionPercent: 98, author: "Phạm Văn Đức", role: "Quản lý dự án" },
];

// ── Mock Proposals ─────────────────────────────────────────────
export const proposals: Proposal[] = [
  {
    id: "prop-001",
    title: "Cầu Treo Cho Bản Xa",
    description: "Xây cầu treo bắc qua suối Nậm Pồ giúp 300 hộ dân bản Xa Phìn (Điện Biên) không phải lội suối mùa lũ. Cầu dài 45m, tải trọng 5 tấn, tuổi thọ thiết kế 30 năm.",
    category: "Hạ tầng",
    location: "Điện Biên",
    estimatedBudget: 1_200_000_000,
    currency: "VND",
    proposedBy: "Nguyễn Thanh Sơn",
    createdDate: "2026-02-10",
    status: "open",
    votesFor: 342,
    votesAgainst: 18,
  },
  {
    id: "prop-002",
    title: "Lớp Học Tin Học Vùng Sâu",
    description: "Trang bị 20 bộ máy tính và kết nối internet vệ tinh cho trường THCS xã Tà Xùa (Sơn La). Tổ chức lớp học tin học miễn phí cho 200 em học sinh.",
    category: "Giáo dục",
    location: "Sơn La",
    estimatedBudget: 350_000_000,
    currency: "VND",
    proposedBy: "Trần Minh Quân",
    createdDate: "2026-02-15",
    status: "open",
    votesFor: 528,
    votesAgainst: 12,
  },
  {
    id: "prop-003",
    title: "Nhà Vệ Sinh Trường Học",
    description: "Xây 10 nhà vệ sinh đạt chuẩn cho 5 trường tiểu học tại huyện Mường Nhé, thay thế hệ thống cũ đã xuống cấp nghiêm trọng.",
    category: "Giáo dục",
    location: "Điện Biên",
    estimatedBudget: 600_000_000,
    currency: "VND",
    proposedBy: "Lê Thị Hương",
    createdDate: "2026-01-20",
    status: "approved",
    votesFor: 891,
    votesAgainst: 23,
    linkedProjectId: "proj-004",
  },
  {
    id: "prop-004",
    title: "Xe Cứu Thương Cộng Đồng",
    description: "Mua 1 xe cứu thương chuyên dụng phục vụ vận chuyển cấp cứu cho cụm 8 xã vùng cao tại Lào Cai, nơi cách bệnh viện huyện hơn 60km đường núi.",
    category: "Y tế",
    location: "Lào Cai",
    estimatedBudget: 900_000_000,
    currency: "VND",
    proposedBy: "BS. Phạm Văn Khánh",
    createdDate: "2026-02-01",
    status: "open",
    votesFor: 215,
    votesAgainst: 45,
  },
  {
    id: "prop-005",
    title: "Vườn Rau Sạch Trường Nội Trú",
    description: "Thiết lập hệ thống vườn rau thủy canh cho 3 trường nội trú tại Gia Lai, cải thiện dinh dưỡng cho 500 học sinh dân tộc thiểu số.",
    category: "Dinh dưỡng",
    location: "Gia Lai",
    estimatedBudget: 200_000_000,
    currency: "VND",
    proposedBy: "Hoàng Thị Mai",
    createdDate: "2026-02-20",
    status: "open",
    votesFor: 178,
    votesAgainst: 8,
  },
];

// ── Mock Bank Accounts ─────────────────────────────────────────
export const bankAccounts: BankAccount[] = [
  {
    id: "acc-001",
    bankName: "Vietcombank",
    accountNumber: "****6789",
    accountType: "Tài khoản thanh toán",
    balance: 1_250_000_000,
    currency: "VND",
    interestRate: 0.2,
  },
  {
    id: "acc-002",
    bankName: "Techcombank",
    accountNumber: "****4321",
    accountType: "Tiết kiệm có kỳ hạn 6 tháng",
    balance: 2_000_000_000,
    currency: "VND",
    interestRate: 4.8,
  },
  {
    id: "acc-003",
    bankName: "BIDV",
    accountNumber: "****8765",
    accountType: "Tài khoản thanh toán",
    balance: 620_000_000,
    currency: "VND",
    interestRate: 0.1,
  },
  {
    id: "acc-004",
    bankName: "TienPhong Bank (TPBank)",
    accountNumber: "****2468",
    accountType: "Tiết kiệm online 3 tháng",
    balance: 800_000_000,
    currency: "VND",
    interestRate: 4.4,
  },
];

// ── Mock Interest Records ──────────────────────────────────────
export const interestRecords: InterestRecord[] = [
  { id: "int-001", accountId: "acc-001", month: "2025-10", openingBalance: 1_100_000_000, interestEarned: 183_333, closingBalance: 1_100_183_333 },
  { id: "int-002", accountId: "acc-001", month: "2025-11", openingBalance: 1_100_183_333, interestEarned: 183_364, closingBalance: 1_100_366_697 },
  { id: "int-003", accountId: "acc-001", month: "2025-12", openingBalance: 1_200_366_697, interestEarned: 200_061, closingBalance: 1_200_566_758 },
  { id: "int-004", accountId: "acc-001", month: "2026-01", openingBalance: 1_200_566_758, interestEarned: 200_094, closingBalance: 1_200_766_852 },
  { id: "int-005", accountId: "acc-001", month: "2026-02", openingBalance: 1_250_000_000, interestEarned: 208_333, closingBalance: 1_250_208_333 },
  { id: "int-006", accountId: "acc-002", month: "2025-10", openingBalance: 2_000_000_000, interestEarned: 8_000_000, closingBalance: 2_008_000_000 },
  { id: "int-007", accountId: "acc-002", month: "2025-11", openingBalance: 2_008_000_000, interestEarned: 8_032_000, closingBalance: 2_016_032_000 },
  { id: "int-008", accountId: "acc-002", month: "2025-12", openingBalance: 2_016_032_000, interestEarned: 8_064_128, closingBalance: 2_024_096_128 },
  { id: "int-009", accountId: "acc-002", month: "2026-01", openingBalance: 2_024_096_128, interestEarned: 8_096_384, closingBalance: 2_032_192_512 },
  { id: "int-010", accountId: "acc-002", month: "2026-02", openingBalance: 2_000_000_000, interestEarned: 8_000_000, closingBalance: 2_008_000_000 },
  { id: "int-011", accountId: "acc-003", month: "2025-10", openingBalance: 500_000_000, interestEarned: 41_667, closingBalance: 500_041_667 },
  { id: "int-012", accountId: "acc-003", month: "2025-11", openingBalance: 500_041_667, interestEarned: 41_670, closingBalance: 500_083_337 },
  { id: "int-013", accountId: "acc-003", month: "2025-12", openingBalance: 600_083_337, interestEarned: 50_007, closingBalance: 600_133_344 },
  { id: "int-014", accountId: "acc-003", month: "2026-01", openingBalance: 600_133_344, interestEarned: 50_011, closingBalance: 600_183_355 },
  { id: "int-015", accountId: "acc-003", month: "2026-02", openingBalance: 620_000_000, interestEarned: 51_667, closingBalance: 620_051_667 },
  { id: "int-016", accountId: "acc-004", month: "2025-10", openingBalance: 800_000_000, interestEarned: 2_933_333, closingBalance: 802_933_333 },
  { id: "int-017", accountId: "acc-004", month: "2025-11", openingBalance: 802_933_333, interestEarned: 2_944_089, closingBalance: 805_877_422 },
  { id: "int-018", accountId: "acc-004", month: "2025-12", openingBalance: 805_877_422, interestEarned: 2_954_884, closingBalance: 808_832_306 },
  { id: "int-019", accountId: "acc-004", month: "2026-01", openingBalance: 808_832_306, interestEarned: 2_965_718, closingBalance: 811_798_024 },
  { id: "int-020", accountId: "acc-004", month: "2026-02", openingBalance: 800_000_000, interestEarned: 2_933_333, closingBalance: 802_933_333 },
];

// ── Mock Field Workers ─────────────────────────────────────────
export const fieldWorkers: FieldWorker[] = [
  { id: "fw-001", name: "Trần Văn Hùng", role: "field_worker", assignedProjects: ["proj-001"], email: "hung.tv@cwl.org", phone: "0912***456" },
  { id: "fw-002", name: "Nguyễn Thị Lan", role: "field_worker", assignedProjects: ["proj-001"], email: "lan.nt@cwl.org", phone: "0983***789" },
  { id: "fw-003", name: "Phạm Minh Đức", role: "field_worker", assignedProjects: ["proj-003"], email: "duc.pm@cwl.org", phone: "0977***123" },
  { id: "fw-004", name: "Nguyễn Minh Tuấn", role: "admin", assignedProjects: ["proj-001", "proj-002"], email: "tuan.nm@cwl.org", phone: "0901***567" },
  { id: "fw-005", name: "BS. Lê Thanh Hải", role: "admin", assignedProjects: ["proj-003"], email: "hai.lt@cwl.org", phone: "0945***890" },
  { id: "fw-006", name: "Vũ Quang Minh", role: "auditor", assignedProjects: ["proj-001", "proj-002", "proj-003"], email: "minh.vq@cwl.org", phone: "0966***234" },
];

// ── Mock Field Reports ─────────────────────────────────────────
export const fieldReports: FieldReport[] = [
  { id: "fr-001", projectId: "proj-001", workerId: "fw-001", date: "2026-02-26", type: "progress", title: "Đổ bê tông mái tầng 2 hoàn thành", description: "Hoàn thành đổ bê tông mái. Ảnh chụp tại hiện trường kèm theo.", imageUrls: ["/uploads/fr-001-1.jpg", "/uploads/fr-001-2.jpg"], status: "approved" },
  { id: "fr-002", projectId: "proj-001", workerId: "fw-002", date: "2026-02-25", type: "invoice", title: "Hóa đơn gạch ốp lát", description: "Số hóa hóa đơn mua gạch ốp lát từ nhà cung cấp. Đã kiểm tra số lượng khớp đơn hàng.", imageUrls: ["/uploads/fr-002-1.jpg"], invoiceAmount: 85_000_000, status: "reviewed" },
  { id: "fr-003", projectId: "proj-003", workerId: "fw-003", date: "2026-02-26", type: "progress", title: "Khám bệnh xã Quảng Ninh", description: "150 ca khám, 12 ca chuyển tuyến. Đã phát thuốc cho toàn bộ bệnh nhân.", imageUrls: ["/uploads/fr-003-1.jpg", "/uploads/fr-003-2.jpg", "/uploads/fr-003-3.jpg"], status: "submitted" },
  { id: "fr-004", projectId: "proj-001", workerId: "fw-001", date: "2026-02-24", type: "issue", title: "Phát hiện vết nứt nhỏ tường tầng 1", description: "Phát hiện vết nứt chân chim tại tường phòng 3, tầng 1. Đã chụp ảnh và báo cáo kỹ sư xử lý.", imageUrls: ["/uploads/fr-004-1.jpg"], status: "approved" },
  { id: "fr-005", projectId: "proj-003", workerId: "fw-003", date: "2026-02-25", type: "invoice", title: "Hóa đơn thuê địa điểm khám", description: "Chi phí thuê mặt bằng và điện nước cho điểm khám tại trạm y tế xã.", imageUrls: ["/uploads/fr-005-1.jpg"], invoiceAmount: 15_000_000, status: "submitted" },
];

// ── Mock Anomaly Alerts ────────────────────────────────────────
export const anomalyAlerts: AnomalyAlert[] = [
  {
    id: "alert-001",
    projectId: "proj-001",
    type: "price_anomaly",
    severity: "high",
    title: "Chi phí vận chuyển cao hơn 39% so với thị trường",
    description: "Khoản chi 'Vận chuyển vật liệu lên vùng cao' có giá 250.000.000₫, trong khi giá thị trường tham chiếu là 180.000.000₫. Chênh lệch 70.000.000₫ (39%).",
    suggestion: "Xác minh chi phí vận chuyển có bao gồm phụ phí đường khó và bốc xếp tại vùng cao không. Nếu không, đề nghị đàm phán lại hoặc tìm nhà cung cấp thay thế.",
    detectedDate: "2025-10-22",
    relatedExpenseId: "exp-004",
    marketReference: 180_000_000,
    actualAmount: 250_000_000,
    dismissed: false,
  },
  {
    id: "alert-002",
    projectId: "proj-001",
    type: "price_anomaly",
    severity: "medium",
    title: "Thiết bị lớp học cao hơn 11% so với giá tham chiếu",
    description: "Khoản chi 'Mua bàn ghế và thiết bị lớp học' có giá 200.000.000₫, giá thị trường khoảng 180.000.000₫. Chênh lệch 20.000.000₫ (11%).",
    suggestion: "Mức chênh lệch trong ngưỡng chấp nhận cho vùng cao. Kiểm tra chi phí vận chuyển có được tính riêng không.",
    detectedDate: "2026-01-12",
    relatedExpenseId: "exp-003",
    marketReference: 180_000_000,
    actualAmount: 200_000_000,
    dismissed: false,
  },
  {
    id: "alert-003",
    projectId: "proj-003",
    type: "spending_pattern",
    severity: "low",
    title: "Tỷ lệ giải ngân thấp so với tiến độ",
    description: "Dự án đã giải ngân 49% ngân sách nhưng tiến độ chỉ đạt 35%. Cần theo dõi tỷ lệ này trong các tháng tới.",
    suggestion: "Đánh giá lại kế hoạch chi tiêu theo từng giai đoạn. Xem xét liệu chi phí thiết bị ban đầu có chiếm tỷ trọng lớn hay không.",
    detectedDate: "2026-02-20",
    dismissed: false,
  },
  {
    id: "alert-004",
    projectId: "proj-001",
    type: "timeline_delay",
    severity: "medium",
    title: "Tiến độ chậm 5% so với kế hoạch",
    description: "Theo kế hoạch, dự án phải đạt 70% vào thời điểm này, nhưng thực tế chỉ đạt 65%. Chênh lệch 5 điểm phần trăm.",
    suggestion: "Tăng cường nhân lực hoặc điều chỉnh lịch thi công trong 2 tháng tới để bù đắp. Xem xét làm việc cuối tuần nếu thời tiết cho phép.",
    detectedDate: "2026-02-26",
    dismissed: false,
  },
];

// ── Mock AI Suggestions ────────────────────────────────────────
export const aiSuggestions: AISuggestion[] = [
  {
    id: "sug-001",
    projectId: "proj-001",
    title: "Mua vật liệu đợt 2 theo lô lớn",
    description: "Dựa trên dữ liệu giá thị trường, việc đặt mua xi măng và sắt thép theo lô lớn (>50 tấn) từ nhà máy có thể tiết kiệm 8-12% so với mua lẻ qua đại lý.",
    potentialSaving: 35_000_000,
    category: "Tối ưu chi phí",
    createdDate: "2026-02-20",
  },
  {
    id: "sug-002",
    projectId: "proj-003",
    title: "Liên hệ hãng dược phẩm để tài trợ thuốc",
    description: "Nhiều hãng dược có chương trình CSR cung cấp thuốc miễn phí cho đoàn khám từ thiện. Có thể tiết kiệm 30-50% chi phí thuốc men cho các đợt khám tiếp theo.",
    potentialSaving: 50_000_000,
    category: "Tìm nguồn tài trợ",
    createdDate: "2026-02-22",
  },
  {
    id: "sug-003",
    projectId: "proj-001",
    title: "Kết hợp vận chuyển với dự án lân cận",
    description: "Có 2 dự án xây dựng khác tại Hà Giang đang triển khai. Kết hợp vận chuyển vật liệu chung có thể giảm 25-30% chi phí logistics.",
    potentialSaving: 60_000_000,
    category: "Tối ưu logistics",
    createdDate: "2026-02-25",
  },
];

// ── Mock Bid Documents ─────────────────────────────────────────
export const bidDocuments: BidDocument[] = [
  {
    projectId: "proj-001",
    technicalStandards: [
      "TCVN 5574:2018 - Kết cấu bê tông và bê tông cốt thép",
      "TCVN 2737:2023 - Tải trọng và tác động",
      "TCVN 9386:2012 - Thiết kế công trình chịu động đất",
      "QCVN 06:2022/BXD - An toàn cháy cho nhà và công trình",
      "TCVN 9377-1:2012 - Công tác hoàn thiện trong xây dựng",
    ],
    items: [
      { id: "bid-001", name: "Móng cọc BTCT", unit: "m", quantity: 120, unitPrice: 2_500_000, totalPrice: 300_000_000, specification: "Cọc BTCT 250x250mm, dài 8m, M300" },
      { id: "bid-002", name: "Bê tông cột, dầm, sàn", unit: "m³", quantity: 180, unitPrice: 1_800_000, totalPrice: 324_000_000, specification: "Bê tông M300, cốt thép CB400V" },
      { id: "bid-003", name: "Tường xây gạch", unit: "m²", quantity: 850, unitPrice: 350_000, totalPrice: 297_500_000, specification: "Gạch ống 8x8x19, vữa M75" },
      { id: "bid-004", name: "Mái lợp tôn chống nóng", unit: "m²", quantity: 420, unitPrice: 280_000, totalPrice: 117_600_000, specification: "Tôn Hoa Sen 3 lớp cách nhiệt, dày 0.45mm" },
      { id: "bid-005", name: "Hệ thống điện", unit: "phòng", quantity: 8, unitPrice: 25_000_000, totalPrice: 200_000_000, specification: "Dây Cadivi 2.5mm², CB Schneider, đèn LED Rạng Đông" },
      { id: "bid-006", name: "Cửa sổ nhôm kính", unit: "bộ", quantity: 24, unitPrice: 4_500_000, totalPrice: 108_000_000, specification: "Nhôm Xingfa, kính 2 lớp 5mm" },
      { id: "bid-007", name: "Bàn ghế học sinh", unit: "bộ", quantity: 160, unitPrice: 850_000, totalPrice: 136_000_000, specification: "Bàn ghế liền khung thép sơn tĩnh điện, mặt gỗ MDF" },
      { id: "bid-008", name: "Sơn nước nội ngoại thất", unit: "m²", quantity: 2200, unitPrice: 65_000, totalPrice: 143_000_000, specification: "Sơn Dulux Weathershield (ngoài), Inspire (trong)" },
      { id: "bid-009", name: "Nhà vệ sinh + nước", unit: "khối", quantity: 2, unitPrice: 75_000_000, totalPrice: 150_000_000, specification: "Thiết bị TOTO, ống PPR Vesbo, bể phốt composite" },
      { id: "bid-010", name: "Sân + cổng + hàng rào", unit: "gói", quantity: 1, unitPrice: 223_900_000, totalPrice: 223_900_000, specification: "Sân bê tông M200 dày 15cm, cổng sắt, rào lưới B40" },
    ],
    totalEstimate: 2_000_000_000,
    approvedDate: "2025-08-15",
    publicReviewDeadline: "2025-08-01",
  },
  {
    projectId: "proj-003",
    technicalStandards: [
      "TCVN 7303:2003 - Thiết bị y tế - Yêu cầu chung về an toàn",
      "Thông tư 39/2016/TT-BYT - Danh mục trang thiết bị y tế",
      "QCVN 21:2016/BYT - Điều kiện bảo quản thuốc",
      "Nghị định 36/2016/NĐ-CP - Quản lý trang thiết bị y tế",
    ],
    items: [
      { id: "bid-101", name: "Máy siêu âm xách tay", unit: "bộ", quantity: 2, unitPrice: 85_000_000, totalPrice: 170_000_000, specification: "Máy siêu âm 2D/3D, đầu dò convex & linear, Mindray DP-50" },
      { id: "bid-102", name: "Máy đo huyết áp điện tử", unit: "cái", quantity: 10, unitPrice: 2_000_000, totalPrice: 20_000_000, specification: "Omron HEM-7156, đo bắp tay tự động" },
      { id: "bid-103", name: "Máy đo đường huyết", unit: "bộ", quantity: 5, unitPrice: 5_000_000, totalPrice: 25_000_000, specification: "Accu-Chek Active, kèm 200 que thử/bộ" },
      { id: "bid-104", name: "Bộ dụng cụ khám tổng quát", unit: "bộ", quantity: 5, unitPrice: 7_000_000, totalPrice: 35_000_000, specification: "Ống nghe Littmann, đèn soi tai, búa phản xạ, nhiệt kế" },
      { id: "bid-105", name: "Thuốc điều trị cơ bản", unit: "lô", quantity: 5, unitPrice: 24_000_000, totalPrice: 120_000_000, specification: "Thuốc hạ sốt, kháng sinh, tiêu hóa, huyết áp - theo DM BYT" },
      { id: "bid-106", name: "Vật tư tiêu hao y tế", unit: "lô", quantity: 5, unitPrice: 6_000_000, totalPrice: 30_000_000, specification: "Găng tay, bông băng, kim tiêm, dịch truyền" },
      { id: "bid-107", name: "Chi phí di chuyển đoàn", unit: "đợt", quantity: 5, unitPrice: 15_000_000, totalPrice: 75_000_000, specification: "Thuê xe 16 chỗ + xăng dầu, 5 đợt khám tại 5 xã" },
      { id: "bid-108", name: "Ăn ở đoàn y tế", unit: "đợt", quantity: 5, unitPrice: 5_000_000, totalPrice: 25_000_000, specification: "Bố trí nhà dân hoặc nhà khách xã, 3 ngày/đợt, 10 người/đợt" },
    ],
    totalEstimate: 500_000_000,
    approvedDate: "2025-10-20",
    publicReviewDeadline: "2025-10-10",
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

export function getBidDocument(projectId: string): BidDocument | undefined {
  return bidDocuments.find((b) => b.projectId === projectId);
}

export function getAnomalyAlertsByProject(projectId: string): AnomalyAlert[] {
  return anomalyAlerts.filter((a) => a.projectId === projectId);
}

export function getFieldReportsByProject(projectId: string): FieldReport[] {
  return fieldReports.filter((r) => r.projectId === projectId);
}

export function verifyDonorCode(code: string): Donation | undefined {
  return donations.find(
    (d) =>
      d.donor.anonymous &&
      d.donor.verificationCode?.toUpperCase() === code.toUpperCase()
  );
}

export function getTotalInterestEarned(): number {
  return interestRecords.reduce((sum, r) => sum + r.interestEarned, 0);
}
