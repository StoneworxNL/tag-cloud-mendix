# Changelog

## 1.1.0

Requires Mendix 11 (Pluggable Widgets Tools 11, React 19), as 1.0.1 already did.

### Added

-   Tag Style: plain text or pills.
-   Tooltip (text template) and Tag Class (expression) per tag.
-   Random color options: Luminosity, Hue and a custom hex hue.
-   On Mouse Out action, and On Click (object), which receives the clicked tag object.
-   Translatable Empty Message.
-   Tag Key accepts Integer, Long, AutoNumber and Enum attributes; Caption accepts Enum attributes.
-   Clickable tags can be reached with Tab and activated with Enter or Space.
-   Studio Pro: design-mode and structure-mode previews, property checks, help link, grouped properties.

### Changed

-   **On Mouse Move now runs once per tag the mouse enters** (like a mouse enter), instead of on every mouse
    movement. Use a nanoflow for On Mouse Move and On Mouse Out.
-   Mouse and click handlers are only attached when an action is configured; no more console warnings.
-   The widget no longer needs a surrounding data view.
-   Studio Pro Class and Style are applied to the cloud.
-   Tags stay visible while the data source reloads.
-   Changing a tag's color, tooltip or class updates the cloud immediately.
-   Tags with the same caption are all shown; actions receive the real key.
-   Icon reduced from 1.1 MB to 4 KB; tile image added.

### Fixed

-   Crash ("Rendered fewer hooks than expected") when the data source went back to loading.
-   An empty Value broke every font size; empty values now count as 0.
-   Mouse move skipped while its action was still running is retried on the next move, and a skipped mouse out runs
    once the action is free.

## 1.0.1

-   Pluggable Widgets Tools 11, memoised data, empty state, On Mouse Move action.
