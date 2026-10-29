import { createElement, useCallback, useMemo, useRef } from "react";
import { TagCloud } from "react-tagcloud";
import classNames from "classnames";

const ACTIVATION_KEYS = ["Enter", " "];

function toNumber(value) {
    if (value === undefined || value === null) {
        return 0;
    }
    const number = Number(value.toString());
    return Number.isFinite(number) ? number : 0;
}

function canRun(action) {
    return !!action && action.canExecute && !action.isExecuting;
}

export function Cloud({
    className,
    style,
    tagList,
    uniqueId,
    caption,
    value,
    color,
    tooltip,
    tagClass,
    onClickAction,
    onDoubleClickAction,
    onMouseMoveAction,
    onMouseOutAction,
    onClickItemAction,
    minSize,
    maxSize,
    shuffle,
    disableRandomColor,
    randomSeed,
    colorLuminosity,
    colorHue,
    customHue,
    renderMode,
    emptyMessage
}) {
    // react-tagcloud keeps its own shuffled copy of the tags and only refreshes it when key, value or count
    // change. Everything else (color, tooltip, class, object) is looked up here at render time so edits show up.
    const metaByKey = useRef(new Map());
    const hoveredKey = useRef(null);

    const data = useMemo(() => {
        const meta = new Map();
        const tags = (tagList.items ?? []).map(item => {
            const text = caption.get(item).displayValue ?? "";
            const rawKey = uniqueId?.get(item).value;
            let key = rawKey !== undefined && rawKey !== null && rawKey !== "" ? rawKey.toString() : text;
            // Duplicate keys would make React drop tags; keep them visible and distinguishable.
            for (let n = 2; meta.has(key); n++) {
                key = `${key}#${n}`;
            }
            meta.set(key, {
                item,
                color: color?.get(item).value || undefined,
                tooltip: tooltip?.get(item).value || undefined,
                tagClass: tagClass?.get(item).value || undefined
            });
            return { key, value: text, count: toNumber(value.get(item).value) };
        });
        metaByKey.current = meta;
        return tags;
    }, [tagList, caption, value, color, uniqueId, tooltip, tagClass]);

    const colorOptions = useMemo(() => {
        const options = {};
        if (colorLuminosity && colorLuminosity !== "any") {
            options.luminosity = colorLuminosity;
        }
        if (colorHue === "custom") {
            if (customHue) {
                options.hue = customHue;
            }
        } else if (colorHue && colorHue !== "any") {
            options.hue = colorHue;
        }
        return options;
    }, [colorLuminosity, colorHue, customHue]);

    const run = useCallback((action, tagKey) => {
        if (canRun(action)) {
            action.execute({ eventTagKey: tagKey });
        }
    }, []);

    const handleClick = useCallback(
        tagKey => {
            run(onClickAction, tagKey);
            const item = metaByKey.current.get(tagKey)?.item;
            if (item && onClickItemAction) {
                const itemAction = onClickItemAction.get(item);
                if (canRun(itemAction)) {
                    itemAction.execute();
                }
            }
        },
        [run, onClickAction, onClickItemAction]
    );

    const clickable = !!onClickAction || !!onClickItemAction;

    const renderer = useCallback(
        (tag, size, generatedColor) => {
            const meta = metaByKey.current.get(tag.key) ?? {};
            const tagColor = meta.color ?? generatedColor;
            const isPill = renderMode === "pill";
            const tagStyle = isPill
                ? { fontSize: `${size}px`, backgroundColor: tagColor }
                : { fontSize: `${size}px`, color: tagColor };

            return (
                <span
                    key={tag.key}
                    className={classNames("tag-cloud-tag", meta.tagClass, {
                        "tag-cloud-tag--pill": isPill,
                        "tag-cloud-tag--clickable": clickable
                    })}
                    style={tagStyle}
                    title={meta.tooltip}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    aria-label={meta.tooltip ? `${tag.value}, ${meta.tooltip}` : undefined}
                    onKeyDown={
                        clickable
                            ? event => {
                                  if (ACTIVATION_KEYS.includes(event.key)) {
                                      event.preventDefault();
                                      handleClick(tag.key);
                                  }
                              }
                            : undefined
                    }
                >
                    {tag.value}
                </span>
            );
        },
        [renderMode, clickable, handleClick]
    );

    // Mouse handlers must be given to the cloud, not set on the rendered tag: react-tagcloud 2.3.3 crashes
    // (`origHandlers is not a function`) when a rendered tag has its own onClick/onMouseMove/... handler.
    const onClick = clickable ? tag => handleClick(tag.key) : undefined;
    const onDoubleClick = onDoubleClickAction ? tag => run(onDoubleClickAction, tag.key) : undefined;
    const onMouseMove = onMouseMoveAction
        ? tag => {
              if (hoveredKey.current !== tag.key) {
                  hoveredKey.current = tag.key;
                  run(onMouseMoveAction, tag.key);
              }
          }
        : undefined;
    const onMouseOut =
        onMouseMoveAction || onMouseOutAction
            ? tag => {
                  hoveredKey.current = null;
                  run(onMouseOutAction, tag.key);
              }
            : undefined;

    const rootClassName = classNames("widget-tag-cloud", className, {
        "widget-tag-cloud--pill": renderMode === "pill"
    });

    if (tagList.status === "loading" && data.length === 0) {
        return (
            <div className={classNames(rootClassName, "widget-tag-cloud--loading")} style={style} aria-busy="true" />
        );
    }

    if (data.length === 0) {
        return (
            <div className={classNames(rootClassName, "widget-tag-cloud--empty")} style={style}>
                {emptyMessage?.value ?? "No tags available."}
            </div>
        );
    }

    return (
        <TagCloud
            className={rootClassName}
            style={style}
            tags={data}
            minSize={minSize}
            maxSize={maxSize}
            shuffle={shuffle}
            disableRandomColor={disableRandomColor}
            randomSeed={randomSeed || undefined}
            colorOptions={colorOptions}
            renderer={renderer}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
        />
    );
}
