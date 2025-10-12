import { createElement } from "react";

import { Cloud } from "./components/Cloud";
import "./ui/TagCloud.css";

export function TagCloud({
    tagList,
    uniqueId,
    caption,
    value,
    onClickAction,
    clickedTagId,
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
            onClickAction={onClickAction}
            clickedTagId={clickedTagId}
            minSize={minSize}
            maxSize={maxSize}
            shuffle={shuffle}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
