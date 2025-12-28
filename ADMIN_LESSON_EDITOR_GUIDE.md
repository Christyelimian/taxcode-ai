# Admin Lesson Content Editor Guide

## Overview
The lesson content editor allows admins to add detailed content for each lesson in a training module. This content is displayed to learners when they access the course.

## How to Use

### 1. Access the Editor
1. Navigate to `/dashboard/modules`
2. Click "Edit" on any module
3. Scroll down to the "Lesson Content" section (appears after you save module topics)

### 2. Initialize Lessons
- After adding topics to your module, click "Initialize Lessons"
- This creates a content editor for each topic/lesson
- Each lesson can be expanded/collapsed for easy editing

### 3. Edit Lesson Content

#### Basic Information
- **Summary/Learning Objective**: Brief description of what learners will gain
- **Estimated Minutes**: How long the lesson takes to complete
- **Difficulty**: Beginner, Intermediate, or Advanced

#### Main Content
- **Lesson Content**: Write your lesson using Markdown
  - Use `#` for headings
  - Use `**text**` for bold
  - Use `*text*` for italic
  - Use `-` for bullet lists
  - Use numbered lists with `1.`, `2.`, etc.

#### Video (Optional)
- Add a YouTube or Vimeo URL
- The video will be embedded in the lesson
- Supports standard YouTube/Vimeo URL formats

#### Resources (Optional)
- Add PDFs, links, documents, or videos
- Each resource needs:
  - Type: Link, PDF, Video, or Document
  - Title: Display name
  - URL: Link to the resource

#### Quiz (Coming Soon)
- Toggle quiz on/off
- Quiz builder interface coming in future update

### 4. Save Content
- Click "Save" on each lesson after editing
- Content is saved immediately
- You can edit multiple lessons and save individually

## Content Structure Example

```markdown
# Understanding Nigerian Tax System

## Introduction
The Nigerian tax system is administered by the Federal Inland Revenue Service (FIRS)...

## Key Concepts

### Tax Types
- **Personal Income Tax (PIT)**: Tax on individual income
- **Companies Income Tax (CIT)**: Tax on corporate profits
- **Value Added Tax (VAT)**: Consumption tax

## Practical Examples

1. **Example 1**: Calculating PIT for a salary earner
2. **Example 2**: Understanding VAT registration requirements

## Summary
In this lesson, you learned about...
```

## Best Practices

1. **Clear Structure**: Use headings to organize content
2. **Concise Summary**: Keep learning objectives brief and clear
3. **Visual Elements**: Use lists and formatting for readability
4. **Practical Examples**: Include real-world examples
5. **Resources**: Link to official documents and guides
6. **Video Content**: Use videos for complex topics

## Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

> Blockquote

`Inline code`

```
Code block
```
```

## Troubleshooting

### Lesson content not showing?
- Make sure you've saved the module topics first
- Click "Initialize Lessons" if the editor doesn't appear
- Refresh the page if content doesn't load

### Video not embedding?
- Check that the URL is a valid YouTube or Vimeo link
- Use the full URL format: `https://youtube.com/watch?v=...`

### Content not saving?
- Check your internet connection
- Make sure you're logged in as an admin
- Try refreshing and saving again

## Next Steps

After creating lesson content:
1. Preview the content in the learning interface
2. Test the lesson flow as a learner
3. Gather feedback and iterate
4. Add more lessons as needed

## Future Features

- Rich text editor (WYSIWYG)
- Quiz builder interface
- Content templates
- Bulk import from documents
- AI-assisted content generation
- Preview mode
- Version history



