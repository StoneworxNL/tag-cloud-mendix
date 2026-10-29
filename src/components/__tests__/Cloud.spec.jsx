import { fireEvent, render } from "@testing-library/react";
import { Cloud } from "../Cloud";

const attr = field => ({
    get: item => ({ value: item[field], displayValue: item[field] === undefined ? "" : String(item[field]) })
});

const action = () => ({ canExecute: true, isExecuting: false, execute: jest.fn() });

const list = (items, status = "available") => ({ status, items });

const ITEMS = [
    { id: "1", caption: "Lisbon", value: 10, color: "#ff0000" },
    { id: "2", caption: "Porto", value: 5 },
    { id: "3", caption: "Faro", value: 1 }
];

function renderCloud(props = {}) {
    const all = {
        tagList: list(ITEMS),
        caption: attr("caption"),
        value: attr("value"),
        minSize: 10,
        maxSize: 30,
        shuffle: false,
        disableRandomColor: false,
        randomSeed: 0,
        renderMode: "text",
        ...props
    };
    const result = render(<Cloud {...all} />);
    return { ...result, rerenderCloud: next => result.rerender(<Cloud {...all} {...next} />) };
}

const tag = (container, text) =>
    Array.from(container.querySelectorAll(".tag-cloud-tag")).find(el => el.textContent === text);

