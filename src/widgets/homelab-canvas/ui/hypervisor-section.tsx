import { memo } from "react";
import { TechLogo } from "@/shared/ui/tech-logo";
import { hypervisor } from "../model/layout";
import styles from "./homelab.module.css";

export const HypervisorSection = memo(function HypervisorSection() {
  return (
    <section
      className={styles.hypervisor}
      style={{ left: hypervisor.x, top: hypervisor.y, width: hypervisor.w, height: hypervisor.h }}
      aria-label="Гипервизор Proxmox с семью виртуальными машинами"
    >
      <div className={styles.hypervisorTitle}>
        <TechLogo tech="proxmox" size={30} />
        <strong>Proxmox VE</strong>
        <span>ГИПЕРВИЗОР</span>
      </div>
      <span className={styles.vmCount}>7 виртуальных машин</span>
    </section>
  );
});
