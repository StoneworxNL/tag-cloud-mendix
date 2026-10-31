import { createElement } from "react";
import classNames from "classnames";

const SAMPLE_TAGS = [
    ["Mendix", 9],
    ["Low-code", 6],
    ["React", 7],
    ["Widget", 4],
    ["Tag", 3],
    ["Cloud", 8],
    ["Data", 5],
    ["Words", 2]
];

export function preview({ class: className, style, minSize, maxSize, renderMode, disableRandomColor }) {
    const min = minSize > 0 ? minSize : 12;
    const max = maxSize >= min ? maxSize : min;
    const palette = ["#1D3557", "#E4572E", "#2A9D8F", "#6A4C93", "#F4A261"];
    const isPill = renderMode === "pill";
    return (
        <div className={classNames("widget-tag-cloud", className)} style={style}>
            {SAMPLE_TAGS.map(([word, count], index) => {
                const size = Math.round(min + ((max - min) * (count - 2)) / 7);
                const color = disableRandomColor ? undefined : palette[index % palette.length];
                return (
                    <span
                        key={word}
                        className={classNames("tag-cloud-tag", { "tag-cloud-tag--pill": isPill })}
                        style={isPill ? { fontSize: size, backgroundColor: color } : { fontSize: size, color }}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
}

export function getPreviewCss() {
    return require("./ui/TagCloud.css");
}
