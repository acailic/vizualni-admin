import { GA_TRACKING_ID } from "../domain/env";
// https://developers.google.com/analytics/devguides/collection/gtagjs/ip-anonymization
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const analyticsPageView = (path) => {
    var _a;
    (_a = window.gtag) === null || _a === void 0 ? void 0 : _a.call(window, "config", GA_TRACKING_ID, {
        page_path: path,
        anonymize_ip: true,
    });
};
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
/** @internal */
export const analyticsEvent = ({ action, category, label, value, }) => {
    var _a;
    (_a = window.gtag) === null || _a === void 0 ? void 0 : _a.call(window, "event", action, {
        event_category: category,
        event_label: label,
        value: value,
        anonymize_ip: true,
    });
};
