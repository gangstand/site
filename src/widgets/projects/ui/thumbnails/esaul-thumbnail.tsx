import localFont from "next/font/local";

const font5by7 = localFont({ src: "./fonts/5by7.woff" });

export function EsaulThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-[#f1f1f1] p-[1.667%] [container-type:inline-size]">
      <div className="rounded-[1.667cqw] p-[5%]" style={{ backgroundColor: "var(--color-white)" }}>
        <h3 className={`${font5by7.className} mb-[1.92%] text-[4.6cqw] uppercase leading-[1.16] text-[#171717]`}>
          Ваша единая система автоматизации управления линией технической поддержки
        </h3>

        <p className="mb-[10%] text-[2.6cqw] leading-[1.25] text-[#171717]" style={{ fontFamily: "Arial, sans-serif" }}>
          Сократите телефонные звонки и оптимизируйте работу технической поддержки в компании
        </p>

        <div className="relative mx-auto w-[80%]" style={{ aspectRatio: "473 / 300" }}>
          <div
            className="h-full w-full rounded-[1.5%] border bg-cover bg-center"
            style={{ borderColor: "#f1f1f1", backgroundImage: "url(/projects/esaul/photo.svg)" }}
          />
          <img
            src="/projects/esaul/ticket.svg"
            alt=""
            className="absolute rounded-[3%]"
            style={{ left: "-4.86%", top: "-8%", width: "58.99%", boxShadow: "0 0.4cqw 1.2cqw rgba(133,133,133,0.15)" }}
          />
          <img
            src="/projects/esaul/manager.svg"
            alt=""
            className="absolute rounded-[6%]"
            style={{ left: "74.21%", top: "88%", width: "30.02%", boxShadow: "0 0.4cqw 1.2cqw rgba(133,133,133,0.15)" }}
          />
        </div>
      </div>
    </div>
  );
}
