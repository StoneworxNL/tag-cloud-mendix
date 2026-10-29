/**
 * @typedef Problem
 * @type {object}
 * @property {string} property
 * @property {("error" | "warning" | "deprecation")} severity
 * @property {string} message
 */

const SAMPLE_WORDS = ["Mendix", "Tag", "Cloud", "Low-code", "React", "Widget", "Data", "Words"];

function hideProperties(groups, keys) {
    groups.forEach(group => {
        if (group.properties) {
            group.properties = group.properties.filter(property => !keys.includes(property.key));
        }
        if (group.propertyGroups) {
            hideProperties(group.propertyGroups, keys);
        }
    });
}

/**
 * @param {object} values
 * @param {object[]} defaultProperties
 * @returns {object[]}
 */
export function getProperties(values, defaultProperties) {
    const hidden = [];
    if (values.disableRandomColor) {
        hidden.push("colorLuminosity", "colorHue", "customHue");
    } else if (values.colorHue !== "custom") {
        hidden.push("customHue");
    }
    hideProperties(defaultProperties, hidden);
    return defaultProperties;
}

/**
 * @param {object} values
 * @returns {Problem[]}
 */
export function check(values) {
    const errors = [];
    if (values.minSize <= 0) {
        errors.push({ property: "minSize", message: "Minimum Size must be greater than 0." });
    }
    if (values.maxSize < values.minSize) {
        errors.push({ property: "maxSize", message: "Maximum Size must be greater than or equal to Minimum Size." });
    }
    if (values.colorHue === "custom" && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(values.customHue || "")) {
        errors.push({ property: "customHue", message: "Custom Hue must be a hex color such as #E4572E." });
    }
    return errors;
}

/**
 * @param {object} values
 * @param {boolean} isDarkMode
 * @returns {object}
 */
export function getPreview(values, isDarkMode) {
    const min = values.minSize > 0 ? values.minSize : 12;
    const max = values.maxSize >= min ? values.maxSize : min;
    const palette = isDarkMode
        ? ["#8FB8DE", "#F4A261", "#E9C46A", "#90BE6D", "#CDB4DB"]
        : ["#1D3557", "#E4572E", "#2A9D8F", "#6A4C93", "#F4A261"];
    return {
        type: "Container",
        borders: true,
        borderRadius: 4,
        padding: 8,
        children: [
            {
                type: "RowLayout",
                columnSize: "fixed",
                children: SAMPLE_WORDS.map((word, index) => ({
                    type: "Container",
                    padding: 4,
                    children: [
                        {
                            type: "Text",
                            content: word,
                            fontSize: Math.round(
                                min + ((max - min) * ((index * 5) % SAMPLE_WORDS.length)) / (SAMPLE_WORDS.length - 1)
                            ),
                            fontColor: values.disableRandomColor ? undefined : palette[index % palette.length]
                        }
                    ]
                }))
            }
        ]
    };
}
