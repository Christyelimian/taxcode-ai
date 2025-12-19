# AI Tax Assistant - World-Class UI Design Document
## Tax Code Nigeria | Flagship Feature

---

## 🎯 PAGE VISION

**The AI Tax Assistant isn't just a chatbot—it's Nigeria's first intelligent tax co-pilot.**

This page must communicate:
- **Intelligence**: This AI truly understands Nigerian tax law
- **Accessibility**: Works for everyone (multilingual, voice, simple UI)
- **Trust**: Professional, accurate, secure
- **Delight**: Beautiful, smooth, enjoyable to use
- **Power**: Handles complex queries effortlessly

**User Promise:** "Ask any tax question in your language, get instant expert answers backed by Nigerian law."

---

## 🏗 PAGE ARCHITECTURE

### Layout Strategy: **"Immersive Chat-First with Intelligent Context"**

**Desktop Layout (1440px):**
```
┌────────────────────────────────────────────────────────────────┐
│  HEADER (Sticky, 80px height)                                  │
├────────────────┬───────────────────────────────────────────────┤
│                │                                               │
│   LEFT PANEL   │          MAIN CHAT AREA                       │
│   (320px)      │          (Flexible width)                     │
│                │                                               │
│   - New Chat   │   [Chat Interface]                            │
│   - History    │                                               │
│   - Templates  │                                               │
│   - Settings   │                                               │
│                │                                               │
│                │                                               │
│                ├───────────────────────────────────────────────┤
│                │   INPUT AREA (Fixed bottom, 120px)            │
├────────────────┴───────────────────────────────────────────────┤
│  FOOTER (Minimal, 60px)                                        │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (< 768px):**
- Full-screen chat interface
- Bottom navigation drawer for history
- Floating action buttons
- Collapsible panels

---

## 🎨 HERO SECTION (Above Chat)

### Design Concept: **"Conversational Welcome with Live Intelligence"**

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              🤖 AI TAX ASSISTANT                                 │
│              ════════════════════                                │
│                                                                  │
│     Your Intelligent Tax Co-Pilot for Nigerian Tax Law          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Ask anything about Nigerian taxes, in any language    │    │
│  │  Powered by advanced AI trained on 2026 Tax Reforms    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────┬──────────┬──────────┬──────────┐                 │
│  │ English  │  Hausa   │ Yoruba   │  Igbo    │                 │
│  │   🇬🇧    │   🇳🇬    │   🇳🇬    │   🇳🇬    │                 │
│  └──────────┴──────────┴──────────┴──────────┘                 │
│                                                                  │
│  💬 98% Accuracy  |  ⚡ <2s Response  |  🔒 Secure & Private    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Visual Treatment:**
- **Background**: Subtle animated gradient (Navy → Teal → Green)
- **Floating particles**: Tiny data nodes moving slowly
- **Language buttons**: Large, touchable (60px height), with flag icons
- **Active language**: Solid green fill, white text
- **Stats bar**: Minimal icons with impressive numbers
- **Typography**: 
  - Main heading: 48px, bold, white
  - Subheading: 20px, regular, white/80% opacity
  - Stats: 16px, semibold, white

**Interaction:**
- Language selection slides up chat interface in chosen language
- Smooth fade-in animation on page load
- Particles respond subtly to mouse movement (parallax)
- Stats counter animates on scroll into view

**Height**: 400px on desktop, 320px on mobile

---

## 💬 MAIN CHAT INTERFACE

### Design Concept: **"WhatsApp Meets Premium Software"**

**Layout Philosophy:**
- Familiar messaging UI (reduces learning curve)
- Premium polish (shows quality)
- Spacious (not cramped)
- Intelligent context (not just messages)

---

### A. CHAT WINDOW DESIGN

**Container:**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [AI Welcome Message - Personalized]                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🤖 Hi there! I'm your AI Tax Assistant.              │ │
│  │  I can help you understand Nigerian tax law,          │ │
│  │  calculate your obligations, and answer any            │ │
│  │  questions about the 2026 reforms.                     │ │
│  │                                                         │ │
│  │  What would you like to know today?                    │ │
│  │                                      10:45 AM          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Suggested Questions - Smart Chips]                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ What is VAT? │ │ File PIT 2026│ │ Small Co. tax│        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│                    [User Message]                            │
│                    ┌──────────────────────────────────────┐ │
│                    │ How do I calculate my income tax?    │ │
│              10:46 AM │                                     │ │
│                    └──────────────────────────────────────┘ │
│                                                              │
│  [AI Response with Rich Content]                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🤖 Great question! Here's how...                      │ │
│  │  [Formatted response with bullet points]              │ │
│  │                                                         │ │
│  │  📊 Need help calculating? Try our calculator →        │ │
│  │  📖 Learn more: Personal Income Tax Guide              │ │
│  │                                                         │ │
│  │  Was this helpful?  👍 👎                              │ │
│  │                                      10:46 AM          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Message Styling:**

**AI Messages (Left-aligned):**
- Background: Light gray (#F7F9FC)
- Border-radius: 16px (top-left: 4px for chat bubble effect)
- Max-width: 75% of chat area
- Padding: 20px
- Avatar: 48px AI bot icon (green circle with brain icon)
- Typography: 16px, line-height 1.6
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.06))

**User Messages (Right-aligned):**
- Background: Green gradient (#008751 → #00A862)
- Border-radius: 16px (top-right: 4px)
- Max-width: 75% of chat area
- Padding: 20px
- Typography: 16px, white text
- Shadow: Subtle
- User avatar: Profile picture or initials in colored circle

**Timestamps:**
- 12px, gray, positioned outside message bubble
- Smart grouping: Only show time every 5 minutes

**Message Spacing:**
- 16px between different speakers
- 8px between consecutive messages from same speaker
- 32px between conversation topics (detected by AI)

---

### B. RICH MESSAGE CONTENT

**AI responses can include:**

**1. Formatted Text:**
```
┌────────────────────────────────────────────────────────┐
│  🤖 Personal Income Tax (PIT) in Nigeria:              │
│                                                         │
│  Key Points:                                            │
│  • Progressive rates: 7% - 24%                          │
│  • Annual filing requirement                            │
│  • Employer deducts PAYE monthly                        │
│                                                         │
│  Under 2026 reforms:                                    │
│  ✓ First ₦800,000 is tax-free                          │
│  ✓ Simplified brackets                                  │
│  ✓ Easier filing process                                │
│                                                         │
│  💡 Pro Tip: Most people overpay. Use our calculator   │
│  to find your exact liability.                          │
└────────────────────────────────────────────────────────┘
```

**2. Embedded Cards:**
```
┌────────────────────────────────────────────────────────┐
│  🤖 Based on your question, you might need:            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🧮 Income Tax Calculator                        │ │
│  │  Calculate your exact tax liability              │ │
│  │  [Use Calculator →]                              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  📖 PIT Complete Guide                           │ │
│  │  Everything about Personal Income Tax            │ │
│  │  [Read Guide →]                                  │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**3. Code/Legal References:**
```
┌────────────────────────────────────────────────────────┐
│  🤖 According to the Personal Income Tax Act:          │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │  Section 33(1):                                │   │
│  │  "Every taxable person shall render a return  │   │
│  │  of income to the relevant tax authority..."   │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  📎 Source: PITA 2011 (as amended 2026)                │
└────────────────────────────────────────────────────────┘
```

