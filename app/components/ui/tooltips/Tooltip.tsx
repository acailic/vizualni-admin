import { Tooltip as MUITooltip, TooltipProps } from "@mui/material";
import { MouseEvent, ReactNode, useState } from "react";

import { Icon } from "@/icons";
import { useEvent } from "@/utils/use-event";

/**
 * Unified Tooltip component that supports multiple variants:
 * - default: Standard MUI tooltip
 * - conditional: Only shows tooltip if title is provided (replaces MaybeTooltip)
 * - overflow: Only shows tooltip when content overflows (replaces OverflowTooltip)
 * - info-icon: Shows an info icon with tooltip (replaces InfoIconTooltip)
 */

// Base props for all tooltip variants
type BaseTooltipProps = Omit<TooltipProps, "children" | "title"> & {
  title?: JSX.Element | ReactNode | string;
  children: JSX.Element;
};

// Props for conditional variant (MaybeTooltip replacement)
export type ConditionalTooltipProps = BaseTooltipProps & {
  variant: "conditional";
};

// Props for overflow variant (OverflowTooltip replacement)
export type OverflowTooltipProps = Omit<TooltipProps, "open"> & {
  variant: "overflow";
};

// Props for info-icon variant (InfoIconTooltip replacement)
export type InfoIconTooltipProps = Omit<TooltipProps, "children"> & {
  variant: "info-icon";
  title: NonNullable<ReactNode>;
  size?: number;
};

// Props for default variant
export type DefaultTooltipProps = BaseTooltipProps & {
  variant?: "default";
};

// Union of all variant props
export type UnifiedTooltipProps =
  | DefaultTooltipProps
  | ConditionalTooltipProps
  | OverflowTooltipProps
  | InfoIconTooltipProps;

/**
 * Internal component for overflow variant to ensure hooks are called unconditionally
 */
const OverflowTooltipInternal = ({ children, ...rest }: Omit<TooltipProps, "open">) => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = useEvent(
    ({ currentTarget: { scrollWidth, clientWidth } }: MouseEvent) => {
      if (scrollWidth > clientWidth) {
        setOpen(true);
      }
    }
  );

  return (
    <MUITooltip
      {...rest}
      open={open}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
      disableHoverListener={!open}
    >
      {children}
    </MUITooltip>
  );
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
export const Tooltip = (props: UnifiedTooltipProps) => {
  const variant = props.variant || "default";

  // Conditional variant (MaybeTooltip replacement)
  if (variant === "conditional") {
    const { title, children, variant: _, ...tooltipProps } = props as ConditionalTooltipProps;
    return title ? (
      <MUITooltip arrow title={title} disableInteractive {...tooltipProps}>
        {children}
      </MUITooltip>
    ) : (
      children
    );
  }

  // Overflow variant (OverflowTooltip replacement)
  if (variant === "overflow") {
    const { children, variant: _, ...rest } = props as OverflowTooltipProps;
    return <OverflowTooltipInternal {...rest}>{children}</OverflowTooltipInternal>;
  }

  // Info icon variant (InfoIconTooltip replacement)
  if (variant === "info-icon") {
    const {
      title,
      size = 24,
      placement = "top",
      variant: _,
      ...rest
    } = props as InfoIconTooltipProps;

    return (
      <MUITooltip
        arrow
        placement={placement}
        title={title}
        disableInteractive
        {...rest}
      >
        <div style={{ lineHeight: 0 }}>
          <Icon name="infoCircle" size={size} />
        </div>
      </MUITooltip>
    );
  }

  // Default variant
  const { title, children, variant: _, ...tooltipProps } = props as DefaultTooltipProps;
  return (
    <MUITooltip arrow title={title} disableInteractive {...tooltipProps}>
      {children}
    </MUITooltip>
  );
};

/**
 * Legacy exports for backward compatibility
 * These maintain the original component names but use the unified implementation
 */

export const MaybeTooltip = ({
  title,
  children,
  tooltipProps,
}: {
  title?: JSX.Element | ReactNode | string;
  children: JSX.Element;
  tooltipProps?: Omit<TooltipProps, "children" | "title">;
}) => {
  return (
    <Tooltip variant="conditional" title={title} {...tooltipProps}>
      {children}
    </Tooltip>
  );
};

export const OverflowTooltip = ({
  children,
  ...props
}: Omit<TooltipProps, "open">) => {
  return (
    <Tooltip variant="overflow" {...props}>
      {children}
    </Tooltip>
  );
};

export const InfoIconTooltip = (
  props: {
    title: NonNullable<ReactNode>;
    size?: number;
  } & Omit<TooltipProps, "children" | "title">
) => {
  return <Tooltip variant="info-icon" {...props} />;
};
