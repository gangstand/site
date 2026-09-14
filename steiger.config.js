import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  { files: ["./src/_app/**", "./src/_pages/**"], rules: { "fsd/typo-in-layer-name": "off" } },
  { files: ["./src/_app/providers/**"], rules: { "fsd/segments-by-purpose": "off" } },
  { files: ["./src/shared/ui/infinite-canvas/**"], rules: { "fsd/no-reserved-folder-names": "off" } },
  { files: ["./src/features/copy-email/**", "./src/features/explore-homelab/**"], rules: { "fsd/insignificant-slice": "off" } },
  { files: ["./src/_app/api-routes/homelab-status/**", "./src/features/explore-homelab/**"], rules: { "fsd/no-public-api-sidestep": "off" } },
]);
