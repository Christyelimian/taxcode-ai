# Builder.io Setup Command Guide

## What is the Setup Command?

The "Setup Command" in Builder.io is a field where you can provide high-level instructions for how the AI should structure and build pages. It's complementary to the Design System instructions but focuses more on **content structure** and **workflow** rather than design details.

## Difference Between Fields

### Design System Instructions
- **Purpose**: How to use components, styling, patterns
- **Focus**: Technical implementation, CSS classes, component props
- **Location**: "How should the AI use your design system?"

### Setup Command
- **Purpose**: How to structure pages and content
- **Focus**: Content organization, component selection, page flow
- **Location**: "Setup Command" field

## Recommended Setup Command

Copy this into Builder.io's "Setup Command" field:

```
Use registered components (HeroSection, PathwayGrid, PathwayCard, RichTextSection) to build pages. 

Page Structure Pattern:
1. HeroSection - Page header with badge, heading, description, and action buttons
2. PathwayGrid or PathwayCard - Feature listings or individual highlights
3. RichTextSection - Long-form content sections

For content pages:
- Start with HeroSection to introduce the page topic
- Use PathwayGrid for listing multiple related items (2 columns)
- Use RichTextSection for detailed explanations
- End with call-to-action buttons if needed

Always ensure responsive design and semantic HTML structure.
```

## Alternative Setup Commands

### For Content-Heavy Pages
```
Build pages using registered components. Structure: HeroSection → Content Sections → Call-to-Action. Use PathwayGrid for feature lists, RichTextSection for articles. Maintain consistent spacing and responsive layout.
```

### For Landing Pages
```
Create landing pages with: 1) HeroSection (compelling headline + CTA), 2) PathwayGrid (key features/benefits), 3) RichTextSection (detailed information). Use registered components only. Ensure mobile-responsive design.
```

### For Information Pages
```
Structure information pages with HeroSection header, then PathwayGrid for categorized content, RichTextSection for detailed explanations. Use PathwayCard for individual highlights. Follow responsive design patterns.
```

## How to Use

1. **Go to Builder.io Dashboard**
2. **Navigate to**: Settings → Setup New Project (or Edit Project)
3. **Find**: "Setup Command" field
4. **Paste**: One of the commands above (or customize)
5. **Save**

## Testing Your Setup Command

After setting up, test by asking Builder.io AI:

- "Create a start page with hero and pathways"
- "Build an about page"
- "Make a resources page"

The AI should:
- Use your registered components
- Follow the structure pattern you defined
- Create responsive, well-organized pages

## Customizing for Your Needs

You can customize the setup command based on your specific page types:

### If you have many page types:
```
For landing pages: HeroSection → PathwayGrid → RichTextSection
For detail pages: HeroSection → RichTextSection → Related PathwayGrid
For listing pages: HeroSection → PathwayGrid (multiple sections)
```

### If you want specific workflows:
```
When creating pages:
1. Analyze the page purpose (landing, information, listing)
2. Select appropriate registered components
3. Structure content hierarchically
4. Ensure mobile responsiveness
5. Add semantic HTML structure
```

## Best Practices

1. **Keep it concise** - Setup commands should be brief and actionable
2. **Focus on structure** - Emphasize how to organize content, not styling details
3. **Reference components** - Mention which components to use
4. **Include patterns** - Provide common page structure patterns
5. **Test and iterate** - Adjust based on AI output quality

## Example: Complete Setup

**Design System Instructions** (from BUILDER_IO_AI_INSTRUCTIONS.txt):
- Technical details, component props, CSS classes, design patterns

**Setup Command** (from BUILDER_IO_SETUP_COMMAND.txt):
- High-level structure, component selection, page organization

Together, these give Builder.io AI:
- ✅ What components to use (Design System)
- ✅ How to style them (Design System)
- ✅ How to structure pages (Setup Command)
- ✅ What patterns to follow (Both)

