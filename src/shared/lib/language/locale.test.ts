import { describe, expect, it } from "vitest";
import { DEFAULT_LANG, nextLang, parseLang } from "./locale";

describe("locale contract", () => {
  it("preserves the current default and binary transition", () => {
    expect(DEFAULT_LANG).toBe("ru");
    expect(parseLang("en")).toBe("en");
    expect(parseLang("ru")).toBe("ru");
    expect(parseLang("other")).toBe("ru");
    expect(nextLang("ru")).toBe("en");
    expect(nextLang("en")).toBe("ru");
  });
});
