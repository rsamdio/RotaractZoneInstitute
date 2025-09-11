# RZI 2026 Chennai Event Website

A fully functional event website for the Rotaract Zone Institute 2026 Chennai, built with modern web technologies and following the design patterns from the survey and coming soon pages.

## Features

### 🎨 Design & Styling
- **Consistent Design Language**: Follows the same color palette and styling patterns as the survey and coming soon pages
- **Modern UI**: Clean, professional design with glassmorphism effects and smooth animations
- **Responsive Design**: Fully responsive across all device sizes (mobile, tablet, desktop)
- **Dark Theme**: Consistent with the overall RZI brand aesthetic

### 📱 Interactive Features
- **Smooth Scrolling Navigation**: Seamless navigation between sections
- **Dynamic Schedule Tabs**: Interactive schedule with day-by-day breakdown
- **Registration Form**: Complete registration form with validation
- **Scroll Animations**: Elements animate into view as you scroll
- **Header Effects**: Header changes appearance based on scroll position

### 🏗️ Technical Implementation
- **Semantic HTML5**: Proper semantic structure for accessibility and SEO
- **Modern CSS**: CSS Grid, Flexbox, and custom properties for maintainable styling
- **Vanilla JavaScript**: No external dependencies, lightweight and fast
- **Form Validation**: Client-side validation with user-friendly error messages
- **Success Modals**: Beautiful modal dialogs for user feedback

### 📋 Sections
1. **Hero Section**: Eye-catching landing with event branding
2. **About Section**: Event overview with feature highlights
3. **Schedule Section**: Interactive day-by-day schedule
4. **Speakers Section**: Featured speaker profiles
5. **Registration Section**: Pricing tiers and registration form
6. **Footer**: Contact information and additional links

### 🎯 SEO & Performance
- **Structured Data**: JSON-LD markup for search engines
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Performance Optimized**: Minimal dependencies and optimized assets
- **Accessibility**: Proper ARIA labels and keyboard navigation

## File Structure

```
event/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── main.css        # Main stylesheet
│   ├── js/
│   │   └── main.js         # Interactive functionality
│   └── images/             # Event images and logos
└── README.md               # This file
```

## Usage

1. Open `index.html` in a web browser
2. Navigate through sections using the header navigation
3. Interact with the schedule tabs to view different days
4. Fill out the registration form to test functionality
5. Experience smooth scrolling and animations

## Customization

### Colors
The color scheme is defined in CSS custom properties at the top of `main.css`:
- `--color-primary`: Main brand color (#1e3a8a)
- `--color-secondary`: Accent green (#059669)
- `--color-accent-orange`: Orange accent (#f97316)
- `--color-accent-red`: Red accent (#dc2626)

### Content
- Update event details in the HTML file
- Modify schedule information in the schedule section
- Add/remove speakers in the speakers section
- Update pricing in the registration section

### Styling
- Adjust spacing, typography, and layout in `main.css`
- Modify animations and transitions as needed
- Update responsive breakpoints for different screen sizes

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- No external JavaScript dependencies
- Optimized CSS with minimal redundancy
- Efficient animations using CSS transforms
- Lazy loading for better performance

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color scheme
- Screen reader friendly

## Future Enhancements

- Integration with payment processing
- Real-time registration status
- Speaker profile expansion
- Event countdown timer
- Social media integration
- Multi-language support
