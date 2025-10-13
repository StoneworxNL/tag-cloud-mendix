import { createElement, useCallback } from "react";
import { TagCloud } from "react-tagcloud";

export function Cloud({
    tagList,
    uniqueId,
    caption,
    value,
    color,
    onClickAction,
    onDoubleClickAction,
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

    const handleTagAction = useCallback(
        (tagKey, action) => {
            if (!action || action.isExecuting || !action.canExecute) {
                console.warn("Action cannot be executed.");
                return;
            }

            if (clickedTagId?.status === "available") {
                clickedTagId.setValue(tagKey);
            }

            action.execute();
        },
        [clickedTagId]
    );

    return (
        <TagCloud
            minSize={minSize}
            maxSize={maxSize}
            tags={data}
            shuffle={shuffle}
            onClick={tag => handleTagAction(tag.key, onClickAction)}
            onDoubleClick={tag => handleTagAction(tag.key, onDoubleClickAction)}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
