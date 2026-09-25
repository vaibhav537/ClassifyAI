export type CourseOption = {
  subjectId: string;
  semesterId: string;
  sectionId: string;
  subject: { name: string };
  semester: { name: string };
  section: { name: string };
};

export type Reel = {
  id: string;
  title: string;
  description: string | null;
  learningOutcome: string;
  videoUrl: string;
  durationSeconds: number;
  author: { id: string; name: string; avatarUrl: string | null; role: string };
  subject: string;
  semester: string;
  section: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  reviewReason: string | null;
  createdAt: string;
  saved: boolean;
  saves: number;
  relevance: string;
};
