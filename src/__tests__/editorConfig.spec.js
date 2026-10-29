import { check } from "../TagCloud.editorConfig";

const base = {
    minSize: 12,
    maxSize: 35,
    disableRandomColor: false,
    colorHue: "any",
    colorLuminosity: "any",
    renderMode: "text"
};

describe("check", () => {
    it("accepts the defaults", () => {
        expect(check(base)).toEqual([]);
    });

    it("rejects an invalid custom hue", () => {
        expect(check({ ...base, colorHue: "custom", customHue: "teal" }).map(e => e.property)).toEqual(["customHue"]);
    });

    it("skips the color checks when random colors are off (their properties are hidden)", () => {
        expect(
            check({ ...base, disableRandomColor: true, colorHue: "custom", customHue: "", renderMode: "pill" })
        ).toEqual([]);
    });

    it("warns about pill contrast unless luminosity is dark", () => {
        const problems = check({ ...base, renderMode: "pill" });
        expect(problems).toEqual([expect.objectContaining({ property: "colorLuminosity", severity: "warning" })]);
        expect(check({ ...base, renderMode: "pill", colorLuminosity: "dark" })).toEqual([]);
    });

    it("validates the size range", () => {
        expect(check({ ...base, minSize: 0, maxSize: -1 }).map(e => e.property)).toEqual(["minSize", "maxSize"]);
    });
});
