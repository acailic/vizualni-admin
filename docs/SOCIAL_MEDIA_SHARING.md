# Social Media Sharing for Visualizations

This document describes how to share visualizations on social media platforms including LinkedIn, X.com (Twitter), Facebook, and more.

## Overview

The visualization platform now supports comprehensive social media sharing capabilities:

- **LinkedIn** - Share professional data visualizations
- **X (Twitter)** - Tweet charts with custom text
- **Facebook** - Post visualizations to your timeline
- **Email** - Share via email with formatted messages
- **PNG Download** - Export high-quality images for manual sharing
- **URL Sharing** - Copy shareable links to clipboard

## Components

### 1. PublishActions Component (Enhanced)

The existing `PublishActions` component has been enhanced to include LinkedIn sharing.

**Location:** `app/components/publish-actions.tsx`

**Usage:**
```tsx
import { PublishActions } from "@/components/publish-actions";

<PublishActions
  chartWrapperRef={chartWrapperRef}
  configKey="your-chart-config-key"
  locale={locale}
/>
```

**Features:**
- Share button with LinkedIn, X (Twitter), Facebook, and Email options
- Embed button with iframe code generation
- All social share links open in new windows with proper security attributes

### 2. SocialMediaShare Component (New)

A dedicated social media sharing component with enhanced features.

**Location:** `app/components/social-media-share.tsx`

**Usage:**
```tsx
import { SocialMediaShare } from "@/components/social-media-share";

<SocialMediaShare
  chartWrapperRef={chartWrapperRef}
  configKey="your-chart-config-key"
  locale={locale}
  chartTitle="Your Chart Title"
  chartDescription="Description for social sharing"
/>
```

**Props:**
- `chartWrapperRef` - Reference to the chart container for PNG export
- `configKey` - Unique identifier for the chart
- `locale` - Language locale (e.g., 'en', 'sr')
- `chartTitle` - Title to use in social shares (optional)
- `chartDescription` - Description for social shares (optional)

**Features:**
- Quick share buttons for all major platforms
- Download visualization as PNG with embedded metadata
- Customizable share text with live editing
- Copy URL and text to clipboard
- Email sharing with pre-filled content

## Sharing URLs

### LinkedIn
```
https://www.linkedin.com/sharing/share-offsite/?url={encoded_url}
```

### X (Twitter)
```
https://twitter.com/intent/tweet?text={encoded_text}&url={encoded_url}&via=bafuCH
```

### Facebook
```
https://www.facebook.com/sharer/sharer.php?u={encoded_url}
```

### Email
```
mailto:?subject={subject}&body={body}
```

## PNG Export Features

When downloading visualizations as PNG images, the following metadata is embedded:

- **Title** - Chart title
- **Description** - Chart description
- **Source** - URL to the visualization
- **Software** - "visualize.admin.ch"

This metadata ensures proper attribution and tracking when images are shared.

## Demo

A comprehensive demo is available at:

**Location:** `app/pages/demos/social-media-sharing.tsx`

**Access:** Navigate to `/demos/social-media-sharing` in your browser

The demo showcases:
- Live chart with social sharing buttons
- Side-by-side comparison of standard and enhanced sharing
- Feature overview with all platforms
- Implementation examples
- Best practices for social media sharing

## Best Practices

### For LinkedIn
- Use professional titles and descriptions
- Add industry context or insights
- Consider tagging relevant connections
- Share during business hours for maximum engagement

### For X (Twitter)
- Keep text under 280 characters
- Use relevant hashtags (2-3 recommended)
- Include a clear call-to-action
- Consider threading for complex visualizations

### For Facebook
- Use engaging, conversational language
- Ask questions to encourage discussion
- Post when your audience is most active
- Consider using Facebook's scheduling features

### General Tips
- Ensure visualizations are readable on mobile devices
- Use high-contrast colors for better visibility
- Keep titles concise and descriptive
- Test shares before posting to verify appearance
- Download PNG for platforms not directly supported (Instagram, Pinterest, etc.)

## Technical Implementation

### How It Works

1. **URL Generation**: Each visualization has a unique shareable URL in the format:
   ```
   {origin}/{locale}/v/{configKey}
   ```

2. **Share Links**: Platform-specific URLs are generated using standard sharing APIs
   - All URLs are properly encoded using `encodeURIComponent()`
   - Links open in new windows with `target="_blank"` and security attributes

3. **PNG Export**: Uses the existing `useScreenshot` hook
   - Captures the entire chart wrapper
   - Embeds metadata using the `meta-png` library
   - Handles Safari-specific rendering issues
   - Downloads with descriptive filename

4. **Copy to Clipboard**: Uses `clipboard-polyfill` for cross-browser support
   - Visual feedback with tooltips
   - Works with both URLs and custom text

## Internationalization

All UI text supports multiple languages via `@lingui/macro`:

- `publication.share.linktitle.linkedin` - "Share on LinkedIn"
- `publication.share.linktitle.x` - "Share on X (Twitter)"
- `publication.share.linktitle.facebook` - "Share on Facebook"
- `social.share.download.button` - "Download PNG Image"
- And more...

To add translations, update the locale files in your i18n setup.

## Icons

The following icons are used (from `app/icons`):

- `linkedIn` - LinkedIn logo
- `twitter` - X/Twitter logo
- `facebook` - Facebook logo
- `envelope` - Email icon
- `share` - Generic share icon
- `download` - Download icon
- `copy` - Copy icon

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Optimized for iOS and Android
- **Clipboard API**: Fallback for older browsers via clipboard-polyfill
- **PNG Export**: Safari-specific handling for font embedding

## Security

All external share links include:
- `target="_blank"` - Opens in new tab/window
- `rel="noopener noreferrer"` - Prevents security vulnerabilities

URLs are properly encoded to prevent injection attacks.

## Future Enhancements

Potential improvements:
- Instagram sharing via image download
- WhatsApp sharing support
- QR code generation for mobile sharing
- Social media preview optimization (Open Graph tags)
- Analytics tracking for share clicks
- Customizable share templates per platform
- Multi-image carousel support

## Support

For issues or questions:
- Check the demo at `/demos/social-media-sharing`
- Review component source code
- Test in different browsers
- Verify chart wrapper ref is properly set

## Changelog

### Version 1.0.0 (2025-11-19)
- Added LinkedIn sharing to PublishActions component
- Created SocialMediaShare component with enhanced features
- Added PNG export with metadata
- Created comprehensive demo page
- Added documentation

---

**Made with ❤️ for the data visualization community**
