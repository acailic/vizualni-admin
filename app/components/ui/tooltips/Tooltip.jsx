import { Tooltip as MUITooltip } from "@mui/material";
import { useState } from "react";
import { Icon } from "@/icons";
import { useEvent } from "@/utils/use-event";
/**
 * Internal component for overflow variant to ensure hooks are called unconditionally
 */
const OverflowTooltipInternal = ({ children, ...rest }) => {
    const [open, setOpen] = useState(false);
    const handleMouseEnter = useEvent(({ currentTarget: { scrollWidth, clientWidth } }) => {
        if (scrollWidth > clientWidth) {
            setOpen(true);
        }
    });
    return (<MUITooltip {...rest} open={open} onMouseEnter={handleMouseEnter} onMouseLeave={() => setOpen(false)} disableHoverListener={!open}>
      {children}
    </MUITooltip>);
};
/**
 * Unified Tooltip component
 *
 * @example
 * // Conditional tooltip (only shows if title is provided)
 * <Tooltip variant="conditional" title={maybeTitle}>
 *   <Button>Hover me</Button>
 * </Tooltip>
 *
 * @example
 * // Overflow tooltip (only shows when content overflows)
 * <Tooltip variant="overflow" title="Full content here">
 *   <div>Truncated content...</div>
 * </Tooltip>
 *
 * @example
 * // Info icon tooltip
 * <Tooltip variant="info-icon" title="Helpful information" size={20} />
 */
export const Tooltip = (props) => {
    const variant = props.variant || "default";
    // Conditional variant (MaybeTooltip replacement)
    if (variant === "conditional") {
        const { title, children, variant: _, ...tooltipProps } = props;
        return title ? (<MUITooltip arrow title={title} disableInteractive {...tooltipProps}>
        {children}
      </MUITooltip>) : (children);
    }
    // Overflow variant (OverflowTooltip replacement)
    if (variant === "overflow") {
        const { children, variant: _, ...rest } = props;
        return <OverflowTooltipInternal {...rest}>{children}</OverflowTooltipInternal>;
    }
    // Info icon variant (InfoIconTooltip replacement)
    if (variant === "info-icon") {
        const { title, size = 24, placement = "top", variant: _, ...rest } = props;
        return (<MUITooltip arrow placement={placement} title={title} disableInteractive {...rest}>
        <div style={{ lineHeight: 0 }}>
          <Icon name="infoCircle" size={size}/>
        </div>
      </MUITooltip>);
    }
    // Default variant
    const { title, children, variant: _, ...tooltipProps } = props;
    return (<MUITooltip arrow title={title} disableInteractive {...tooltipProps}>
      {children}
    </MUITooltip>);
};
/**
 * Legacy exports for backward compatibility
 * These maintain the original component names but use the unified implementation
 */
export const MaybeTooltip = ({ title, children, tooltipProps, }) => {
    return (<Tooltip variant="conditional" title={title} {...tooltipProps}>
      {children}
    </Tooltip>);
};
export const OverflowTooltip = ({ children, ...props }) => {
    return (<Tooltip variant="overflow" {...props}>
      {children}
    </Tooltip>);
};
export const InfoIconTooltip = (props) => {
    return <Tooltip variant="info-icon" {...props}/>;
};
