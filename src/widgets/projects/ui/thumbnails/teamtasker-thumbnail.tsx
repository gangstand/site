const BUBBLES = [
  { top: "6%", left: "38%", size: "5cqw" },
  { top: "14%", left: "88%", size: "3.5cqw" },
  { top: "28%", left: "6%", size: "4cqw" },
  { top: "46%", left: "94%", size: "3cqw" },
  { top: "58%", left: "16%", size: "3cqw" },
  { top: "74%", left: "82%", size: "4.5cqw" },
  { top: "86%", left: "30%", size: "3.5cqw" },
  { top: "92%", left: "62%", size: "2.5cqw" },
];

export function TeamtaskerThumbnail() {
  return (
    <div
      className="relative flex w-full flex-col gap-[2.5cqw] overflow-hidden p-[8%] [container-type:inline-size]"
      style={{
        backgroundImage: "radial-gradient(at 50% 30%, #e8f2ff 0%, #f8fafe 50%, #ffffff 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(200,210,225,0.45) 60%, rgba(200,210,225,0.2) 100%)",
            boxShadow: "0 0.8cqw 1.6cqw rgba(0,0,0,0.08)",
          }}
        />
      ))}

      <h3 className="relative text-[5.2cqw] font-bold leading-[1.05] tracking-[-0.15cqw] text-[#1a1a2e]">
        Умное управление задачами,{" "}
        <span
          style={{
            backgroundImage: "linear-gradient(135deg, #0170ff 0%, #4da3ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          которое работает на вас
        </span>
      </h3>

      <p className="relative text-[2.6cqw] leading-[1.4] text-[#6b7280]">
        Порядок в делах, дисциплина команды и финансовая прозрачность в одном приложении. От личных планов до сложных
        бизнес-процессов.
      </p>

      <img
        src="/projects/teamtasker/mockup.webp"
        alt="Интерфейс «Умных задач»"
        className="relative w-full rounded-[6%] object-contain shadow-[0_16px_64px_rgba(0,0,0,0.12)]"
      />
    </div>
  );
}
