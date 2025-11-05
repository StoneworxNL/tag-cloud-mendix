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
    clickedTagKey,
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
            clickedTagKey={clickedTagKey}
            minSize={minSize}
            maxSize={maxSize}
            shuffle={shuffle}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
