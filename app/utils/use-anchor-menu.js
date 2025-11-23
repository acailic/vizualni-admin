import { useCallback, useState } from "react";
/**
 * Hook for managing anchor-based menus and popovers
 *
 * This hook consolidates the common pattern of managing an anchor element
 * for MUI Menu and Popover components. It replaces the repeated pattern of:
 *
 * @example
 * // Before (manual state management)
 * const [anchor, setAnchor] = useState<HTMLElement | null>(null);
 * const handleClick = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
 * const handleClose = () => setAnchor(null);
 * const isOpen = Boolean(anchor);
 *
 * @example
 * // After (using useAnchorMenu)
 * const menu = useAnchorMenu();
 * // Use menu.open, menu.close, menu.isOpen, menu.anchor
 *
 * @example
 * // Usage with MUI Menu
 * const menu = useAnchorMenu();
 * return (
 *   <>
 *     <Button onClick={menu.open}>Open Menu</Button>
 *     <Menu {...menu.menuProps}>
 *       <MenuItem onClick={menu.close}>Option 1</MenuItem>
 *     </Menu>
 *   </>
 * );
 *
 * @example
 * // Usage with MUI Popover
 * const popover = useAnchorMenu();
 * return (
 *   <>
 *     <Button onClick={popover.open}>Open Popover</Button>
 *     <Popover {...popover.popoverProps}>
 *       <div>Popover content</div>
 *     </Popover>
 *   </>
 * );
 */
export const useAnchorMenu = () => {
    const [anchor, setAnchor] = useState(null);
    const open = useCallback((event) => {
        setAnchor(event.currentTarget);
    }, []);
    const close = useCallback(() => {
        setAnchor(null);
    }, []);
    const isOpen = Boolean(anchor);
    return {
        /** The anchor element for the menu/popover */
        anchor,
        /** Open the menu/popover (pass this to onClick handler) */
        open,
        /** Close the menu/popover */
        close,
        /** Whether the menu/popover is currently open */
        isOpen,
        /** Set the anchor element directly (for advanced use cases) */
        setAnchor,
        /**
         * Props to spread on MUI Menu component
         * @example <Menu {...menu.menuProps}>...</Menu>
         */
        menuProps: {
            anchorEl: anchor,
            open: isOpen,
            onClose: close,
        },
        /**
         * Props to spread on MUI Popover component
         * @example <Popover {...popover.popoverProps}>...</Popover>
         */
        popoverProps: {
            anchorEl: anchor,
            open: isOpen,
            onClose: close,
        },
    };
};
/**
 * Hook for managing anchor-based menus with custom initial state
 *
 * @param initialAnchor - Initial anchor element (optional)
 * @returns Same API as useAnchorMenu but with initial anchor set
 */
export const useAnchorMenuWithInitial = (initialAnchor) => {
    const [anchor, setAnchor] = useState(initialAnchor !== null && initialAnchor !== void 0 ? initialAnchor : null);
    const open = useCallback((event) => {
        setAnchor(event.currentTarget);
    }, []);
    const close = useCallback(() => {
        setAnchor(null);
    }, []);
    const isOpen = Boolean(anchor);
    return {
        anchor,
        open,
        close,
        isOpen,
        setAnchor,
        menuProps: {
            anchorEl: anchor,
            open: isOpen,
            onClose: close,
        },
        popoverProps: {
            anchorEl: anchor,
            open: isOpen,
            onClose: close,
        },
    };
};