**4. Tables & Comparisons:**
```
┌────────────────────────────────────────────────────────┐
│  🤖 2026 Tax Brackets:                                 │
│                                                         │
│  ┌──────────────────┬──────────┬──────────────────┐   │
│  │ Income Range     │   Rate   │   Tax on Range   │   │
│  ├──────────────────┼──────────┼──────────────────┤   │
│  │ ₦0 - ₦800,000    │    0%    │      ₦0          │   │
│  │ ₦800K - ₦1.2M    │    7%    │   ₦28,000        │   │
│  │ ₦1.2M - ₦2M      │   11%    │   ₦88,000        │   │
│  └──────────────────┴──────────┴──────────────────┘   │
└────────────────────────────────────────────────────────┘
```

**5. Visual Indicators:**
```
✓ Positive/Confirmed information (green checkmark)
⚠️ Important warning (orange alert)
❌ Common mistake to avoid (red X)
💡 Pro tip (lightbulb)
📊 Data/statistics (chart icon)
📖 Educational content (book icon)
🔗 External link (link icon)
```

---

### C. SUGGESTED QUESTIONS (Smart Chips)

**Design:**
```
[What is VAT?] [Calculate my tax] [File returns] [Appeal decision]
```

**Visual Treatment:**
- **Style**: Pill-shaped buttons
- **Height**: 40px
- **Padding**: 12px 20px
- **Background**: White with 1px gray border
- **Text**: 14px, semibold, navy
- **Hover**: Green border, slight lift, pointer cursor
- **Click**: Fills with light green, sends question

