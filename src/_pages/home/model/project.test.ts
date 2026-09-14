import { describe, expect, it } from "vitest";
import { projects } from "../config/projects";
import { projectView } from "./project";

describe("project registry", () => {
  it("preserves the curated order and localized descriptor content", () => {
    expect(projects.map((project) => project.id)).toEqual(["homelab", "teamtasker", "swapdog", "esaul", "swaprat"]);
    for (const project of projects) {
      for (const lang of ["ru", "en"] as const) {
        const view = projectView(project, lang);
        expect(view.name).not.toBe("");
        expect(view.description).not.toBe("");
        expect(view.detail.canvasLabel).not.toBe("");
      }
    }
  });

  it("keeps placeholders, image dimensions, details, and destinations explicit", () => {
    const homelab = projects[0];
    expect(homelab.thumbnail).toEqual({ kind: "placeholder" });
    expect(homelab.destination).toBeUndefined();
    expect(homelab.detail.kind).toBe("homelab");

    for (const project of projects.slice(1)) {
      expect(project.thumbnail.kind).toBe("image");
      expect(project.destination?.kind).toBe("external");
      expect(project.detail.kind).toBe("photos");
    }
  });
});
