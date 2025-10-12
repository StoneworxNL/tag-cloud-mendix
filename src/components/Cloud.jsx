import { createElement, useCallback } from "react";
import { TagCloud } from "react-tagcloud";

export function Cloud({
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
    if (tagList.status === "loading") {
        return <div>Loading...</div>;
    }

    const data = tagList.items.map(tag => ({
        value: caption.get(tag).value,
        count: value.get(tag).value,
        id: uniqueId.get(tag).value
    }));

    const clickAction = useCallback(
        tagId => {
            if (!onClickAction) return;

            if (onClickAction.isExecuting || !onClickAction.canExecute) {
                console.warn("onClickAction cannot be executed.");
                return;
            }

            if (clickedTagId) {
                if (clickedTagId.status !== "available") {
                    console.warn("countryClickedISO is not available.");
                    return;
                } else clickedTagId.setValue(tagId);
            }

            onClickAction.execute();
        },
        [onClickAction, clickedTagId]
    );

    return (
        <TagCloud
            minSize={minSize}
            maxSize={maxSize}
            tags={data}
            shuffle={shuffle}
            onClick={tag => clickAction(tag.id)}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
