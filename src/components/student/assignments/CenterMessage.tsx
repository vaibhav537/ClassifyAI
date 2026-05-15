import { AlertCircle } from "lucide-react";

const CenterMessage = ({ text }: { text: string }) => {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-6 text-center shadow-2xl shadow-black/35 backdrop-blur-2xl">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10">
          <AlertCircle className="h-7 w-7 text-red-300" />
        </div>

        <p className="mt-5 text-xl font-extrabold text-white">
          Something went wrong
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
};

export default CenterMessage;