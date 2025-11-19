# UI Components and Utilities

This directory contains reusable UI components and utilities that have been refactored for better modularity and code reuse.

## Directory Structure

```
ui/
├── dialogs/           # Reusable dialog components
│   ├── DialogBase.tsx
│   └── index.ts
├── tooltips/          # Unified tooltip components
│   ├── Tooltip.tsx
│   └── index.ts
└── README.md
```

## Components

### Tooltips (`/ui/tooltips`)

The unified Tooltip component consolidates three previously separate tooltip implementations:
- `MaybeTooltip` → `<Tooltip variant="conditional">`
- `OverflowTooltip` → `<Tooltip variant="overflow">`
- `InfoIconTooltip` → `<Tooltip variant="info-icon">`

**Benefits:**
- Reduces code duplication (~86 lines)
- Single source of truth for tooltip behavior
- Consistent API across all tooltip types
- Better TypeScript support with variant-specific props

**Usage:**

```tsx
import { Tooltip } from '@/components/ui/tooltips';

// Conditional tooltip (only shows if title is provided)
<Tooltip variant="conditional" title={maybeTitle}>
  <Button>Hover me</Button>
</Tooltip>

// Overflow tooltip (only shows when content overflows)
<Tooltip variant="overflow" title="Full content here">
  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
    Truncated content...
  </div>
</Tooltip>

// Info icon tooltip
<Tooltip variant="info-icon" title="Helpful information" size={20} />
```

**Legacy Support:**

For backward compatibility, the old component names are still exported:

```tsx
import { MaybeTooltip, OverflowTooltip, InfoIconTooltip } from '@/components/ui/tooltips';
```

These are now thin wrappers around the unified component and will show deprecation warnings in TypeScript.

---

### Dialogs (`/ui/dialogs`)

Reusable dialog components that consolidate common dialog patterns:
- `DialogBase` - Flexible base component
- `ConfirmationDialogBase` - Yes/No confirmations
- `FormDialogBase` - Form submissions

**Benefits:**
- Reduces dialog boilerplate
- Consistent spacing and styling
- Built-in loading states
- Standardized action buttons

**Usage:**

```tsx
import { ConfirmationDialogBase, FormDialogBase } from '@/components/ui/dialogs';

// Confirmation dialog
<ConfirmationDialogBase
  open={open}
  onClose={handleClose}
  title="Delete Chart?"
  text="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={handleClose}
  loading={isDeleting}
/>

// Form dialog
<FormDialogBase
  open={open}
  onClose={handleClose}
  title="Rename Chart"
  onSubmit={handleSubmit}
>
  <Input name="title" label="Chart Title" />
</FormDialogBase>
```

---

## Utilities

### Chart URLs (`/utils/chart-urls.ts`)

URL building utilities for chart operations:

**Benefits:**
- Eliminates useState/useEffect patterns for URL building
- Consistent URL structure across the app
- Type-safe URL generation

**Functions:**
- `buildCopyChartUrl(configKey, locale)` - URL for copying a chart
- `buildShareChartUrl(configKey, locale)` - URL for sharing a chart
- `buildViewChartUrl(configKey, locale)` - URL for viewing a chart
- `buildNewChartUrl(locale)` - URL for creating a new chart
- `buildEditChartUrl(configKey, locale)` - URL for editing a chart

**Hook:**
- `useChartUrls(locale)` - Returns URL builders pre-configured with locale

**Usage:**

```tsx
import { useChartUrls } from '@/utils/chart-urls';

const MyComponent = () => {
  const locale = useLocale();
  const { getCopyUrl, getShareUrl } = useChartUrls(locale);

  const copyUrl = getCopyUrl('chart-123');
  const shareUrl = getShareUrl('chart-123');

  return (
    <a href={shareUrl}>Share Chart</a>
  );
};
```

---

### Anchor Menu Hook (`/utils/use-anchor-menu.ts`)

