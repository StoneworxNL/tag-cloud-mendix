import { createElement } from "react";

import { Cloud } from "./components/Cloud";
import "./ui/TagCloud.css";

export function TagCloud({
    tagList,
    uniqueId,
    caption,
    value,
    color,
    onClickAction,
    onDoubleClickAction,
    onMouseMoveAction,
    minSize,
    maxSize,
    shuffle,
    disableRandomColor,
    randomSeed
}) {
    return (
        <Cloud
            tagList={tagList}
            uniqueId={uniqueId}
            caption={caption}
            value={value}
            color={color}
            onClickAction={onClickAction}
            onDoubleClickAction={onDoubleClickAction}
            onMouseMoveAction={onMouseMoveAction}
            minSize={minSize}
            maxSize={maxSize}
            shuffle={shuffle}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
