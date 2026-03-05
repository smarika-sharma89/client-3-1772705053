import { useState, useEffect } from "react";

const APPROVERS = ["Sarah Mitchell", "James Thornton", "David Okafor", "Linda Patel"];

const PHASES = [
  { id: 1, label: "Phase 1 – Site Review" },
  { id: 2, label: "Phase 2 – Finance Review" },
  { id: 3, label: "Phase 3 – Final Approval" },
];

function getPhaseStatus(bill) {
  const p1 = bill.approvals[0];
  const p2 = bill.approvals[1];
  const p3 = bill.approvals[2];
  if (p3.approved) return { label: "Fully Approved", color: "bg-emerald-100 text-emerald-800", phase: 3 };
  if (p3.required && !p3.approved && p2.approved) return { label: "Final Approval Required", color: "bg-orange-100 text-orange-800", phase: 3 };
  if (p2.required && !p2.approved && p1.approved) return { label: "Partially Approved – Phase 2 Pending", color: "bg-yellow-100 text-yellow-800", phase: 2 };
  if (!p1.approved) return { label: "Awaiting Approval", color: "bg-sky-100 text-sky-800", phase: 1 };
  return { label: "In Progress", color: "bg-gray-100 text-gray-700", phase: 1 };
}

const INITIAL_BILLS = [
  {
    id: "BILL-001",
    supplier: "Apex Civil Contractors",
    description: "Earthworks – Stage 3A",
    amount: 48200.0,
    gst: 4820.0,
    gstOverride: null,
    wbs: "WBS-3A-EARTH",
    xeroStatus: "Synced",
    xeroError: null,
    approvals: [
      { phase: 1, approver: "Sarah Mitchell", approved: true, date: "2024-05-10", note: "" },
      { phase: 2, approver: "James Thornton", approved: true, date: "2024-05-12", note: "" },
      { phase: 3, approver: "David Okafor", required: true, approved: false, date: null, note: "" },
    ],
    auditLog: [
      { ts: "2024-05-10 09:15", user: "Sarah Mitchell", action: "Approved – Phase 1", note: "" },
      { ts: "2024-05-12 14:30", user: "James Thornton", action: "Approved – Phase 2", note: "" },
    ],
  },
  {
    id: "BILL-002",
    supplier: "Bridgewater Electrical",
    description: "Temporary Power Supply – Main Site",
    amount: 12750.0,
    gst: 1275.0,
    gstOverride: null,
    wbs: "WBS-1B-ELEC",
    xeroStatus: "Error",
    xeroError: "Duplicate invoice reference detected in Xero",
    approvals: [
      { phase: 1, approver: "Sarah Mitchell", approved: true, date: "2024-05-08", note: "" },
      { phase: 2, approver: "James Thornton", approved: false, date: null, note: "" },
      { phase: 3, approver: "Linda Patel", required: true, approved: false, date: null, note: "" },
    ],
    auditLog: [
      { ts: "2024-05-08 11:00", user: "Sarah Mitchell", action: "Approved – Phase 1", note: "" },
    ],
  },
  {
    id: "BILL-003",
    supplier: "Summit Steel Fabrication",
    description: "Structural Steel – Footbridge",
    amount: 93400.0,
    gst: 9340.0,
    gstOverride: null,
    wbs: "WBS-2C-STEEL",
    xeroStatus: "Pending",
    xeroError: null,
    approvals: [
      { phase: 1, approver: "David Okafor", approved: false, date: null, note: "" },
      { phase: 2, approver: "James Thornton", approved: false, date: null, note: "" },
      { phase: 3, approver: "Linda Patel", required: true, approved: false, date: null, note: "" },
    ],
    auditLog: [],
  },
  {
    id: "BILL-004",
    supplier: "NorthWest Concrete",
    description: "Concrete Pour – Slab Zone B",
    amount: 31800.0,
    gst: 3180.0,
    gstOverride: null,
    wbs: "WBS-4D-CONC",
    xeroStatus: "Synced",
    xeroError: null,
    approvals: [
      { phase: 1, approver: "Linda Patel", approved: true, date: "2024-05-01", note: "" },
      { phase: 2, approver: "James Thornton", approved: true, date: "2024-05-03", note: "" },
      { phase: 3, approver: "David Okafor", required: true, approved: true, date: "2024-05-05", note: "" },
    ],
    auditLog: [
      { ts: "2024-05-01 08:45", user: "Linda Patel", action: "Approved – Phase 1", note: "" },
      { ts: "2024-05-03 13:00", user: "James Thornton", action: "Approved – Phase 2", note: "" },
      { ts: "2024-05-05 16:20", user: "David Okafor", action: "Approved – Phase 3 (Final)", note: "" },
    ],
  },
  {
    id: "BILL-005",
    supplier: "Urban Geotechnics",
    description: "Soil Testing – Northern Corridor",
    amount: 7600.0,
    gst: 760.0,
    gstOverride: null,
    wbs: "WBS-1A-GEO",
    xeroStatus: "Pending",
    xeroError: null,
    approvals: [
      { phase: 1, approver: "Sarah Mitchell", approved: true, date: "2024-05-14", note: "" },
      { phase: 2, approver: "David Okafor", approved: false, date: null, note: "" },
      { phase: 3, approver: "Linda Patel", required: true, approved: false, date: null, note: "" },
    ],
    auditLog: [
      { ts: "2024-05-14 10:30", user: "Sarah Mitchell", action: "Approved – Phase 1", note: "" },
    ],
  },
];

