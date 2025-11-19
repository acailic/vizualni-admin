/**
 * Unified Tooltip component and legacy exports
 *
 * This module consolidates three previously separate tooltip components:
 * - MaybeTooltip: Conditional tooltip (only shows if title is provided)
 * - OverflowTooltip: Overflow detection tooltip (shows when content overflows)
 * - InfoIconTooltip: Info icon with tooltip
 *
 * The unified Tooltip component supports all three use cases via the `variant` prop.
 * Legacy exports are provided for backward compatibility.
 */

export {
  type ConditionalTooltipProps,
  type DefaultTooltipProps,
  type InfoIconTooltipProps,
  type OverflowTooltipProps,
  type UnifiedTooltipProps,
  InfoIconTooltip,
  MaybeTooltip,
  OverflowTooltip,
  Tooltip,
} from "./Tooltip";
