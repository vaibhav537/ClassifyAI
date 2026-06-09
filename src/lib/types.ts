export interface Token {
  id: string;
  token: string;
  subject: string;
  issuedAt: string;
  expiresAt: string;
}

export interface Attendance {
  id: string;
  subject: string;
  date: string;
  status: string;
  markedBy: string;
}

export interface SDetails {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
  branch?: string;
  year?: number;
  semester?: number;
}

export type Plan = {
  name: string;
  price: number;
};

export type PremiumStatusResponse = {
  isPremium: boolean;
  plan: "Starter" | "Pro" | "Ultimate" | null;
  features: string[];
};

export interface HorizontalBarProps {
  content: string;
  linkRef: string;
  title: string;
}

export interface NumberCardsProps {
  title: string;
  value: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
  active?: boolean;
  createdBy?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  status: string;
  date: string;
  markedAt?: string;
  markedBy?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  date: string;
  subject?: string;
}

export interface BunkStats {
  subject: string;
  total: number;
  present: number;
  percentage: number;
  safeBunks: number;
}

export interface RecentAttendance {
  id: string;
  studentName: string;
  subjectName: string;
  date: string;
  status: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  premiumFeatures: { name: string }[];
};

export type PremiumUser = {
  id: string;
  name: string;
  email: string;
  plan: "PRO" | "ULTIMATE";
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: "ACTIVE" | "EXPIRED";
};

export type Stats = {
  totalUsers: number;
  premiumUsers: number;
  proUsers: number;
  ultimateUsers: number;
  expiredPremiums: number;
};

export type Expiration = {
  id: string;
  name: string;
  email: string;
  plan: "PREMIUM" | "PRO" | "ULTIMATE";
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "EXPIRED";
};

export type Activity = {
  id: string;
  text: string;
  date: string;
  username: string;
};

export type EventStats = {
  totalEvents: number;
  exams: number;
  holidays: number;
  others: number;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  type: string; // e.g. Exam, Holiday, Other
  description?: string;
  active: boolean;
};

export type SupportRequest = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type PendingClass = {
  id: string;
  subject: { subjectName: string };
  semester: { semesterName: string };
  startTime: string;
  endTime: string;
};

export interface TeacherDetails {
  id: string;
  name: string;
  email: string;
  role: "TEACHER" | "STUDENT" | "ADMIN"; // extend kar sakta hai agar aur roles ho
  isPremium: boolean;
  premiumExpiresAt: string | null;
  premiumFeatures: string[];
  teacherProfile: {
    designation: string | null;
    department: string | null;
  } | null;
  branch: string | null;
  semester: number | null;
  year: number | null;
  createdAt: string; // ISO date string
}

export interface Teacher {
  id: string;
  userId: string;
}

export interface TeacherSubject {
  name: string;
  code: string;
  teacher: Teacher;
}

export type Subject = {
  id: string;
  name: string;
  code?: string;
};

export type Semester = {
  id: string;
  name: string;
  number?: number;
};

export type Student = {
  id: string;
  user: {
    id: string;
    name: string;
  };
};

export type Section = {
  id: string;
  name: string;
};

export type TeacherDetailsDashboard = {
  name: string;
  email: string;
};

export type ClassSession = {
  id: string;
  subject: {
    id: string;
    name: string;
    code?: string;
  };
  section: string;
  semester: number;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: string | null;
};
export type AttendanceSessionType = {
  id: string;
  subject: {
    id: string;
    name: string;
    code?: string;
  };
  section: string;
  semester: number;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: string | null;
};

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export type TeacherClassSession = {
  id: string;
  subject: { id: string; name: string; code?: string };
  section: { id: string; name: string };
  semester: { id: string; name: string };
  weekday: string;
  startTime: string;
  endTime: string;
  room?: string | null;
};

// New prop to allow pre-selecting a class
export interface PreselectedClass {
  subjectId: string;
  semesterId: string;
  sectionId: string;
}

export interface AssignmentHeaderProps {
  assignment: any;
  handleStatusChange: (status: "PUBLISHED" | "DRAFT") => void;
  isStatusLoading: boolean;
  onEditClick: () => void;
}

export interface AudioRecorderProps {
  onAudioReady: (blob: Blob | null) => void;
}

interface StudentSubject {
  id: string;
  name: string;
}

export interface SubjectSelectorProps {
  subjects: StudentSubject[];
  onSelect: (subject: Subject) => void;
}

export interface Prediction {
  topic: string;
  probability: number;
  weightage: "High" | "Medium" | "Low";
  reason: string;
}

export interface AnswerSection {
  heading: string;
  content: string;
}

export interface Answer {
  summary: string;
  sections: AnswerSection[];
  keyPoints: string[];
  sourcedFromNotes: boolean;
}

export type SubjectStat = {
  subjectId: string;
  subjectName: string;
  subjectCode: string | null;
  present: number;
  total: number;
};

export type StudentEntry = {
  studentId: string;
  userId: string;
  name: string;
  rollNumber: string | null;
  subjects: Map<string, SubjectStat>;
};

