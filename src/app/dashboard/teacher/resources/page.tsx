"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { PlusCircle, File, Trash2 } from "lucide-react";
import UploadResourceModal from "@/components/teacher/UploadResourceModal";
import ResourcePreviewModal from "@/components/teacher/ResourcePreviewModal";
import {
  showErrorMessage,
  showLoadingMessage,
  showSuccessMessage,
  toastDissmisser,
} from "@/lib/helper";
import TConfirmModal from "@/components/ui/TConfirmModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResourcesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [campusId, setCampusId] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTeacherId(localStorage.getItem("teacherId"));
    setCampusId(localStorage.getItem("CampusID"));
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    teacherId && campusId
      ? `/api/teacher/resources?teacherId=${teacherId}&campusId=${campusId}`
      : null,
    fetcher,
  );

  const handleDelete = async () => {
    if (!resourceToDelete || !teacherId) {
      showErrorMessage("An error occurred. Please refresh.");
      return;
    }

    setIsDeleting(true);
    const toastId = showLoadingMessage("Deleting resource...");
    try {
      const res = await fetch("/api/teacher/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resourceToDelete.id,
          teacherId: teacherId,
        }),
      });

      const data = await res.json();
      toastDissmisser(toastId);
      if (!res.ok) throw new Error(data.error || "Failed to delete.");

      showSuccessMessage("Resource deleted successfully.");
      mutate();
      setResourceToDelete(null);
    } catch (err: any) {
      toastDissmisser(toastId);
      showErrorMessage(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const resources = data?.resources || [];

  return (
    <>
      <main className="relative min-h-full overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_30%)]" />

        <div className="relative z-10 flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-200">
                  Mentor Desk
                </span>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Resource Vault
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Upload, manage, preview, and share learning materials with
                  your classes from one polished workspace.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PlusCircle
                  size={20}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
                <span>Upload Resource</span>
              </button>
            </div>
          </header>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                  <div className="relative z-10 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/10" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 rounded-full bg-white/10" />
                        <div className="h-3 w-1/2 rounded-full bg-white/10" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="h-3 w-full rounded-full bg-white/10" />
                      <div className="h-3 w-5/6 rounded-full bg-white/10" />
                      <div className="h-3 w-2/3 rounded-full bg-white/10" />
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="h-4 w-14 rounded-full bg-white/10" />
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-red-300/20 bg-red-500/10 p-5 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl">
              <p className="text-sm font-bold text-red-300">
                Failed to load resources. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {resources.length === 0 ? (
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                  <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 shadow-xl shadow-black/20">
                      <File className="h-7 w-7 text-violet-200" />
                    </div>

                    <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                      No resources uploaded yet
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Start building your shared library by uploading notes,
                      PDFs, assignments, or reference material.
                    </p>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <PlusCircle size={18} />
                      Upload Resource
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {resources.map((resource: any) => (
                    <div
                      key={resource.id}
                      className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.055]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/5" />

                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-lg shadow-black/20">
                            <File className="h-6 w-6 text-violet-200" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-extrabold tracking-tight text-white">
                              {resource.title}
                            </h3>

                            <p className="mt-1 truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                              {resource.subject?.name || "Unknown Subject"}
                            </p>
                          </div>
                        </div>

                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                          {resource.description || "No description provided."}
                        </p>
                      </div>

                      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <button
                          onClick={() => {
                            console.log({ resource });
                            setSelectedResource(resource);
                            setIsPreviewOpen(true);
                          }}
                          className="inline-flex items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-xs font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20"
                        >
                          View
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setResourceToDelete(resource);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-300 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20"
                          aria-label="Delete announcement"
                        >
                          <Trash2
                            size={18}
                            className="transition-colors duration-300"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <UploadResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => mutate()}
      />

      <ResourcePreviewModal
        isOpen={isPreviewOpen && selectedResource !== null}
        onClose={() => setIsPreviewOpen(false)}
        resource={selectedResource}
      />

      <TConfirmModal
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to permanently delete "${resourceToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
