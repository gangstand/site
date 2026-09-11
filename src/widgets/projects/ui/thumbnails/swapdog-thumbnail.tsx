export function SwapdogThumbnail() {
  return (
    <div
      className="flex h-full w-full flex-col justify-center bg-[#f0f0f0] bg-repeat p-[8%] [container-type:inline-size]"
      style={{ backgroundImage: "url(/projects/swapdog/grid-bg.svg)" }}
    >
      <img src="/projects/swapdog/logo.svg" alt="" className="mb-[3%] h-[6cqw] w-auto" />

      <div className="mb-[1%] flex flex-wrap gap-[2%]">
        <span className="rounded-full bg-[#aacaff] px-[2.5%] py-[1%] font-mono text-[1.7cqw] text-[#347fff]">
          Поддержка ведущих операторов ЭДО
        </span>
        <span className="rounded-full bg-[#aacaff] px-[2.5%] py-[1%] font-mono text-[1.7cqw] text-[#347fff]">
          Для одиночных точек и сетей
        </span>
      </div>

      <h3 className="font-mono text-[5.2cqw] font-bold leading-[1.05] tracking-[-0.15cqw] text-[#1e1e1e]">
        ОБМЕН ДОКУМЕНТАМИ МЕЖДУ <span className="text-[#347fff]">iiko</span> И{" "}
        <span className="text-[#347fff]">ЭДО</span> — БЫСТРО И БЕЗ ОШИБОК
      </h3>

      <img src="/projects/swapdog/laptop.webp" alt="" className="mt-auto w-full object-contain" />
    </div>
  );
}
