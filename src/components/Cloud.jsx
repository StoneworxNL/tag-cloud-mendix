import { createElement, useCallback, useMemo } from "react";
import { TagCloud } from "react-tagcloud";

export function Cloud({
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
    if (tagList.status === "loading") {
        return <div>Loading...</div>;
    }

    const data = useMemo(() => {
        if (!tagList.items) {
            return [];
        }
        return tagList.items.map(tag => {
            const item = {
                value: caption.get(tag).value,
                count: Number(value.get(tag).value),
                color: color?.get(tag).value
            };

            item.key = uniqueId?.get(tag).value || item.value;
            return item;
        });
    }, [tagList, caption, value, color, uniqueId]);

    const handleTagAction = useCallback(
        (tagKey, action) => {
            if (!action || action.isExecuting || !action.canExecute) {
                console.warn("Action cannot be executed.");
                return;
            }

            action.execute({ eventTagKey: tagKey });
        },
        [onClickAction, onDoubleClickAction, onMouseMoveAction]
    );

    if (data.length === 0) {
        return <div>No tags available.</div>;
    }

    return (
        <TagCloud
            minSize={minSize}
            maxSize={maxSize}
            tags={data}
            shuffle={shuffle}
            onClick={tag => handleTagAction(tag.key, onClickAction)}
            onDoubleClick={tag => handleTagAction(tag.key, onDoubleClickAction)}
            onMouseMove={tag => handleTagAction(tag.key, onMouseMoveAction)}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed}
        />
    );
}
