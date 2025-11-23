import { select } from "d3-selection";
import { toPng, toSvg } from "html-to-image";
import { addMetadata } from "meta-png";
import { useCallback, useState } from "react";
import { CHART_SVG_ID } from "@/charts/shared/containers";
import { TABLE_PREVIEW_WRAPPER_CLASS_NAME } from "@/components/chart-table-preview";
import { animationFrame } from "@/utils/animation-frame";
import { maybeWindow } from "@/utils/maybe-window";
export const useScreenshot = ({ type, screenshotName, screenshotNode, modifyNode: _modifyNode, pngMetadata, }) => {
    const [loading, setLoading] = useState(false);
    const modifyNode = useCallback(async (clonedNode, originalNode) => {
        removeDisabledElements(clonedNode);
        if (_modifyNode) {
            await _modifyNode(clonedNode, originalNode);
        }
    }, [_modifyNode]);
    const screenshot = useCallback(async () => {
        if (screenshotNode) {
            setLoading(true);
            try {
                await makeScreenshot({
                    type,
                    name: screenshotName,
                    node: screenshotNode,
                    modifyNode,
                    pngMetadata,
                });
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
    }, [screenshotNode, type, screenshotName, modifyNode, pngMetadata]);
    return {
        loading,
        screenshot,
    };
};
const makeScreenshot = async ({ type, name, node, modifyNode, pngMetadata, }) => {
    const isUsingSafari = maybeWindow()
        ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        : false;
    // Add wrapper node to prevent overflow issues in the screenshot
    const wrapperNode = document.createElement("div");
    wrapperNode.style.width = `${node.offsetWidth}px`;
    document.body.appendChild(wrapperNode);
    const clonedNode = node.cloneNode(true);
    const canvasNodes = select(node)
        .selectAll("canvas")
        .nodes();
    const clonedCanvasNodes = select(clonedNode)
        .selectAll("canvas")
        .nodes();
    for (const canvasNode of canvasNodes) {
        const clonedCanvasNode = clonedCanvasNodes[canvasNodes.indexOf(canvasNode)];
        // Cloning the canvas element does not copy the content, so we need to
        // manually copy it.
        const ctx = clonedCanvasNode.getContext("2d");
        ctx.drawImage(canvasNode, 0, 0);
        await animationFrame();
    }
    await (modifyNode === null || modifyNode === void 0 ? void 0 : modifyNode(clonedNode, node));
    wrapperNode.appendChild(clonedNode);
    // Make sure the whole chart is visible in the screenshot (currently only an
    // issue with SVG-based, long bar charts).
    const tableWrapper = clonedNode.querySelector(`.${TABLE_PREVIEW_WRAPPER_CLASS_NAME}`);
    const chartSvg = tableWrapper === null || tableWrapper === void 0 ? void 0 : tableWrapper.querySelector(`#${CHART_SVG_ID}`);
    const chartSvgHeight = chartSvg === null || chartSvg === void 0 ? void 0 : chartSvg.getAttribute("height");
    const chartSvgParent = chartSvg === null || chartSvg === void 0 ? void 0 : chartSvg.parentElement;
    if (tableWrapper && chartSvgHeight && chartSvgParent) {
        tableWrapper.style.height = "fit-content";
        chartSvgParent.style.height = `${chartSvgHeight}px`;
        chartSvgParent.style.overflow = "visible";
    }
    await animationFrame();
    // There's a bug with embedding the fonts in Safari, which appears only when
    // downloading the image for the first time. On subsequent downloads, the
    // font is embedded correctly. To work around this issue, we call the toPng
    // function twice.
    if (isUsingSafari && type === "png") {
        await toPng(wrapperNode);
    }
    await (type === "png" ? toPng : toSvg)(wrapperNode)
        .then((dataUrl) => {
        const download = (dataUrl) => {
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `${name}.${type}`;
            a.click();
        };
        switch (type) {
            case "png": {
                let arrayBuffer = Uint8Array.from(atob(dataUrl.split(",")[1]), (c) => c.charCodeAt(0));
                pngMetadata === null || pngMetadata === void 0 ? void 0 : pngMetadata.forEach(({ key, value }) => {
                    arrayBuffer = addMetadata(arrayBuffer, key, value);
                });
                const dataUrlWithMetadata = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
                return download(dataUrlWithMetadata);
            }
            case "svg":
                return download(dataUrl);
            default:
                const _exhaustiveCheck = type;
                return _exhaustiveCheck;
        }
    })
        .catch((error) => console.error(error))
        .finally(() => {
        wrapperNode.remove();
    });
};
export const DISABLE_SCREENSHOT_ATTR_KEY = "data-disable-screenshot";
/** Apply this attribute to elements that should not be included in the screenshot. */
export const DISABLE_SCREENSHOT_ATTR = {
    [DISABLE_SCREENSHOT_ATTR_KEY]: true,
};
const removeDisabledElements = (node) => {
    node
        .querySelectorAll(`[${DISABLE_SCREENSHOT_ATTR_KEY}="true"]`)
        .forEach((el) => el.remove());
};
