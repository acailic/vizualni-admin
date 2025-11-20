# 🎯 Presentation Mode Guide

## Overview

The **Presentation Mode** is a polished, interactive demo page designed for showcasing data visualizations in meetings, presentations, and demos. It features slide-style navigation, smooth animations, and cohesive theming perfect for screen-sharing or projector displays.

## 🚀 Quick Start

### Running the Presentation

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Access the presentation:**
   - Enhanced version (recommended): `http://localhost:3000/demos/presentation-enhanced`
   - Original version: `http://localhost:3000/demos/presentation`

3. **Enter fullscreen mode:**
   - Press `F11` (Windows/Linux) or `Cmd+Ctrl+F` (Mac)
   - Or click the fullscreen icon in the top-right corner

### For Production Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

Then access: `https://your-domain.com/demos/presentation-enhanced`

---

## 📋 Presentation Structure

The presentation follows a professional slide-style format with 5 main sections:

### 1. **Hero** 🎬
- Eye-catching gradient background with animated effects
- Key highlight metrics displayed prominently
- Call-to-action buttons for navigation
- Bilingual support (Serbian/English)

### 2. **Agenda** 📝
- Overview of presentation topics
- 4 structured talking points
- Feature badges (Live-ready, Responsive, Interactive)

### 3. **Highlights** ⭐
- 4 key metrics with visual icons
- Internet penetration statistics
- IT export growth figures
- Energy dependency data
- Trade balance overview

### 4. **Data Stories** 📊
- Interactive visualizations using D3.js
- **Digital Growth Chart**: Internet adoption trends (2006-2023)
- **GDP by Sector**: Economic composition breakdown
- **Trade Balance**: Exports vs. imports comparison
- **Energy Dependency**: Coal reliance visualization (2015-2024)

### 5. **Call to Action** 🚀
- Presenter notes and keyboard shortcuts
- Next steps buttons
- Links to browse demos, create visualizations, or return to original

---

## ⌨️ Keyboard Navigation

The enhanced presentation supports full keyboard control for seamless presenting:

| Key | Action |
|-----|--------|
| `→` or `Space` | Next section |
| `←` | Previous section |
| `↑` | Previous section |
| `↓` | Next section |
| `F11` / `Cmd+Ctrl+F` | Toggle fullscreen |
| `Esc` | Exit fullscreen |

### Navigation Tips:
- Use the sticky navigation chips at the top to jump directly to any section
- The progress bar at the very top tracks your position in the presentation
- Smooth scroll animations guide viewers through transitions

---

## 🎨 Features

### Visual Design
- **Cohesive Theming**: Uses Serbian national colors (blue #0C4076, red #C6363C)
- **Gradient Backgrounds**: Animated gradients with subtle pulse effects
- **Smooth Animations**: Fade-in effects as sections come into view
- **Hover Effects**: Interactive elements with transform animations
- **Responsive Layout**: Adapts from mobile to 4K displays

### Interactivity
- **Real-time Chart Interactions**: Hover over data points for details
- **Sticky Navigation**: Always-visible section chips
- **Progress Tracking**: Linear progress bar shows completion percentage
- **Fullscreen Toggle**: One-click immersive mode
- **Keyboard Shortcuts**: Professional presenter controls

### Technical
- **Static Export Ready**: Uses `getStaticProps` for optimal performance
- **Intersection Observer**: Triggers animations when sections enter viewport
- **TypeScript**: Fully typed for reliability
- **Material-UI Components**: Consistent design system
- **Next.js Routing**: Fast navigation and SEO-friendly

---

## 📊 Data Sources

All visualizations use real Serbian open data from:

| Dataset | Source | Description |
|---------|--------|-------------|
| Digital Growth | `/data/serbia-digital.ts` | Internet adoption, IT exports, digital skills |
| Economic Data | `/data/serbia-economy.ts` | GDP composition, trade balance |
| Energy Stats | `/data/serbia-energy.ts` | Production sources, coal dependency |

### Adding Custom Data

1. Create a new data file in `/app/data/`:
   ```typescript
   // /app/data/my-custom-data.ts
   export const myData = [
     { year: 2020, value: 100 },
     { year: 2021, value: 150 },
     // ...
   ];
   ```

2. Import and use in the presentation:
   ```typescript
   import { myData } from '@/data/my-custom-data';

   <LineChart
     data={myData}
     xKey="year"
     yKey="value"
     // ...
   />
   ```

---

## 🎯 Presenter Best Practices

### Before the Presentation

1. **Test Your Setup**
   - Open the presentation URL 5 minutes early
   - Test fullscreen mode and keyboard navigation
   - Verify charts load and are interactive
   - Check speaker notes in the CTA section

2. **Screen Sharing Settings**
   - Use 16:9 aspect ratio for optimal viewing
   - Enable "Optimize for video clip" in screen-share settings
   - Ensure audio is muted unless needed
   - Close unnecessary browser tabs

3. **Display Settings**
   - Set browser zoom to 100%
   - Use dark mode on projector for better contrast
   - Hide browser bookmarks bar (Cmd+Shift+B / Ctrl+Shift+B)
   - Clear browser history for clean autocomplete

### During the Presentation

1. **Navigation Flow**
   - Start at Hero, introduce the topic
   - Move to Agenda to set expectations
   - Highlight key metrics in Highlights section
   - Deep-dive into Data Stories with chart interactions
   - Conclude with CTA and next steps

2. **Engaging Your Audience**
   - **Hover over charts** to reveal data details
   - **Use keyboard shortcuts** for smooth transitions
   - **Pause on each section** to allow questions
   - **Refer to the agenda** to maintain structure

3. **Handling Q&A**
   - Use navigation chips to jump back to specific sections
   - Hover interactions help answer data-specific questions
   - CTA section provides clear next steps

### For Hybrid Meetings

- **Lighting**: Ensure presenter is well-lit (not backlit)
- **Audio**: Use external mic for clearer sound
- **Bandwidth**: Close background apps for smooth streaming
- **Backup**: Have PDF export ready (File → Print → Save as PDF)

---

## 🌐 Bilingual Support

The presentation automatically detects the browser locale:

- **Serbian (sr)**: Default language
- **English (en)**: Fallback language

### Changing Language

1. **Via URL parameter:**
   ```
   http://localhost:3000/demos/presentation-enhanced?locale=en
   ```

2. **Via Next.js locale routing:**
   ```
   http://localhost:3000/en/demos/presentation-enhanced
   ```

3. **Programmatically in code:**
   ```typescript
   const router = useRouter();
   const locale = (router.locale || 'sr') as 'sr' | 'en';
   ```

---

## 🔧 Customization

### Changing Colors

Edit `/app/themes/palette.ts`:

```typescript
export const palette = {
  primary: {
    main: '#0C4076',  // Serbian blue
  },
  secondary: {
    main: '#3F74B4',  // Cobalt
  },
  // ... add your colors
};
```

### Adding New Sections

1. Update `sectionOrder` array:
   ```typescript
   const sectionOrder = ['hero', 'agenda', 'highlights', 'stories', 'my-section', 'cta'];
   ```

2. Add section titles:
   ```typescript
   const titles = {
     // ...
     mySection: locale === 'sr' ? 'Moja Sekcija' : 'My Section'
   };
   ```

3. Create section JSX:
   ```typescript
   <Box id="my-section" sx={{ mb: 6 }}>
     <Container maxWidth="lg">
       {/* Your content */}
     </Container>
   </Box>
   ```

### Modifying Charts

Available chart types in `/app/components/demos/charts/`:

- **ColumnChart**: Vertical bar charts
- **LineChart**: Line graphs with smooth curves
- **BarChart**: Horizontal bars
- **PieChart**: Pie/donut charts

Example customization:

```typescript
<ColumnChart
  data={myData}
  xKey="category"
  yKey="value"
  xLabel="Category"
  yLabel="Value"
  width={800}
  height={400}
  colors={['#0C4076', '#3F74B4', '#10b981']}  // Custom colors
  margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
/>
```

---

## 🧪 Testing

### Local Development Testing

```bash
# Run development server
pnpm dev

# Open in browser
open http://localhost:3000/demos/presentation-enhanced

# Test checklist:
# ✓ All sections load
# ✓ Keyboard navigation works
# ✓ Charts are interactive
# ✓ Fullscreen toggle functions
# ✓ Responsive on mobile
# ✓ Bilingual switching
```

### Cross-Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)

### Device Testing

- Desktop (1920×1080, 2560×1440, 3840×2160)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)

