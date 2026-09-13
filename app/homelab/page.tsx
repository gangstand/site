import type { Metadata } from "next";
import { HomelabCanvas } from "@/widgets/projects/homelab";

export const metadata: Metadata = {
  title: "Homelab map",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="h-svh">
      <HomelabCanvas />
    </div>
  );
}