**Behavior:**
- **Context-aware**: Changes based on conversation
- **Personalized**: Based on user profile/history
- **Horizontal scroll**: On mobile
- **Fade in/out**: As conversation progresses

**Example Progression:**

**Initial (New user):**
- "What is VAT?"
- "How does PAYE work?"
- "Explain 2026 reforms"
- "Small business taxes"

**After discussing VAT:**
- "Calculate VAT liability"
- "VAT registration process"
- "Input VAT recovery"
- "VAT return filing"

**For business owners:**
- "Small company criteria"
- "CIT vs PIT"
- "Payroll tax setup"
- "Tax planning tips"

---

### D. TYPING INDICATORS

**When AI is "thinking":**

**Design:**
```
┌────────────────────────────────────┐
│  🤖 [●●●] Analyzing your question...│
└────────────────────────────────────┘
```

**Animation:**
- Three dots pulse in sequence
- Smooth loop animation
- Light gray background
- Max display time: 5 seconds

**Progressive States:**
```
[●●●] Analyzing your question...
[●●●] Searching tax law database...
[●●●] Preparing your answer...
```

**Visual Feedback:**
- Shows AI is working
- Reduces perceived wait time
- Builds anticipation

---

## 🎙️ INPUT AREA (Fixed Bottom)

### Design Concept: **"Multi-Modal Input Hub"**

