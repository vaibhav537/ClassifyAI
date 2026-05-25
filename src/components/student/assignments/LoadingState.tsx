import { ClipboardList, Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
      <div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10">
          <ClipboardList className="h-7 w-7 text-violet-200" />
        </div>

        <Loader2 className="mx-auto mt-5 h-8 w-8 animate-spin text-violet-300" />

        <p className="mt-4 text-lg font-extrabold text-white">
          Loading Assignment
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Preparing questions, rubric and submission details...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;