"use client";
import { Grow, Popper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
export const TransitionPopper = ({ children, open, anchorX, anchorY, ...rest }) => {
    const [isClosing, setIsClosing] = useState(false);
    const childrenRef = useRef();
    // Make sure the children do not disappear mid-transition.
    useEffect(() => {
        if (open) {
            setIsClosing(false);
        }
    }, [open]);
    return (<Popper open={open} keepMounted modifiers={[
            ...modifiers,
            // Mirroring default Select's behavior.
            {
                name: "computeTransformOrigin",
                enabled: true,
                phase: "write",
                fn: ({ state, }) => {
                    const el = state.elements.popper;
                    if (!el) {
                        return;
                    }
                    const { left, top, width, height } = el.getBoundingClientRect();
                    const x = Math.max(0, Math.min(anchorX - left, width));
                    const y = Math.max(0, Math.min(anchorY - top, height));
                    el.style.setProperty("--transform-origin", `${x}px ${y}px`);
                },
            },
        ]} {...rest} transition>
      {({ TransitionProps, placement }) => {
            const content = typeof children === "function"
                ? children({ TransitionProps, placement })
                : children !== null && children !== void 0 ? children : null;
            if (open) {
                childrenRef.current = content;
            }
            return (<Grow {...TransitionProps} onExit={() => setIsClosing(true)} style={{ transformOrigin: `var(--transform-origin)` }}>
          <div>{isClosing ? childrenRef.current : content}</div>
        </Grow>);
        }}
    </Popper>);
};
const modifiers = [
    {
        name: "flip",
        enabled: false,
    },
    {
        name: "preventOverflow",
        enabled: true,
        options: {
            boundary: "viewport",
            altBoundary: true,
            padding: 8,
            tether: true,
            mainAxis: true,
            altAxis: true,
        },
    },
];