const DAY_WORKS_DOCKETS = [
  {
    id: "DW-2024-041",
    date: "2024-05-13",
    description: "Emergency drainage repair – southern access road",
    submittedBy: "Tom Hargreaves",
    labour: [
      { role: "Site Supervisor", hours: 4, rate: 95 },
      { role: "Plant Operator", hours: 8, rate: 78 },
      { role: "General Labourer", hours: 16, rate: 55 },
    ],
    plant: [
      { item: "Excavator 20T", hours: 6, rate: 185 },
      { item: "Tipper Truck", hours: 4, rate: 120 },
    ],
    materials: [
      { item: "Drainage pipe 300mm", qty: 12, unit: "m", rate: 45 },
      { item: "Aggregate backfill", qty: 4, unit: "tonne", rate: 60 },
    ],
    internalNotes: [
      { ts: "2024-05-14 09:00", user: "Sarah Mitchell", note: "Rates verified against contract schedule. No discrepancies." },
    ],
  },
];

const CHARGE_RATES = [
  { role: "Site Supervisor", unit: "hr", rate: 95, lastUpdated: "2024-04-01", updatedBy: "Linda Patel" },
  { role: "Plant Operator", unit: "hr", rate: 78, lastUpdated: "2024-04-01", updatedBy: "Linda Patel" },
  { role: "General Labourer", unit: "hr", rate: 55, lastUpdated: "2024-03-15", updatedBy: "James Thornton" },
  { role: "Excavator 20T", unit: "hr", rate: 185, lastUpdated: "2024-04-01", updatedBy: "Linda Patel" },
  { role: "Tipper Truck", unit: "hr", rate: 120, lastUpdated: "2024-03-15", updatedBy: "James Thornton" },
  { role: "Surveyor", unit: "hr", rate: 110, lastUpdated: "2024-02-20", updatedBy: "Sarah Mitchell" },
];

function fmtCurrency(n) {
  return "$" + Number(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ApprovalPhaseBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
      {status.label}
    </span>
  );
}

function XeroBadge({ status, error }) {
  const map = {
    Synced: "bg-emerald-100 text-emerald-800",
    Error: "bg-red-100 text-red-800",
    Pending: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status === "Synced" && <span>✓</span>}
      {status === "Error" && <span>✕</span>}
      {status === "Pending" && <span>⏳</span>}
      Xero: {status}
    </span>
  );
}