### Accessibility Testing

```bash
# Lighthouse audit
npm run build
npm run lighthouse

# Manual checks:
# ✓ Keyboard navigation (Tab, arrows, Enter)
# ✓ Screen reader compatibility
# ✓ Color contrast ratios (WCAG AA)
# ✓ Focus indicators visible
```

---

## 🐛 Troubleshooting

### Charts Not Loading

**Problem**: Charts appear blank or fail to render

**Solution**:
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Keyboard Navigation Not Working

**Problem**: Arrow keys don't navigate sections

**Solution**:
- Ensure focus is on the page (click once on the page)
- Check browser console for JavaScript errors
- Verify no other extensions are capturing keyboard events

### Fullscreen Mode Issues

**Problem**: Fullscreen button doesn't work

**Solution**:
- **Firefox**: Check Permissions → Allow fullscreen
- **Safari**: Enable Fullscreen API in Develop menu
- **Alternative**: Use native F11 / Cmd+Ctrl+F

### Performance Issues

**Problem**: Animations are laggy or choppy

**Solution**:
```bash
# Use production build for better performance
pnpm build
pnpm start
```

- Close other browser tabs
- Disable browser extensions temporarily
- Check GPU acceleration is enabled

### Data Not Displaying

**Problem**: Charts show "No data available"

**Solution**:
- Verify data files exist in `/app/data/`
- Check import paths are correct
- Ensure data matches expected TypeScript interfaces

---

## 📦 Dependencies

Required packages (already included):

```json
{
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "next": "^14.x",
  "react": "^18.x",
  "d3": "^7.x",
  "typescript": "^4.9.x"
}
```

---

## 📝 License

This presentation mode is part of the Vizualni Admin project. All visualizations use open data from Serbian government sources (data.gov.rs).

---

## 🤝 Contributing

To add new presentation features:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-presentation-feature`
3. Make your changes
4. Test thoroughly (lint, build, visual testing)
5. Submit a pull request

### Development Workflow

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev

# 3. Make changes to:
#    - /app/pages/demos/presentation-enhanced.tsx
#    - /app/components/demos/
#    - /app/data/

# 4. Lint your code
pnpm run lint

# 5. Build for production
pnpm run build

# 6. Test production build
pnpm start
```

---

## 🌟 Credits

**Created with:**
- [Next.js](https://nextjs.org/) - React framework
- [Material-UI](https://mui.com/) - Component library
- [D3.js](https://d3js.org/) - Data visualization
- [TypeScript](https://www.typescriptlang.org/) - Type safety

**Data Sources:**
- Serbian Statistical Office
- data.gov.rs - Open Data Portal
- Ministry of Economy

---

## 📞 Support

For questions or issues:

1. Check this README first
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Check [Material-UI docs](https://mui.com/material-ui/getting-started/)
4. Open an issue in the project repository

---

**Happy Presenting! 🎉**

*Last updated: 2024*
