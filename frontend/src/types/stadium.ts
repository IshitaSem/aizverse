// Stadium related TypeScript interfaces
export interface CrowdDataPoint {
  time: string;
  capacity: number;
  predicted: number;
}

export interface CapacityInfo {
  totalSeats: number;
  currentAttendance: number;
  predictedPeak: number;
  nextUpdate: string; // ISO timestamp
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'responding' | 'resolved' | 'monitoring';
  time: string; // ISO timestamp
}
