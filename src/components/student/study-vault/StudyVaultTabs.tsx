"use client";

export default function StudyVaultTabs({
  TABS,
  activeTab,
  setActiveTab,
}: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab: any) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`rounded-2xl border px-4 py-2.5 text-sm font-extrabold transition duration-300 ${
            activeTab === tab.id
              ? "border-violet-300/35 bg-violet-500/20 text-violet-100 shadow-lg shadow-violet-950/20"
              : "border-white/10 bg-white/[0.045] text-slate-400 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}