function PhaseProgress({ approvals, currentPhase }) {
  return (
    <div className="flex items-center gap-1">
      {approvals.map((a, i) => {
        const isActive = i + 1 === currentPhase;
        const isDone = a.approved;
        return (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : isActive ? "bg-sky-500 border-sky-500 text-white animate-pulse" : "bg-white border-gray-300 text-gray-400"}`}
            >
              {isDone ? "✓" : i + 1}
            </div>
            {i < approvals.length - 1 && (
              <div className={`w-6 h-0.5 ${isDone ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApproverChips({ approvals }) {
  return (
    <div className="flex flex-wrap gap-1">
      {approvals.map((a, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border
            ${a.approved ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
          title={a.approved ? `Approved ${a.date}` : "Pending"}
        >
          {a.approved ? "✓" : "○"} {a.approver}
        </span>
      ))}
    </div>
  );
}

export default function BillApprovalVisibility() {
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filterApprover, setFilterApprover] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeTab, setActiveTab] = useState("bills");
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstEditValue, setGstEditValue] = useState("");
  const [showWbsModal, setShowWbsModal] = useState(false);
  const [wbsCopyValue, setWbsCopyValue] = useState("");
  const [selectedDocket, setSelectedDocket] = useState(DAY_WORKS_DOCKETS[0]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteUser, setNoteUser] = useState("Sarah Mitchell");
  const [dockets, setDockets] = useState(DAY_WORKS_DOCKETS);
  const [chargeRates, setChargeRates] = useState(CHARGE_RATES);
  const [editRateIdx, setEditRateIdx] = useState(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [xeroSyncing, setXeroSyncing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lostTimeEntries] = useState([
    { id: "LT-001", date: "2024-05-09", duration: "3h", reason: "Wet weather – rain event", bill: "BILL-001", cost: 2100 },
    { id: "LT-002", date: "2024-05-11", duration: "1.5h", reason: "Equipment breakdown – excavator", bill: "BILL-003", cost: 840 },
    { id: "LT-003", date: "2024-05-13", duration: "4h", reason: "Utility strike – work halted", bill: "BILL-002", cost: 3200 },
  ]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredBills = bills.filter((b) => {
    const status = getPhaseStatus(b);
    if (filterApprover) {
      const hasApprover = b.approvals.some((a) => a.approver === filterApprover);
      if (!hasApprover) return false;
    }
    if (filterPhase) {
      if (String(status.phase) !== filterPhase) return false;
    }
    if (filterStatus) {
      if (status.label !== filterStatus) return false;
    }
    return true;
  });

  const handleApprove = (billId, phaseIdx) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        const newApprovals = b.approvals.map((a, i) =>
          i === phaseIdx ? { ...a, approved: true, date: new Date().toISOString().split("T")[0] } : a
        );
        const newLog = [
          ...b.auditLog,
          {
            ts: new Date().toLocaleString("en-AU"),
            user: b.approvals[phaseIdx].approver,
            action: `Approved – Phase ${phaseIdx + 1}`,
            note: "",
          },
        ];
        return { ...b, approvals: newApprovals, auditLog: newLog };
      })
    );
    setSelectedBill((prev) => {
      if (!prev || prev.id !== billId) return prev;
      const updated = bills.find((b) => b.id === billId);
      if (!updated) return prev;
      const newApprovals = updated.approvals.map((a, i) =>
        i === phaseIdx ? { ...a, approved: true, date: new Date().toISOString().split("T")[0] } : a
      );
      return { ...updated, approvals: newApprovals };
    });
    showNotif(`Phase ${phaseIdx + 1} approval recorded successfully.`);
  };

  const handleGstSave = () => {
    const val = parseFloat(gstEditValue);
    if (isNaN(val) || val < 0) {
      showNotif("Please enter a valid GST amount.", "error");
      return;
    }
    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id
          ? { ...b, gstOverride: val, auditLog: [...b.auditLog, { ts: new Date().toLocaleString("en-AU"), user: "Current User", action: `GST adjusted to ${fmtCurrency(val)}`, note: "" }] }
          : b
      )
    );
    setShowGstModal(false);
    showNotif("GST amount updated successfully.");
  };

  const handleWbsCopy = () => {
    if (!wbsCopyValue.trim()) {
      showNotif("Please enter a WBS code.", "error");
      return;
    }
    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id
          ? { ...b, wbs: wbsCopyValue.trim(), auditLog: [...b.auditLog, { ts: new Date().toLocaleString("en-AU"), user: "Current User", action: `WBS updated to ${wbsCopyValue.trim()} (bulk copy)`, note: "" }] }
          : b
      )
    );
    setShowWbsModal(false);
    showNotif("WBS code applied to all bill lines.");
  };

  const handleXeroSync = (billId) => {
    setXeroSyncing(true);
    setTimeout(() => {
      const bill = bills.find((b) => b.id === billId);
      const willFail = bill?.xeroStatus === "Error";
      setBills((prev) =>
        prev.map((b) =>
          b.id === billId
            ? {
                ...b,
                xeroStatus: willFail ? "Error" : "Synced",
                xeroError: willFail ? "Duplicate invoice reference detected in Xero" : null,
                auditLog: [
                  ...b.auditLog,
                  {
                    ts: new Date().toLocaleString("en-AU"),
                    user: "System",
                    action: willFail ? "Xero sync failed – Duplicate invoice reference" : "Xero sync successful",
                    note: "",
                  },
                ],
              }
            : b
        )
      );
      setXeroSyncing(false);
      if (willFail) {
        showNotif("Xero sync failed: Duplicate invoice reference detected.", "error");
      } else {
        showNotif("Bill successfully synced to Xero.");
      }
    }, 1800);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      showNotif("Please enter a note.", "error");
      return;
    }
    const newEntry = {
      ts: new Date().toLocaleString("en-AU"),
      user: noteUser,
      note: noteText.trim(),
    };
    setDockets((prev) =>
      prev.map((d) =>
        d.id === selectedDocket.id ? { ...d, internalNotes: [...d.internalNotes, newEntry] } : d
      )
    );
    setSelectedDocket((prev) => ({ ...prev, internalNotes: [...prev.internalNotes, newEntry] }));
    setNoteText("");
    setShowNoteModal(false);
    showNotif("Internal note added to audit log. Not visible on docket document.");
  };

  const handleRateSave = (idx) => {
    const val = parseFloat(editRateValue);
    if (isNaN(val) || val <= 0) {
      showNotif("Please enter a valid rate.", "error");
      return;
    }
    setChargeRates((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, rate: val, lastUpdated: new Date().toISOString().split("T")[0], updatedBy: "Current User" }
          : r
      )
    );
    setEditRateIdx(null);
    setEditRateValue("");
    showNotif("Charge rate updated successfully.");
  };

  const currentBillInState = selectedBill ? bills.find((b) => b.id === selectedBill.id) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0a0a] flex flex-col py-6 px-4 gap-2 shrink-0">
        <div className="text-white font-bold text-lg mb-6 px-2">Varicon</div>
        {[
          { id: "bills", icon: "📄", label: "Bill Approvals" },
          { id: "dayworks", icon: "🔧", label: "Day Works" },
          { id: "rates", icon: "💲", label: "Charge Rates" },
          { id: "losttime", icon: "⏱", label: "Lost Time" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
              ${activeTab === item.id ? "bg-sky-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Notification Banner */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all
              ${notification.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}
          >
            {notification.type === "error" ? "⚠️" : "✓"} {notification.msg}
          </div>
        )}

        {/* ── BILLS TAB ── */}
        {activeTab === "bills" && (
          <div className="p-6 flex gap-6">
            {/* Left: Bill List */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bill Approvals</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Three-phase approval workflow with real-time status tracking</p>
                </div>
                <span className="text-sm text-gray-400">{filteredBills.length} of {bills.length} bills</span>
              </div>

              {/* Filter Panel */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter Bills</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Approver</label>
                    <select
                      value={filterApprover}
                      onChange={(e) => setFilterApprover(e.target.value)}
                      className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 min-w-[160px]"
                    >
                      <option value="">All Approvers</option>
                      {APPROVERS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Approval Phase</label>
                    <select
                      value={filterPhase}
                      onChange={(e) => setFilterPhase(e.target.value)}
                      className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 min-w-[140px]"
                    >
                      <option value="">All Phases</option>
                      {PHASES.map((p) => (
                        <option key={p.id} value={String(p.id)}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 min-w-[200px]"
                    >
                      <option value="">All Statuses</option>
                      {["Awaiting Approval", "Partially Approved – Phase 2 Pending", "Final Approval Required", "Fully Approved"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {(filterApprover || filterPhase || filterStatus) && (
                    <div className="flex flex-col justify-end">
                      <button
                        onClick={() => { setFilterApprover(""); setFilterPhase(""); setFilterStatus(""); }}
                        className="text-xs text-sky-600 hover:underline py-1.5"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bills Table */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Bill</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Supplier</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Phase Progress</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">Xero</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => {
                      const status = getPhaseStatus(bill);
                      const isSelected = selectedBill?.id === bill.id;
                      return (
                        <tr
                          key={bill.id}
                          onClick={() => { setSelectedBill(bill); setShowApprovalPanel(true); }}
                          className={`border-b border-gray-100 cursor-pointer hover:bg-sky-50 transition-colors
                            ${isSelected ? "bg-sky-50 border-l-2 border-l-sky-500" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{bill.id}</div>
                            <div className="text-xs text-gray-400">{bill.wbs}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{bill.supplier}</div>
                            <div className="text-xs text-gray-400 max-w-[160px] truncate">{bill.description}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{fmtCurrency(bill.amount)}</div>
                            <div className="text-xs text-gray-400">
                              GST: {fmtCurrency(bill.gstOverride !== null ? bill.gstOverride : bill.gst)}
                              {bill.gstOverride !== null && (
                                <span className="ml-1 text-amber-600 font-medium">(adj)</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <PhaseProgress approvals={bill.approvals} currentPhase={status.phase} />
                          </td>
                          <td className="px-4 py-3">
                            <ApprovalPhaseBadge status={status} />
                          </td>
                          <td className="px-4 py-3">
                            <XeroBadge status={bill.xeroStatus} error={bill.xeroError} />
                          </td>
                        </tr>
                      );
                    })}
                    {filteredBills.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                          No bills match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>