describe("Cloud", () => {
    it("scales font sizes between min and max and applies the color attribute", () => {
        const { container } = renderCloud({ color: attr("color") });
        expect(tag(container, "Lisbon").style.fontSize).toBe("30px");
        expect(tag(container, "Faro").style.fontSize).toBe("10px");
        expect(tag(container, "Lisbon").style.color).toBe("rgb(255, 0, 0)");
    });

    it("survives going back to loading after it rendered data (hooks order)", () => {
        const { container, rerenderCloud } = renderCloud({ tagList: list(undefined, "loading") });
        expect(container.querySelector(".widget-tag-cloud--loading")).not.toBeNull();
        rerenderCloud({ tagList: list(ITEMS) });
        rerenderCloud({ tagList: list(ITEMS, "loading") });
        rerenderCloud({ tagList: list(undefined, "loading") });
        rerenderCloud({ tagList: list(ITEMS) });
        expect(container.querySelectorAll(".tag-cloud-tag")).toHaveLength(3);
    });

    it("treats empty values as 0 instead of breaking every size", () => {
        const { container } = renderCloud({ tagList: list([...ITEMS, { id: "4", caption: "Braga" }]) });
        container.querySelectorAll(".tag-cloud-tag").forEach(el => expect(el.style.fontSize).not.toContain("NaN"));
        expect(tag(container, "Braga").style.fontSize).toBe("10px");
    });

    it("does not warn or run anything on mouse move without an action", () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
        const { container } = renderCloud();
        fireEvent.mouseMove(tag(container, "Porto"));
        fireEvent.click(tag(container, "Porto"));
        expect(warn).not.toHaveBeenCalled();
        expect(tag(container, "Porto").getAttribute("role")).toBeNull();
        warn.mockRestore();
    });

    it("runs mouse move once per tag entered and mouse out on leave", () => {
        const onMouseMoveAction = action();
        const onMouseOutAction = action();
        const { container } = renderCloud({ onMouseMoveAction, onMouseOutAction });
        const porto = tag(container, "Porto");
        fireEvent.mouseMove(porto);
        fireEvent.mouseMove(porto);
        fireEvent.mouseMove(porto);
        expect(onMouseMoveAction.execute).toHaveBeenCalledTimes(1);
        expect(onMouseMoveAction.execute).toHaveBeenCalledWith({ eventTagKey: "Porto" });
        fireEvent.mouseOut(porto);
        expect(onMouseOutAction.execute).toHaveBeenCalledWith({ eventTagKey: "Porto" });
        fireEvent.mouseMove(porto);
        expect(onMouseMoveAction.execute).toHaveBeenCalledTimes(2);
    });

    it("runs click actions from mouse and keyboard, with the tag key and the object", () => {
        const onClickAction = action();
        const itemAction = action();
        const onClickItemAction = { get: jest.fn(() => itemAction) };
        const { container } = renderCloud({ onClickAction, onClickItemAction, uniqueId: attr("id") });
        const lisbon = tag(container, "Lisbon");
        expect(lisbon.getAttribute("role")).toBe("button");
        expect(lisbon.tabIndex).toBe(0);
        fireEvent.click(lisbon);
        fireEvent.keyDown(lisbon, { key: "Enter" });
        expect(onClickAction.execute).toHaveBeenCalledTimes(2);
        expect(onClickAction.execute).toHaveBeenCalledWith({ eventTagKey: "1" });
        expect(onClickItemAction.get).toHaveBeenCalledWith(ITEMS[0]);
        expect(itemAction.execute).toHaveBeenCalledTimes(2);
    });

    it("skips actions that cannot execute", () => {
        const onDoubleClickAction = { ...action(), canExecute: false };
        const { container } = renderCloud({ onDoubleClickAction });
        fireEvent.doubleClick(tag(container, "Porto"));
        expect(onDoubleClickAction.execute).not.toHaveBeenCalled();
    });

    it("passes Studio Pro class and style to the root", () => {
        const { container } = renderCloud({ className: "my-cloud", style: { maxWidth: "200px" } });
        const root = container.firstChild;
        expect(root.className).toContain("widget-tag-cloud");
        expect(root.className).toContain("my-cloud");
        expect(root.style.maxWidth).toBe("200px");
    });

    it("updates a tag when only its color changes", () => {
        const { container, rerenderCloud } = renderCloud({ color: attr("color") });
        const recolored = ITEMS.map(item => (item.id === "1" ? { ...item, color: "#0000ff" } : item));
        rerenderCloud({ tagList: list(recolored), color: attr("color") });
        expect(tag(container, "Lisbon").style.color).toBe("rgb(0, 0, 255)");
    });

    it("keeps tags with duplicate captions", () => {
        const onClickAction = action();
        const { container } = renderCloud({
            onClickAction,
            tagList: list([...ITEMS, { id: "5", caption: "Porto", value: 3 }])
        });
        const portos = Array.from(container.querySelectorAll(".tag-cloud-tag")).filter(
            el => el.textContent === "Porto"
        );
        expect(portos).toHaveLength(2);
        fireEvent.click(portos[1]);
        expect(onClickAction.execute).toHaveBeenCalledWith({ eventTagKey: "Porto#2" });
    });

    it("adds tooltip, per-tag class and pill style", () => {
        const { container } = renderCloud({
            renderMode: "pill",
            color: attr("color"),
            tooltip: { get: item => ({ value: `${item.caption}: ${item.value}` }) },
            tagClass: { get: item => ({ value: item.value > 5 ? "tag-hot" : "" }) }
        });
        const lisbon = tag(container, "Lisbon");
        expect(lisbon.title).toBe("Lisbon: 10");
        expect(lisbon.className).toContain("tag-hot");
        expect(lisbon.className).toContain("tag-cloud-tag--pill");
        expect(lisbon.style.backgroundColor).toBe("rgb(255, 0, 0)");
        expect(tag(container, "Faro").className).not.toContain("tag-hot");
    });

    it("uses no random color when disabled", () => {
        const { container } = renderCloud({ disableRandomColor: true });
        expect(tag(container, "Porto").style.color).toBe("");
    });

    it("generates the same colors for the same seed", () => {
        const first = renderCloud({ randomSeed: 42, colorLuminosity: "dark", colorHue: "blue" });
        const colors = ["Lisbon", "Porto", "Faro"].map(text => tag(first.container, text).style.color);
        first.unmount();
        const second = renderCloud({ randomSeed: 42, colorLuminosity: "dark", colorHue: "blue" });
        expect(["Lisbon", "Porto", "Faro"].map(text => tag(second.container, text).style.color)).toEqual(colors);
        expect(colors.every(Boolean)).toBe(true);
    });

    it("shows the empty message", () => {
        const { container } = renderCloud({ tagList: list([]), emptyMessage: { value: "Nothing yet" } });
        expect(container.textContent).toBe("Nothing yet");
    });
});
