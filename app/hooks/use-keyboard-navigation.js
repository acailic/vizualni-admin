import { useEffect, useCallback } from "react";
/**
 * Hook for handling keyboard navigation
 * Useful for accessible interactive components
 */
export const useKeyboardNavigation = (options) => {
    const { onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, enabled = true, } = options;
    const handleKeyDown = useCallback((event) => {
        if (!enabled)
            return;
        switch (event.key) {
            case "Escape":
                if (onEscape) {
                    event.preventDefault();
                    onEscape();
                }
                break;
            case "Enter":
                if (onEnter) {
                    event.preventDefault();
                    onEnter();
                }
                break;
            case "ArrowUp":
                if (onArrowUp) {
                    event.preventDefault();
                    onArrowUp();
                }
                break;
            case "ArrowDown":
                if (onArrowDown) {
                    event.preventDefault();
                    onArrowDown();
                }
                break;
            case "ArrowLeft":
                if (onArrowLeft) {
                    event.preventDefault();
                    onArrowLeft();
                }
                break;
            case "ArrowRight":
                if (onArrowRight) {
                    event.preventDefault();
                    onArrowRight();
                }
                break;
        }
    }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
    useEffect(() => {
        if (enabled) {
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [enabled, handleKeyDown]);
};
/**
 * Hook for managing focus trap in modals and dialogs
 * Returns a ref to attach to the container element
 */
export const useFocusTrap = (isActive) => {
    useEffect(() => {
        if (!isActive)
            return;
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('[role="dialog"], [role="alertdialog"]');
        if (!modal)
            return;
        const firstFocusable = modal.querySelector(focusableElements);
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusable = focusableContent[focusableContent.length - 1];
        // Focus first element when modal opens
        firstFocusable === null || firstFocusable === void 0 ? void 0 : firstFocusable.focus();
        const handleTabKey = (e) => {
            const isTabPressed = e.key === "Tab";
            if (!isTabPressed)
                return;
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable === null || lastFocusable === void 0 ? void 0 : lastFocusable.focus();
                    e.preventDefault();
                }
            }
            else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable === null || firstFocusable === void 0 ? void 0 : firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        document.addEventListener("keydown", handleTabKey);
        return () => {
            document.removeEventListener("keydown", handleTabKey);
        };
    }, [isActive]);
};
/**
 * Hook to announce messages to screen readers
 */
export const useScreenReaderAnnouncement = () => {
    const announce = useCallback((message, priority = "polite") => {
        // Create or get announcement container
        let announcer = document.getElementById("sr-announcer");
        if (!announcer) {
            announcer = document.createElement("div");
            announcer.id = "sr-announcer";
            announcer.setAttribute("role", "status");
            announcer.setAttribute("aria-live", priority);
            announcer.setAttribute("aria-atomic", "true");
            announcer.style.position = "absolute";
            announcer.style.left = "-10000px";
            announcer.style.width = "1px";
            announcer.style.height = "1px";
            announcer.style.overflow = "hidden";
            document.body.appendChild(announcer);
        }
        // Update aria-live if priority changed
        if (announcer.getAttribute("aria-live") !== priority) {
            announcer.setAttribute("aria-live", priority);
        }
        // Clear and set new message
        announcer.textContent = "";
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }, []);
    return announce;
};
