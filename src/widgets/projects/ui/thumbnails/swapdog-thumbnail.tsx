export function SwapdogThumbnail() {
  return (
    <div
      className="relative flex w-full flex-col gap-[2.5cqw] overflow-hidden bg-[#f0f0f0] bg-repeat p-[8%] [container-type:inline-size]"
      style={{ backgroundImage: "url(/projects/swapdog/grid-bg.svg)" }}
    >
      <h3 className="relative font-mono text-[5.2cqw] font-bold leading-[1.05] tracking-[-0.15cqw] text-[#1e1e1e]">
        ОБМЕН ДОКУМЕНТАМИ МЕЖДУ <span className="text-[#347fff]">iiko</span> И{" "}
        <span className="text-[#347fff]">ЭДО</span> — БЫСТРО И БЕЗ ОШИБОК
      </h3>

      <p className="relative font-mono text-[2.6cqw] leading-[1.4] text-[#1e1e1e]">
        SwapDog обеспечивает автоматический обмен данными между iiko и ЭДО: накладные и чеки попадают в iiko без
        ручного ввода, а вы работаете быстрее.
      </p>

      <img src="/projects/swapdog/laptop.webp" alt="" className="relative w-full object-contain" />
    </div>
  );
}
