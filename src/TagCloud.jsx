import { createElement } from "react";

import { Cloud } from "./components/Cloud";
import "./ui/TagCloud.css";

export function TagCloud(props) {
    return <Cloud {...props} className={props.class} />;
}
