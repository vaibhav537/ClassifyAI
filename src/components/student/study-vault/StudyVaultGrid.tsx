import StudyVaultCard from "./StudyVaultCard";

export default function StudyVaultGrid({
  filteredResources,
  getIcon,
  handleResourceClick,
}: any) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14141B]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredResources.map((res: any) => (
          <StudyVaultCard
            key={res.id}
            res={res}
            getIcon={getIcon}
            onClick={handleResourceClick}
          />
        ))}
      </div>
    </section>
  );
}