**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌──────────────────────────────────────┐  ┌───────┐ │
│  │   📎  │  │  Ask anything about Nigerian taxes... │  │  🎤   │ │
│  │ Upload│  │  (Shift + Enter for new line)         │  │ Voice │ │
│  └───────┘  └──────────────────────────────────────┘  └───────┘ │
│                                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         ┌──────────────┐│
│  │ English │  │  Clear  │  │ Examples│         │  Send  [→]   ││
│  │   🇬🇧   │  │   🗑️   │  │   💡    │         │              ││
│  └─────────┘  └─────────┘  └─────────┘         └──────────────┘│
│                                                                   │
│  💬 Free users: 5 questions remaining today | Upgrade for unlimited│
└──────────────────────────────────────────────────────────────────┘
```

**Dimensions:**
- Height: 120px (expands to 200px if multi-line input)
- Padding: 24px
- Background: White with subtle top border shadow
- Fixed position: Bottom of viewport

---

### INPUT FIELD

**Text Input:**
- **Design**: Multi-line textarea, auto-expanding
- **Min-height**: 56px
- **Max-height**: 150px (then scroll)
- **Placeholder**: Personalized based on context
  - New user: "Ask anything about Nigerian taxes..."
  - Returning: "Welcome back! What would you like to know?"
  - After error: "Try rephrasing your question..."
- **Font**: 16px, regular (prevents zoom on mobile)
- **Border**: 2px solid light gray (focus: green)
- **Border-radius**: 12px
- **Padding**: 16px
- **Background**: White

**Smart Features:**
- Auto-complete suggestions dropdown
- Spell-check enabled
- Mention system: @ to reference previous messages
- Emoji picker (subtle icon in corner)
- Character counter (if limits exist)

---

### INPUT CONTROLS

**1. Upload Button (📎):**
```
┌─────────┐
│   📎    │
│ Upload  │
└─────────┘
```
- **Function**: Upload tax documents for AI analysis
- **Accepts**: PDF, images (JPG, PNG), Word docs
- **Max size**: 10MB
- **Interaction**: Click opens file picker, drag-drop also works
- **Visual feedback**: File name appears as chip above input
- **Premium feature**: Free users limited to 1 file, Pro unlimited

**2. Voice Input Button (🎤):**
```
┌─────────┐
│   🎤    │
│  Voice  │
└─────────┘
```
- **Function**: Voice-to-text input
- **Languages**: English, Hausa, Yoruba, Igbo
- **Interaction**: 
  - Click: Starts recording (button pulses red)
  - Click again: Stops recording, transcribes
  - Auto-stop: After 60 seconds
- **Visual**: Waveform animation while recording
- **Accessibility**: Critical for low-literacy users

**3. Language Selector:**
```
┌──────────┐
│ English │
│   🇬🇧    │
└──────────┘
```
- **Function**: Switch AI response language
- **Dropdown**: Shows all 4 languages with flags
- **Persistent**: Choice saved for session
- **Visual**: Active language highlighted green

**4. Clear Button:**
```
┌──────────┐
│   🗑️    │
│  Clear   │
└──────────┘
```
- **Function**: Clear current input text
- **Confirmation**: None (undo available)
- **Shortcut**: Esc key

**5. Examples Button:**
```
┌───────────┐
│    💡     │
│ Examples  │
└───────────┘
```
- **Function**: Show example questions
- **Opens**: Modal with categorized examples
- **Helpful**: For users unsure what to ask

**6. Send Button:**
```
┌──────────────┐
│  Send  [→]   │
└──────────────┘
```
- **Style**: Solid green button, white text
- **Height**: 56px (matches input)
- **Width**: 120px
- **Hover**: Darker green, pointer
- **Disabled**: Gray when input empty
- **Keyboard**: Enter to send (Shift+Enter for new line)
- **Loading**: Shows spinner while sending

---

### USAGE METER (Free Users Only)

**Display:**
```
💬 Free users: 5 questions remaining today | Upgrade for unlimited
```

**Visual Treatment:**
- **Position**: Below input controls
- **Style**: Small text (14px), centered
- **Color**: Gray (warning when <3 remaining: orange)
- **Link**: "Upgrade for unlimited" → Pricing page
- **Progress bar**: Optional visual (5 dots, gray out as used)

**Behavior:**
- Updates in real-time after each question
- Disappears for Pro users
- Shows reset time: "Resets in 4 hours"

---

## 📂 LEFT PANEL (Desktop Only)

### Design Concept: **"Conversation Management & Smart Context"**

**Width**: 320px fixed
**Background**: Light gray (#F7F9FC)
**Border**: 1px right border

---

### A. PANEL HEADER

```
┌────────────────────────────┐
│  [+ New Chat]              │
│                            │
│  🔍 Search conversations... │
└────────────────────────────┘
```

**New Chat Button:**
- **Style**: Full-width, green button
- **Height**: 48px
- **Icon**: Plus symbol
- **Action**: Clears current chat, starts fresh
- **Shortcut**: Ctrl/Cmd + N

**Search Bar:**
- **Function**: Search all chat history
- **Style**: Input with magnifying glass icon
- **Results**: Dropdown with matches highlighted
- **Smart**: Searches both questions and answers

---

### B. CONVERSATION HISTORY

```
┌────────────────────────────┐
│  TODAY                     │
│  ┌──────────────────────┐ │
│  │ 🤖 VAT on services   │ │
│  │ 10:45 AM • 8 messages│ │
│  └──────────────────────┘ │
│                            │
│  ┌──────────────────────┐ │
│  │ 🤖 Small company tax │ │
│  │ 09:15 AM • 12 msgs   │ │
│  └──────────────────────┘ │
│                            │
│  YESTERDAY                 │
│  ┌──────────────────────┐ │
│  │ 🤖 2026 reform guide │ │
│  │ 15 messages          │ │
│  └──────────────────────┘ │
│                            │
│  THIS WEEK                 │
│  ...                       │
└────────────────────────────┘
```

**Conversation Card:**
- **Height**: Auto (min 72px)
- **Padding**: 16px
- **Border-radius**: 8px
- **Background**: White (hover: light green tint)
- **Active state**: Green left border (4px)
- **Title**: First user question (truncated to 2 lines)
- **Meta**: Time + message count
- **Hover actions**: Pin, Delete, Share icons appear
- **Click**: Loads that conversation

**Grouping:**
- Today
- Yesterday
- This Week
- This Month
- Older

**Smart Features:**
- Auto-title generation based on topic
- Starred/pinned conversations at top
- Infinite scroll (load more)
- Context menu (right-click): Rename, Delete, Export

---

### C. QUICK TEMPLATES

```
┌────────────────────────────┐
│  QUICK START               │
│  ┌──────────────────────┐ │
│  │ 📝 File my PIT       │ │
│  └──────────────────────┘ │
│  ┌──────────────────────┐ │
│  │ 🧮 Calculate VAT     │ │
│  └──────────────────────┘ │
│  ┌──────────────────────┐ │
│  │ ❓ Understand 2026   │ │
│  └──────────────────────┘ │
└────────────────────────────┘
```

**Function**: Pre-written question flows
**Style**: Compact cards with icons
**Action**: Clicking starts conversation with that template
**Personalized**: Based on user profile

---

### D. AI CAPABILITIES

```
┌────────────────────────────┐
│  I CAN HELP YOU WITH:      │
│  ✓ Tax calculations        │
│  ✓ Law explanations        │
│  ✓ Filing guidance         │
│  ✓ Deadline reminders      │
│  ✓ Document analysis       │
│  ✓ Appeal processes        │
│                            │
│  [View All Features →]     │
└────────────────────────────┘
```

**Purpose**: Set expectations about AI capabilities
**Style**: Minimal list with checkmarks
**Link**: To full capabilities page

---

### E. SETTINGS & HELP

```
┌────────────────────────────┐
│  ⚙️ Settings               │
│  ❓ Help & Tips            │
│  💾 Export Chats           │
│  🔔 Notifications          │
└────────────────────────────┘
```

**Links to:**
- Language preferences
- Voice settings
- Privacy options
- Keyboard shortcuts
- Help documentation
- Export all conversations (JSON/PDF)
- Notification preferences

---

## 📱 MOBILE INTERFACE ADAPTATIONS

### Layout Changes:

**Full-Screen Chat:**
- No left panel (accessed via drawer)
- Simplified header
- Bottom input area (fixed)
- Floating action buttons

**Mobile Header:**
```
┌────────────────────────────────────┐
│ [☰]  AI Tax Assistant      [⋮]    │
└────────────────────────────────────┘
```
- **Left**: Hamburger menu (opens history drawer)
- **Center**: Page title
- **Right**: More options menu

**Bottom Navigation:**
```
┌────────────────────────────────────┐
│ [Input area - expanded on focus]   │
├────────────────────────────────────┤
│ 🏠 Home | 💬 Chat | 📚 Learn | 👤 Me│
└────────────────────────────────────┘
```

**Swipe Gestures:**
- Swipe right: Open history drawer
- Swipe left: Close current chat
- Pull down: Refresh/new chat
- Long-press message: Copy, share, delete

---

## 🎭 MICRO-INTERACTIONS & ANIMATIONS

### 1. **Message Send Animation**
```
User types → Clicks send → Message slides up from input
→ Input clears with fade → AI typing indicator appears
→ AI message fades in from left
```
- **Duration**: 0.3s per transition
- **Easing**: Ease-out (natural feel)

### 2. **Suggested Question Interaction**
```
User hovers chip → Chip lifts 2px, shadow increases
→ User clicks → Chip fills green, sends question
→ Chip fades out → Question appears as user message
```

### 3. **Voice Recording Feedback**
```
Click mic → Button pulses red → Waveform animates
→ Audio visualizer shows levels → Click again
→ Transcription appears in input with typing effect
```

### 4. **File Upload Flow**
```
Drag file over chat → Dotted border appears, tinted green
→ Drop file → File card appears with progress bar
→ Upload complete → Checkmark animation
→ AI analyzes → "Analyzing document..." message
→ Results appear with extracted data highlighted
```

### 5. **Language Switch**
```
User selects new language → Brief fade transition
→ UI text changes → AI sends greeting in new language
→ Confetti animation (subtle) on first language switch
```

### 6. **Scroll Behavior**
```
New message arrives → Auto-scroll to bottom (smooth)
→ User scrolls up → Auto-scroll disabled
→ New message arrives → "New message ↓" button appears
→ Click button → Smooth scroll to bottom
```

### 7. **Error States**
```
Network error → Retry button appears with shake animation
→ Message fails → Red indicator with retry option
→ Success on retry → Green checkmark pulse
```

---

## 🎨 VISUAL DESIGN SYSTEM

### Color Palette

**Primary:**
- AI Messages Background: #F7F9FC (Cool gray)
- User Messages Background: Linear gradient #008751 → #00A862 (Nigerian green)
- Accent: #FFB81C (Gold for highlights)

**Semantic:**
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

**Text:**
- Primary: #1A1F36 (Navy)
- Secondary: #6B7280 (Gray)
- Tertiary: #9CA3AF (Light gray)
- On-color: #FFFFFF (White)

### Typography

**Font Stack:**
- **Interface**: Inter (clean, readable)
- **Headings**: Plus Jakarta Sans (modern, bold)
- **Code/Data**: JetBrains Mono (monospace)

**Sizes:**
- Hero heading: 48px
- Section heading: 32px
- Message text: 16px (18px on large screens)
- Meta text: 14px
- Small text: 12px

### Shadows & Elevation

**Level 1 (Cards):**
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
```

