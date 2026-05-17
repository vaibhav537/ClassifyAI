import { Loader2, Save, SaveAll, X } from "lucide-react";

export default function ModalFooter({
  onClose,
  handleSave,
  handleSaveAndNext,
  isLoading,
  isNextLoading,
  hasNext,
}: any) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-extrabold text-slate-300 transition duration-300 hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
      >
        <X className="h-4 w-4" />
        Close
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={isLoading || isNextLoading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-extrabold text-violet-100 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isLoading ? "Saving..." : "Save"}
      </button>

      {hasNext && (
        <button
          type="button"
          onClick={handleSaveAndNext}
          disabled={isLoading || isNextLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isNextLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SaveAll className="h-4 w-4" />
          )}
          {isNextLoading ? "Saving..." : "Save & Next"}
        </button>
      )}
    </div>
  );
}
