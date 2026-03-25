# Tag Cloud Mendix Pluggable Widget

Simple and extensible tag/word cloud React component based on
[https://www.npmjs.com/package/react-tagcloud](https://www.npmjs.com/package/react-tagcloud).

<img alt="Mendix Pluggable Widget Tag Cloud Logo" src="https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/src/TagCloud.icon.png" width="65px"/>

![Demo](https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/home.png)

## How To Use

1. Create a database entity to store the the Tag (Caption and Value and, optionally, Color as well).

<img alt="Domain Model Example" src="https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/db.png" width="300px"/>

2. Drag and Drop the Tag Cloud widget from the Toolbox and fill in the required properties, namely, a List of Tags, an
   (optional) key, a Caption and Value, Min/Max size in px, among others.

![Configuration in Studio Pro (Data View)](https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/dataview.png)

<img alt="Configuration in Studio Pro (General)" src="https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/generalconfig.png" width="450px"/>

## Events

If you want to handle click, double-click or hover events, add the mendix action on the widget's configurations and optionally send as input to your action the $eventTagKey which contains the key of the tag clicked/double-clicked/hovered.

## Demo project

-   [Mendix app running on the cloud](https://tagcloud-sandbox.mxapps.io/index.html?profile=Responsive)
-   [Mendix demo module (.mpk)](https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/demo/CloudTag.mpk)

You can check the demo [here](https://tagcloud-sandbox.mxapps.io/index.html?profile=Responsive). Please be mindful of
changing the data, as to keep the demo working for every user.

### Tags' Configuration Example

![Countries Configuration](https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/dataoverview.png)

### Demo

![Demo](https://github.com/stoneworxNL/tag-cloud-mendix/blob/main/images/homegif.gif)

## Issues, suggestions and feature requests

Let us know if you find any issues or if you have any feature requests.