**Level 2 (Hover):**
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```

**Level 3 (Modal):**
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
```

### Border Radius

- Small: 8px (chips, buttons)
- Medium: 12px (inputs, cards)
- Large: 16px (message bubbles)
- Extra-large: 24px (panels)

### Spacing Scale

```
4px   - Tiny
8px   - XS
12px  - S
16px  - M
24px  - L
32px  - XL
48px  - 2XL
64px  - 3XL
```

---

## ♿ ACCESSIBILITY FEATURES

### Keyboard Navigation

**Shortcuts:**
- `Ctrl/Cmd + N`: New chat
- `Ctrl/Cmd + K`: Focus search
- `Enter`: Send message
- `Shift + Enter`: New line
- `Esc`: Clear input / Close modal
- `Ctrl/Cmd + /`: Show shortcuts
- `↑/↓`: Navigate message history
- `Tab`: Navigate interface elements

### Screen Reader Support

**ARIA Labels:**
- All buttons have descriptive labels
- Message roles properly marked (user/assistant)
- Form inputs labeled correctly
- Loading states announced
- Error messages read aloud

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- Lists for conversation history
- Buttons vs links used correctly
- Form structure clear

### Visual Accessibility

**Contrast Ratios:**
- All text meets WCAG AA (4.5:1 minimum)
- Large text meets AAA (7:1)
- Interactive elements clearly distinguishable

**Focus Indicators:**
- 2px green outline on all focusable elements
- High visibility (never hidden)
- Consistent across interface

**Motion Sensitivity:**
- Respects `prefers-reduced-motion`
- Option to disable animations
- No auto-playing content

### Language Accessibility

**Multi-language Support:**
- Full UI translation for 4 languages
- Voice input in all languages
- Text-to-speech output
- Right-to-left support (future: Arabic)

**Reading Level:**
- Simple, clear language
- Avoid jargon where possible
- Definitions for technical terms
- Plain language summaries

---

## 