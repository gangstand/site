import type { Metadata } from "next";
import { HomelabPage } from "@/views/homelab";

export const metadata: Metadata = {
  title: "Homelab map",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomelabPage />;
}
