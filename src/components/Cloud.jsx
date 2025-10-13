import { createElement, useCallback } from "react";
import { TagCloud } from "react-tagcloud";

export function Cloud({
    tagList,
    uniqueId,
    caption,
    value,
    color,
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

    const data = tagList.items.map(tag => {
        const item = {
            value: caption.get(tag).value,
            count: value.get(tag).value
        };

        const tagKey = uniqueId?.get(tag).value;
        if (tagKey) {
            item.key = tagKey;
        }

        const tagColor = color?.get(tag).value;
        if (tagColor) {
            item.color = tagColor;
        }

        return item;
    });

    const clickAction = useCallback(
        tagKey => {
            if (!onClickAction) return;

            if (onClickAction.isExecuting || !onClickAction.canExecute) {
                console.warn("onClickAction cannot be executed.");
                return;
            }

            if (clickedTagId) {
                if (clickedTagId.status !== "available") {
                    console.warn("countryClickedISO is not available.");
                    return;
                } else clickedTagId.setValue(tagKey);
            }

            onClickAction.execute();
        },
        [onClickAction]
    );

    return (
        <TagCloud
            minSize={minSize}
            maxSize={maxSize}
            tags={data}
            shuffle={shuffle}
            onClick={tag => clickAction(tag.key)}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
