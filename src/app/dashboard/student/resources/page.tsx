"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  BookOpen,
  FileQuestion,
  FileText,
  Video,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  Loader2,
  LibraryBig,
} from "lucide-react";
import ExamPredictor from "@/components/student/ExamPredictor";
import StudyVaultHeader from "@/components/student/study-vault/StudyVaultHeader";
import StudyVaultTabs from "@/components/student/study-vault/StudyVaultTabs";
import { TABS } from "@/lib/helper";
import StudyVaultGrid from "@/components/student/study-vault/StudyVaultGrid";
import ResourceModal from "@/components/student/study-vault/ResourceModal";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentStudyVault() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    setStudentId(localStorage.getItem("studentId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, isLoading } = useSWR(
    studentId && campusId
      ? `/api/student/resources?studentId=${studentId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const resources = data?.resources || [];

  const filteredResources = resources.filter((res: any) => {
    const matchesTab = activeTab === "ALL" || res.resourceType === activeTab;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "NOTES":
        return <BookOpen className="text-violet-300" size={22} />;
      case "PYQ":
        return <FileQuestion className="text-fuchsia-300" size={22} />;
      case "VIDEO_LINK":
        return <Video className="text-pink-300" size={22} />;
      default:
        return <FileText className="text-cyan-300" size={22} />;
    }
  };

  const getFileType = (url: string) => {
    const lower = url.toLowerCase();

    if (lower.includes(".pdf")) return "pdf";
    if (/\.(png|jpg|jpeg|webp|gif)$/.test(lower)) return "image";
    if (/\.(mp4|webm|ogg)$/.test(lower)) return "video";
    if (/\.(mp3|wav)$/.test(lower)) return "audio";

    return "other";
  };

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
  };

  const subjects = [
    ...new Map(
      resources.map((r: any) => [
        r.subject?.id,
        { id: r.subjectId, name: r.subject?.name },
      ]),
    ).values(),
  ].filter(Boolean);

  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08080C] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 app-shell-bg" />
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-400/6 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/student")}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  <Sparkles className="h-3 w-3" />
                  Study Vault
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Resources Library
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Access notes, PYQs, videos and AI-powered exam predictions
                  from one focused workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Resources
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {isLoading ? "..." : resources.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/70">
                  Showing
                </p>
                <p className="mt-1 text-2xl font-extrabold text-violet-100">
                  {isLoading ? "..." : filteredResources.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
          <StudyVaultHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="mt-5">
            <StudyVaultTabs
              TABS={TABS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </section>

        {activeTab === "PREDICTOR" ? (
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-6">
            {!selectedSubject ? (
              <div className="grid min-h-[360px] place-items-center text-center">
                <div className="max-w-2xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
                    <Sparkles className="h-7 w-7 text-violet-200" />
                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-white">
                    Select a Subject
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Choose a subject to run AI predictions on its previous year
                    questions.
                  </p>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {subjects.map((subject: any, index: number) => {
                      return (
                        <button
                          type="button"
                          key={subject.id || index}
                          onClick={() =>
                            setSelectedSubject({
                              id: subject.id,
                              name: subject.name,
                            })
                          }
                          className="rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                        >
                          {subject.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedSubject(null)}
                  className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to subjects
                </button>

                <ExamPredictor
                  subjectId={selectedSubject.id}
                  subjectName={selectedSubject.name}
                />
              </div>
            )}
          </section>
        ) : isLoading ? (
          <section className="grid min-h-[360px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
              </div>

              <p className="mt-5 text-lg font-extrabold text-white">
                Opening Study Vault
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Fetching notes, PYQs and shared resources...
              </p>
            </div>
          </section>
        ) : filteredResources.length === 0 ? (
          <section className="grid min-h-[360px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <LibraryBig className="h-7 w-7 text-slate-500" />
              </div>

              <p className="mt-5 text-xl font-extrabold text-white">
                No resources found
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Try changing the tab or search query. Shared resources will
                appear here once available.
              </p>
            </div>
          </section>
        ) : (
          <StudyVaultGrid
            filteredResources={filteredResources}
            getIcon={getIcon}
            handleResourceClick={handleResourceClick}
          />
        )}

        <ResourceModal
          selectedResource={selectedResource}
          setSelectedResource={setSelectedResource}
          getFileType={getFileType}
        />
      </div>
    </main>
  );
}