export type AggEntry = {
  userId: string;
  name: string;
  worstSubject: string;
  worstPct: number;
  subjectStats: Map<string, { name: string; present: number; total: number }>;
};

export type TeacherEntry = {
  teacherId: string;
  userId: string;
  name: string;
  subjects: Map<
    string,
    {
      subjectName: string;
      resourceCount: number;
    }
  >;
};

export type AggTeacher = {
  userId: string;
  name: string;
  totalResources: number;
  assignedSubjects: number;
  subjectsWithResources: number;
};

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  sender: { id: string; name: string; avatarUrl: string | null };
  encryptedContent: string;
  encryptedKeys: { encryptedKey: string; recipientId?: string }[];
  attachments: any[];
  deletedAt: string | null;
  createdAt: string;
  decryptedContent?: string;
  replyToId?: string | null;
  replyTo?: Message | null;
  editedAt?: string | Date | null;
  reactions?: {
    id: string;
    emoji: string;
    userId: string;
    user?: {
      id: string;
      name: string;
    };
  }[];
}

export interface UseChatOptions {
  userId: string;
  conversationId: string;
  privateKey: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

export interface UseChatOptions {
  userId: string;
  conversationId: string;
  privateKey: string;
}
export interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  campusId: string;
  onCreated: (conversationId: string) => void;
}

export type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
};

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  status: string;
  date: string;
}

export type HodContext = {
  userId: string;
  campusId: string;
  teacherId: string;
  department: string | null;
};

export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type TimetableEntryType =
  | "LECTURE"
  | "LAB"
  | "TUTORIAL"
  | "EXTRA_CLASS"
  | "LUNCH"
  | "BREAK"
  | "FREE"
  | "EXAM"
  | "EVENT";

export type TeacherOption = {
  id: string;
  department?: string | null;
  designation?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    campusId: string | null;
  };
};

export type SubjectOption = {
  id: string;
  name: string;
  code?: string | null;
};

export type SemesterOption = {
  id: string;
  name: string;
  number?: number | null;
};

export type SectionOption = {
  id: string;
  name: string;
};

export type TimetableDayConfig = {
  id: string;
  campusId: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  isWorking: boolean;
};

export type TimetableEntry = {
  id: string;
  type: TimetableEntryType;
  title?: string | null;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  room?: string | null;
  notes?: string | null;
  teacherId?: string | null;
  subjectId?: string | null;
  semesterId?: string | null;
  sectionId?: string | null;
  teacher?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
  subject?: SubjectOption | null;
  semester?: SemesterOption | null;
  section?: SectionOption | null;
};

export type TimetableFormState = {
  id?: string;
  type: TimetableEntryType;
  title: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  room: string;
  teacherId: string;
  subjectId: string;
  semesterId: string;
  sectionId: string;
  notes: string;
};

export type TimetableMeta = {
  teachers: TeacherOption[];
  subjects: SubjectOption[];
  semesters: SemesterOption[];
  sections: SectionOption[];
  dayConfigs: TimetableDayConfig[];
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "ASSISTANT";
  campusId: string | null;
  avatarUrl?: string | null;
};

export interface ChatLayoutProps {
  userId: string;
  privateKey: string;
  campusId: string;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN" | "ASSISTANT";
    campusId: string | null;
    avatarUrl?: string | null;
  };
}

export type StudentTimetableResponse = {
  success: boolean;
  todayWeekday: Weekday;
  student?: {
    id: string;
    semesterId?: string | null;
    sectionId?: string | null;
    semester?: {
      id: string;
      name: string;
    } | null;
    section?: {
      id: string;
      name: string;
    } | null;
  } | null;
  todayEntries: StudentTimetableEntry[];
  weeklyEntries: StudentTimetableEntry[];
  message?: string;
  error?: string;
};

export type StudentTimetableEntry = {
  id: string;
  type: string;
  title?: string | null;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacher?: {
    user: {
      name: string;
      email: string;
    };
  } | null;
  subject?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
  semester?: {
    id: string;
    name: string;
  } | null;
  section?: {
    id: string;
    name: string;
  } | null;
};

export type SupportStats = {
  openCases: number;
  highPriorityCases: number;
  escalatedCases: number;
  resolvedThisWeek: number;
  atRiskStudents: number;
};

export type SupportStateProps = {
  stats: SupportStats;
};

export type SupportCaseRow = {
  id: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  risk: string;
  priority: string;
  status: string;
  lastFollowUp: string;
  conversationId: string;
};


export type SupportCaseRowProps = {
  cases: SupportCaseRow[];
  onViewCase: (caseId: string) => void;
};

export type RiskEvent = {
  id: string;
  studentName: string;
  subject: string;
  severity: string;
  title: string;
  time: string;
};

export type RiskEventProps = {
  events: RiskEvent[];
};

export type SupportActivity = {
  id: string;
  title: string;
  caseTitle: string;
  actor: string;
  time: string;
};

export type SupportActivityProps = {
  activities: SupportActivity[];
};

export type SupportCaseDrawerProps = {
  caseId: string | null;
  open: boolean;
  onClose: () => void;
};

export type SupportCaseDetail = any;
