const SubmitButton = ({ hasSubmitted, onClick }: any) => {
  if (hasSubmitted) return null;

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-violet-800/30 active:scale-[0.98] sm:w-auto"
      >
        Prepare Submission
        <span className="transition duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
};

export default SubmitButton;