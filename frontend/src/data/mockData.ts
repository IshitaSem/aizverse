/**
 * MOCK / DEMO DATA
 * ─────────────────────────────────────────────────────────────────────────
 * None of these arrays are backed by a real API endpoint today. Every page
 * that consumes one of these is expected to have a
 * `// TODO(API): ...` comment at its render site explaining what backend
 * endpoint would replace it. Do not delete this file when wiring real APIs
 * for other pages — remove individual exports only once their consuming
 * page has been migrated to a real data source.
 *
 * `chatMessages` is the only export here actually consumed by a wired
 * feature (AIChatPage) — it's just the seed/greeting message shown before
 * the user's first real message, not mock "data" in the same sense.
 */
export const chatMessages: { role: "user" | "assistant"; text: string }[] = [
  { role: "assistant", text: "Hello! I'm AIZA, your AI Stadium Assistant for FIFA World Cup 2026. How can I help you today?" },
];

// ─── DATA ───
export const crowdData = [
  { time: "09:00", capacity: 12000, predicted: 13000 },
  { time: "10:00", capacity: 28000, predicted: 30000 },
  { time: "11:00", capacity: 41000, predicted: 43000 },
  { time: "12:00", capacity: 55000, predicted: 57000 },
  { time: "13:00", capacity: 63000, predicted: 65000 },
  { time: "14:00", capacity: 71000, predicted: 72000 },
  { time: "15:00", capacity: 78000, predicted: 80000 },
  { time: "16:00", capacity: 82000, predicted: 84000 },
  { time: "17:00", capacity: 85000, predicted: 87000 },
  { time: "18:00", capacity: 88000, predicted: 89000 },
];

export const queueData = [
  { gate: "Gate A", queue: 320, avg: 8 },
  { gate: "Gate B", queue: 180, avg: 4 },
  { gate: "Gate C", queue: 540, avg: 12 },
  { gate: "Gate D", queue: 90, avg: 2 },
  { gate: "Gate E", queue: 410, avg: 9 },
  { gate: "Gate F", queue: 220, avg: 5 },
];

export const transportData = [
  { name: "Metro", value: 42, color: "#6366f1" },
  { name: "Bus", value: 28, color: "#06b6d4" },
  { name: "Taxi/Ride", value: 18, color: "#10b981" },
  { name: "Private Car", value: 8, color: "#8b5cf6" },
  { name: "Walk/Bike", value: 4, color: "#f59e0b" },
];

export const carbonData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 81 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 91 },
  { day: "Sun", score: 84 },
];

export const incidents = [
  { id: "INC-001", type: "Medical", location: "Section C, Row 12", severity: "high", time: "16:42", status: "responding" },
  { id: "INC-002", type: "Crowd Surge", location: "Gate A Plaza", severity: "medium", time: "16:38", status: "monitoring" },
  { id: "INC-003", type: "Lost Child", location: "Fan Zone 3", severity: "medium", time: "16:31", status: "resolved" },
  { id: "INC-004", type: "Suspicious Item", location: "Parking Level 2", severity: "low", time: "16:20", status: "resolved" },
  { id: "INC-005", type: "Fire Alarm", location: "Concession Stand B", severity: "high", time: "16:15", status: "resolved" },
];

export const volunteerTasks = [
  { id: 1, task: "Guide fans to Gate C overflow area", priority: "high", zone: "Gate C", status: "in-progress" },
  { id: 2, task: "Assist wheelchair users to accessible seating", priority: "medium", zone: "Section A", status: "pending" },
  { id: 3, task: "Distribute water bottles at Fan Zone 2", priority: "medium", zone: "Fan Zone 2", status: "pending" },
  { id: 4, task: "Lost & Found — return item to owner", priority: "low", zone: "Info Desk", status: "completed" },
  { id: 5, task: "Help with merchandise queue management", priority: "medium", zone: "Shop 3", status: "pending" },
];

