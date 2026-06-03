import type {
  AttendanceStatus,
  RiskRule,
  RiskSeverity,
  RiskRuleType,
} from "@/generated/prisma";

export type RiskEngineContext = {
  campusId: string;
  studentId: string;
  classSessionId?: string | null;
  subjectId?: string | null;
  triggeredByUserId?: string | null;
};

export type ConsecutiveAbsenceCheckInput = {
  campusId: string;
  studentId: string;
  subjectId: string;
  rule: Pick<RiskRule, "id" | "threshold" | "severity" | "type" | "name">;
  classSessionId?: string | null;
};

export type ConsecutiveAbsenceCheckResult = {
  isRiskDetected: boolean;
  consecutiveAbsences: number;
  threshold: number;
  severity: RiskSeverity;
  type: RiskRuleType;
  title: string;
  description: string;
};

export type AttendanceRecordForRisk = {
  id: string;
  status: AttendanceStatus;
  markedAt: Date | null;
  classSession: {
    id: string;
    date: Date;
    subjectId: string | null;
    subjectRel?: {
      id: string;
      name: string;
      code: string | null;
    } | null;
  } | null;
};