Hook for managing anchor-based menus and popovers:

**Benefits:**
- Replaces 9+ instances of manual anchor state management
- Reduces boilerplate by ~50+ lines
- Provides ready-to-use props for MUI Menu/Popover

**Usage:**

```tsx
import { useAnchorMenu } from '@/utils/use-anchor-menu';

const MyComponent = () => {
  const menu = useAnchorMenu();

  return (
    <>
      <Button onClick={menu.open}>Open Menu</Button>
      <Menu {...menu.menuProps}>
        <MenuItem onClick={menu.close}>Option 1</MenuItem>
        <MenuItem onClick={menu.close}>Option 2</MenuItem>
      </Menu>
    </>
  );
};

// Or with Popover
const MyPopover = () => {
  const popover = useAnchorMenu();

  return (
    <>
      <IconButton onClick={popover.open}>
        <InfoIcon />
      </IconButton>
      <Popover {...popover.popoverProps}>
        <div>Popover content</div>
      </Popover>
    </>
  );
};
```

---

## Migration Guide

### Migrating Tooltips

**Before:**
```tsx
import { MaybeTooltip } from '@/components/maybe-tooltip';

<MaybeTooltip title={title} tooltipProps={{ placement: 'top' }}>
  <Button>Click me</Button>
</MaybeTooltip>
```

**After:**
```tsx
import { Tooltip } from '@/components/ui/tooltips';

<Tooltip variant="conditional" title={title} placement="top">
  <Button>Click me</Button>
</Tooltip>
```

---

### Migrating Menu Anchors

**Before:**
```tsx
const [anchor, setAnchor] = useState<HTMLElement | null>(null);
const handleClick = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
const handleClose = () => setAnchor(null);
const isOpen = Boolean(anchor);

return (
  <>
    <Button onClick={handleClick}>Menu</Button>
    <Menu anchorEl={anchor} open={isOpen} onClose={handleClose}>
      <MenuItem>Item</MenuItem>
    </Menu>
  </>
);
```

**After:**
```tsx
import { useAnchorMenu } from '@/utils/use-anchor-menu';

const menu = useAnchorMenu();

return (
  <>
    <Button onClick={menu.open}>Menu</Button>
    <Menu {...menu.menuProps}>
      <MenuItem onClick={menu.close}>Item</MenuItem>
    </Menu>
  </>
);
```

---

### Migrating Chart URLs

**Before:**
```tsx
const [copyUrl, setCopyUrl] = useState("");
useEffect(() => {
  setCopyUrl(`${window.location.origin}/${locale}/create/new?copy=${configKey}`);
}, [configKey, locale]);
```

**After:**
```tsx
import { useChartUrls } from '@/utils/chart-urls';

const { getCopyUrl } = useChartUrls(locale);
const copyUrl = getCopyUrl(configKey);
```

---

## Performance Benefits

| Refactoring | Lines Saved | Files Consolidated | Patterns Replaced |
|-------------|-------------|-------------------|-------------------|
| Unified Tooltips | ~86 | 3 → 1 | 3 variants |
| useAnchorMenu | ~50+ | 9 instances | Anchor state |
| Chart URLs | ~30 | Multiple | useState + useEffect |
| Dialog Base | TBD | 2+ | Dialog patterns |

**Total estimated reduction:** ~150-200 lines of duplicated code

---

## Best Practices

1. **Always use the unified components** instead of creating new ones
2. **Extend base components** when you need custom behavior
3. **Use TypeScript variants** for type-safe prop validation
4. **Prefer composition** over duplication
5. **Document new patterns** in this README

---

## Future Improvements

Potential areas for further modularization:
- Form field wrapper component
- Chart actions builder utility
- Shared styles library
- Provider factory pattern
- Screenshot/export utilities

---

## Questions?

For questions or suggestions about these refactorings, please refer to the codebase analysis or open a discussion.
