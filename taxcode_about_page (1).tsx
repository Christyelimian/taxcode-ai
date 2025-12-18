# Tax Code: About Us Page - Innovative Interactive UI Design Document

---

## 🎯 Page Objectives

The About Us page must accomplish:
1. **Build Trust**: Establish Tax Code as authoritative and credible
2. **Tell Our Story**: Journey from non-profit advocacy to AI-powered ecosystem
3. **Show Values**: Demonstrate commitment to transparency, fairness, justice
4. **Prove Expertise**: Showcase team, governance, methodology
5. **Inspire Confidence**: Make visitors feel they're in capable hands
6. **Drive Action**: Convert visitors to users/subscribers

---

## 📐 Overall Page Structure

### Navigation Pattern: **Sticky Sidebar Navigation**

```
┌────────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                       │
├──────────┬─────────────────────────────────────────────┤
│          │                                             │
│  SIDE    │         MAIN CONTENT AREA                   │
│  NAV     │         (Scrollable)                        │
│  (Sticky)│                                             │
│          │         [Active section highlights          │
│  • Who   │          as you scroll]                     │
│  • Phil  │                                             │
│  • Obj   │                                             │
│  • App   │                                             │
│  • Gov   │                                             │
│  • Tech  │                                             │
│          │                                             │
│  [20%]   │              [80%]                          │
└──────────┴─────────────────────────────────────────────┘
```

**Sidebar Features:**
- Fixed position on desktop
- Active section highlighted with green accent
- Progress bar showing scroll position
- Smooth scroll to section on click
- Collapses to hamburger on mobile

---

## 🎨 Hero Section (Above the Fold)

### Design Concept: **Split-Screen Narrative**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  LEFT (50%)              │  RIGHT (50%)                  │
│  ────────────            │  ─────────────                │
│                          │                               │
│  ABOUT TAX CODE          │  [Animated Timeline]          │
│                          │                               │
│  "Beyond Rates and       │     2024                      │
│   Revenue"               │      │ Founded                │
│                          │      ●                        │
│  Leading Nigeria's       │      │                        │
│  tax transformation      │     2025                      │
│  through law, process,   │      │ AI Platform            │
│  justice—and intelligent │      ●                        │
│  technology.             │      │                        │
│                          │     2026                      │
│  [Scroll to explore]     │      │ Full Launch            │
│         ↓                │      ●                        │
│                          │                               │
└──────────────────────────┴───────────────────────────────┘
```

**Interactive Elements:**
- Timeline animates on load (dots appear sequentially)
- Hover on timeline dots reveals milestone details
- Parallax effect: Left text moves slower than right timeline
- Subtle particle animation in background (data nodes)
- Scroll indicator pulses gently

**Mobile Adaptation:**
- Stacks vertically (Timeline on top, text below)
- Timeline becomes horizontal scroll

---

## 📑 Section 1: WHO WE ARE

### Design Concept: **Expanding Story Cards**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  WHO WE ARE                                              │
│  ═══════════                                             │
│                                                          │
│  [Large opening paragraph with key stats highlighted]    │
│                                                          │
│  Tax Code is a non-profit organisation established to    │
│  advance tax awareness, advocacy and strategic guidance  │
│  through law, policy and process...                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  KEY STATS (Animated Counters)                     │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐    │  │
│  │  │  15,000+ │  50,000+ │    98%   │  4 States│    │  │
│  │  │  Users   │  Queries │ Accuracy │  Covered │    │  │
│  │  └──────────┴──────────┴──────────┴──────────┘    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  OUR EVOLUTION                                           │
│  ─────────────                                           │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ [Icon: Book] │  │ [Icon: Plus] │  │[Icon: Brain] │  │
│  │              │  │              │  │              │  │
│  │  ADVOCACY    │  │  EDUCATION   │  │     AI       │  │
│  │  Non-profit  │  │  Training &  │  │  Technology  │  │
│  │  foundation  │  │  Resources   │  │  Platform    │  │
│  │              │  │              │  │              │  │
│  │  [Hover to   │  │  [Hover to   │  │  [Hover to   │  │
│  │   expand]    │  │   expand]    │  │   expand]    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│          ↓                ↓                  ↓          │
│      [Expanded card shows detailed content]             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interaction Details:**

**Stats Counter Animation:**
- Numbers count up from 0 when scrolled into view
- Smooth easing animation (not instant)
- Icons pulse subtly

**Evolution Cards:**
- Default state: Compact, 250px height
- Hover state: 
  - Card expands to 400px height
  - Background gradient intensifies
  - Detailed content fades in
  - Other cards dim slightly (focus effect)
- Click state (mobile): Toggle expanded view

**Content in Expanded Cards:**

**Card 1: ADVOCACY**
```
"We examine power, process and accountability within 
Nigeria's tax system, ensuring fairness and protecting 
taxpayer rights through policy dialogue and institutional 
engagement."

Key Focus:
✓ Taxpayer rights protection
✓ Policy analysis & reform
✓ Administrative accountability
✓ Dispute resolution guidance
```

**Card 2: EDUCATION**
```
"We bridge the gap between legislation and practice by 
explaining how tax laws actually work, making complex 
regulations accessible to all Nigerians."

Key Focus:
✓ Free educational content
✓ Training programs
✓ Workshops & webinars
✓ Resource library
```

**Card 3: AI TECHNOLOGY**
```
"We leverage artificial intelligence to democratize access 
to expert tax guidance, providing instant, accurate answers 
in any Nigerian language, 24/7."

Key Focus:
✓ Multi-language AI assistant
✓ Smart calculators
✓ Compliance automation
✓ Predictive analytics
```

---

## 📑 Section 2: OUR PHILOSOPHY

### Design Concept: **Interactive Principle Cards with Visual Metaphors**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  OUR PHILOSOPHY                                          │
│  ═══════════════                                         │
│                                                          │
│  Tax Code is founded on the belief that effective        │
│  taxation depends on clarity, fairness and trust...      │
│                                                          │
│  CORE PRINCIPLES                                         │
│  ───────────────                                         │
│                                                          │
│  [Hexagonal Grid of Principles - Interactive]           │
│                                                          │
│         ┌────────┐                                       │
│         │CLARITY │                                       │
│    ┌────┼────────┼────┐                                 │
│    │FAIR│        │TRUST│                                │
│    └────┼────────┼────┘                                 │
│         │ACCOUNT │                                       │
│         └────────┘                                       │
│         │SUSTAIN │                                       │
│         └────────┘                                       │
│                                                          │
│  [Click any principle to explore]                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ACTIVE PRINCIPLE: CLARITY                         │  │
│  │  ────────────────────────────                       │  │
│  │                                                     │  │
│  │  [Icon: Eye]  "Transparency in Every Process"      │  │
│  │                                                     │  │
│  │  We believe taxpayers have the right to understand │  │
│  │  exactly how their obligations are determined,     │  │
│  │  when they arise, and how they can challenge       │  │
│  │  decisions they believe are incorrect.             │  │
│  │                                                     │  │
│  │  ✓ Plain language explanations                     │  │
│  │  ✓ Process flowcharts                              │  │
│  │  ✓ Real-world examples                             │  │
│  │  ✓ AI-powered instant answers                      │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interaction Pattern:**

1. **Hexagonal Grid:**
   - Each hexagon represents a principle
   - Hover: Hexagon glows with green border
   - Click: Hexagon expands, content panel appears below
   - Active hexagon has solid green background
   - Other hexagons fade slightly when one is active

2. **Content Panel:**
   - Slides up from bottom when principle selected
   - Animated icon related to principle
   - Quote-style large text
   - Bulleted implementation details
   - "See this in action" link (to relevant tool/content)

**The 5 Core Principles:**

1. **CLARITY** (Eye icon)
   - Transparency in processes
   - Plain language communication
   - Visual explanations

2. **FAIRNESS** (Scale icon)
   - Equal treatment under law
   - Rights-based approach
   - Objective standards

3. **TRUST** (Shield icon)
   - Data protection
   - Independence from authorities
   - Proven accuracy

4. **ACCOUNTABILITY** (Target icon)
   - Government oversight
   - Dispute resolution
   - Administrative limits

5. **SUSTAINABILITY** (Growth icon)
   - Voluntary compliance
   - Long-term revenue health
   - Ecosystem thinking

---

## 📑 Section 3: OUR OBJECTIVES

### Design Concept: **Numbered Objective Cards with Progress Visualization**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  OUR OBJECTIVES                                          │
│  ═══════════════                                         │
│                                                          │
│  The core objective of Tax Code is to promote sound      │
│  tax understanding and voluntary compliance...           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  [Visual: Circular objective wheel]              │   │
│  │                                                   │   │
│  │           ┌─────────┐                            │   │
│  │      ┌────│    1    │────┐                       │   │
│  │      │    └─────────┘    │                       │   │
│  │   ┌──┴──┐            ┌──┴──┐                    │   │
│  │   │  6  │   CENTER   │  2  │                    │   │
│  │   └──┬──┘  "Impact"  └──┬──┘                    │   │
│  │      │                   │                       │   │
│  │   ┌──┴──┐            ┌──┴──┐                    │   │
│  │   │  5  │            │  3  │                    │   │
│  │   └──┬──┘            └──┬──┘                    │   │
│  │      └────┬────────┬────┘                       │   │
│  │           │   4    │                            │   │
│  │           └────────┘                            │   │
│  │                                                   │   │
│  │  [Hover or click any number to see objective]    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  📌 OBJECTIVE 1: Promote Tax Understanding        │  │
│  │  ──────────────────────────────────────────────   │  │
│  │                                                    │  │
│  │  Explain the legal and policy framework governing │  │
│  │  taxation from assessment to enforcement and      │  │
│  │  dispute resolution.                              │  │
│  │                                                    │  │
│  │  How we deliver:                                  │  │
│  │  • 500+ educational articles                      │  │
│  │  • 50+ training modules                           │  │
│  │  • AI-powered explanations                        │  │
│  │                                                    │  │
│  │  Impact so far:                                   │  │
│  │  [Progress bar] ████████░░ 80% of target          │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**The 6 Core Objectives:**

**1. Promote Tax Understanding**
- Explain legal frameworks
- Demystify processes
- Bridge legislation-to-practice gap

**2. Enable Voluntary Compliance**
- Remove fear and confusion
- Provide clear guidance
- Make compliance easier than evasion

**3. Protect Taxpayer Rights**
- Educate on entitlements
- Challenge unfair practices
- Support dispute resolution

**4. Leverage AI Technology**
- Democratize expert guidance
- Provide instant answers
- Multilingual accessibility

**5. Support Policy Reform**
- Evidence-based advocacy
- Stakeholder engagement
- Implementation feedback

**6. Build Sustainable Revenue**
- Long-term compliance culture
- Reduce dispute costs
- Strengthen state-citizen trust

**Interaction:**
- Hover on number: Lights up, shows title
- Click: Full objective card slides in from side
- Progress bars animate when visible
- Each objective has "Learn more" link to relevant content

---

## 📑 Section 4: OUR APPROACH

### Design Concept: **Process Flow Visualization with Interactive Steps**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  OUR APPROACH                                            │
│  ═════════════                                           │
│                                                          │
│  Tax Code adopts a practical, process-driven approach    │
│  to tax education and advocacy...                        │
│                                                          │
│  HOW WE WORK                                             │
│  ────────────                                            │
│                                                          │
│  [Horizontal Flow Diagram - Animated]                    │
│                                                          │
│  RESEARCH → ANALYZE → EXPLAIN → EMPOWER → ADVOCATE       │
│     ●          ●         ●         ●         ●           │
│     │          │         │         │         │           │
│     └──────────┴─────────┴─────────┴─────────┘           │
│                [Connected Flow]                          │
│                                                          │
│  [Click any stage to see details]                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  🔍 STAGE 1: RESEARCH                              │  │
│  │  ────────────────────                              │  │
│  │                                                     │  │
│  │  We study legislation, regulations, case law and   │  │
│  │  administrative practices to understand how the    │  │
│  │  tax system actually operates.                     │  │
│  │                                                     │  │
│  │  Methods:                                           │  │
│  │  • Legislative analysis                            │  │
│  │  • Case law research                               │  │
│  │  • Administrative guidelines review                │  │
│  │  • International best practices                    │  │
│  │                                                     │  │
│  │  [Next: Analyze →]                                 │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**The 5-Stage Approach:**

**1. RESEARCH** 🔍
- Legislative analysis
- Case law study
- Administrative practice review
- Stakeholder interviews

**2. ANALYZE** 📊
- Identify gaps and ambiguities
- Map process flows
- Assess practical implications
- Compare international standards

**3. EXPLAIN** 📝
- Create plain language content
- Develop visual guides
- Train AI models
- Publish educational materials

**4. EMPOWER** 💪
- Build AI tools
- Provide calculators
- Generate documents
- Automate compliance

**5. ADVOCATE** 📢
- Policy recommendations
- Stakeholder engagement
- Public statements
- Reform proposals

**Interactive Elements:**
- Flow line animates left to right on load
- Clicking a stage highlights it and shows detail card
- Progress indicator shows which stage is active
- "Next" button flows to next stage
- Background color shifts subtly per stage
- Each stage has icon animation on hover

---

## 📑 Section 5: PROMOTERS & GOVERNANCE

### Design Concept: **Leadership Grid with Expandable Profiles**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  PROMOTERS & GOVERNANCE                                  │
│  ═══════════════════════                                 │
│                                                          │
│  Tax Code is promoted by experienced lawyers, policy     │
│  strategists and technocrats with deep expertise...      │
│                                                          │
│  LEADERSHIP TEAM                                         │
│  ───────────────                                         │
│                                                          │
│  ┌───────────┬───────────┬───────────┬───────────┐     │
│  │   [Photo] │   [Photo] │   [Photo] │   [Photo] │     │
│  │           │           │           │           │     │
│  │   Name    │   Name    │   Name    │   Name    │     │
│  │   Title   │   Title   │   Title   │   Title   │     │
│  │           │           │           │           │     │
│  │ [LinkedIn]│ [LinkedIn]│ [LinkedIn]│ [LinkedIn]│     │
│  │  [View+]  │  [View+]  │  [View+]  │  [View+]  │     │
│  └───────────┴───────────┴───────────┴───────────┘     │
│                                                          │
│  [When clicked, card expands below grid]                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  CHRISTOPHER BISHARA - Project Lead               │  │
│  │  ─────────────────────────────────────────────     │  │
│  │                                                     │  │
│  │  [Larger Photo]  [Full Bio]                        │  │
│  │                                                     │  │
│  │  Christopher brings X years of experience in tax   │  │
│  │  law and policy, having worked with...             │  │
│  │                                                     │  │
│  │  Key Expertise:                                     │  │
│  │  • Tax litigation                                   │  │
│  │  • Policy advocacy                                  │  │
│  │  • Corporate advisory                               │  │
│  │                                                     │  │
│  │  Education: [Degrees]                               │  │
│  │  Contact: [Email] [LinkedIn]                        │  │
│  │                                                     │  │
│  │  [Close ×]                                          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  GOVERNANCE STRUCTURE                                    │
│  ────────────────────                                    │
│                                                          │
│  [Organizational Chart - Interactive]                    │
│                                                          │
│              ┌─────────────────────┐                     │
│              │  Board of Trustees  │                     │
│              └──────────┬──────────┘                     │
│                         │                                │
│         ┌───────────────┼───────────────┐               │
│         │               │               │               │
│  ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐       │
│  │  Advisory  │  │ Operations │  │ Technology │       │
│  │   Board    │  │    Team    │  │    Team    │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                                                          │
│  [Hover on any box for team details]                     │
│                                                          │
│  INDEPENDENCE & ETHICS                                   │
│  ──────────────────────                                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  🛡️ Our Commitments                              │   │
│  │                                                   │   │
│  │  ✓ Not an agent of any tax authority             │   │
│  │  ✓ No commercial compliance services              │   │
│  │  ✓ Public interest focus                          │   │
│  │  ✓ Transparent governance                         │   │
│  │  ✓ Independent analysis                           │   │
│  │  ✓ Objective advocacy                             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Profile Card Interaction:**
- Default: Compact card with photo, name, title
- Hover: Card lifts, shadow increases
- Click: Expands to show full bio below grid
- Others fade slightly when one is active
- Close button to collapse
- LinkedIn icon links to profile

**Org Chart Interaction:**
- Hover on box: Highlights and shows member count
- Click: Shows list of team members in modal
- Connecting lines animate on load
- Responsive: Becomes vertical on mobile

---

## 📑 Section 6: TECHNOLOGY & INNOVATION

### Design Concept: **Tech Stack Showcase with Live Demos**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  TECHNOLOGY & INNOVATION                                 │
│  ════════════════════════                                │
│                                                          │
│  In 2025, Tax Code became Nigeria's first AI-powered     │
│  tax compliance ecosystem, combining institutional       │
│  authority with cutting-edge technology.                 │
│                                                          │
│  OUR TECHNOLOGY STACK                                    │
│  ────────────────────────                                │
│                                                          │
│  [3-Column Grid - Animated Icons]                        │
│                                                          │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │ AI & ML      │ Cloud        │ Security     │         │
│  │              │ Infrastructure│              │         │
│  │ [Brain Icon] │ [Cloud Icon] │ [Lock Icon]  │         │
│  │              │              │              │         │
│  │ • Claude AI  │ • Firebase   │ • 256-bit    │         │
│  │ • NLP Models │ • Real-time  │   Encryption │         │
│  │ • Multi-lang │   Database   │ • SOC 2      │         │
│  │              │ • Auto-scale │ • GDPR       │         │
│  └──────────────┴──────────────┴──────────────┘         │
│                                                          │
│  HOW OUR AI WORKS                                        │
│  ────────────────                                        │
│                                                          │
│  [Split Screen: Explanation + Live Demo]                 │
│                                                          │
│  LEFT (60%):                 RIGHT (40%):                │
│  ─────────                   ──────────                  │
│                                                          │
│  Our AI is trained on:       [Mini Chat Interface]      │
│  • Nigerian tax laws         User: "What's VAT?"         │
│  • FIRS guidelines           ─────────────────           │
│  • Case precedents           AI: "VAT in Nigeria         │
│  • 2026 reform acts          is..."                      │
│                              [Try it →]                  │
│  Processing flow:                                        │
│  1. Question received        [Live demo embed]           │
│  2. Context analyzed                                     │
│  3. Knowledge searched       [Real AI responses]         │
│  4. Answer generated                                     │
│  5. Sources cited                                        │
│                                                          │
│  Accuracy: 98%                                           │
│  Response time: <2s                                      │
│  Languages: 4                                            │
│                                                          │
│                                                          │
│  DATA PROTECTION & PRIVACY                               │
│  ──────────────────────────                              │
│                                                          │
│  [Security Features Grid]                                │
│                                                          │
│  ┌────────────┬────────────┬────────────┬────────────┐  │
│  │ End-to-End │ Zero-      │ Regular    │ GDPR       │  │
│  │ Encryption │ Knowledge  │ Audits     │ Compliant  │  │
│  │            │ Architecture│            │            │  │
│  │ [Icon]     │ [Icon]     │ [Icon]     │ [Icon]     │  │
│  │            │            │            │            │  │
│  │ Your data  │ We cannot  │ Third-party│ EU-standard│  │
│  │ is always  │ see your   │ security   │ privacy    │  │
│  │ encrypted  │ queries    │ reviews    │ protection │  │
│  └────────────┴────────────┴────────────┴────────────┘  │
│                                                          │
│  [Read Full Privacy Policy →]                            │
│                                                          │
│  INNOVATION ROADMAP                                      │
│  ──────────────────                                      │
│                                                          │
│  [Timeline with Releases]                                │
│                                                          │
│  Q4 2025              Q1 2026              Q2 2026       │
│    ●───────────────────●───────────────────●             │
│    │                   │                   │             │
│  Platform            Enhanced            Advanced        │
│  Launch              Tools                Analytics      │
│                                                          │
│  [View Full Roadmap →]                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Live Demo Integration:**
- Embedded AI chat (limited queries for non-users)
- Real responses, not pre-scripted
- "Sign up for unlimited access" CTA below demo
- Shows actual product capability

**Tech Stack Icons:**
- Animated on scroll-into-view
- Hover shows tooltip with more details
- Click opens modal with deep-dive explanation

---

## 🎬 Page-Wide Interactive Features

### 1. **Progress Indicator**
```
Fixed at top of page:
[════════════════░░░░░░░░░░] 60%

Colors:
- Incomplete: Light gray
- Complete: Green gradient
- Shows exact scroll percentage
```

### 2. **Floating Action Buttons**
```
Fixed bottom-right:

[Chat Icon]  "Ask AI"
[Arrow Up]   "Back to Top"

Appears after scrolling 500px
Hover: Expands with label
```

### 3. **Section Transitions**
```
Animation: Fade-in from bottom
Trigger: When 20% of section is visible
Stagger: Elements appear sequentially (title → content → cards)
Easing: Smooth, natural (not mechanical)
```

### 4. **Parallax Elements**
```
Background elements move slower than foreground
Subtle depth effect
Not overdone (maintains professionalism)
Disabled on mobile (performance)
```

### 5. **Micro-Interactions**
```
Hover States:
- Cards: Lift + shadow
- Buttons: Scale 1.05 + color shift
- Links: Underline slide-in
- Icons: Gentle bounce

Click Feedback:
- Ripple effect from click point
- Brief scale down then up
- Color pulse
```

---

## 📱 Mobile Optimization

### Responsive Breakpoints

**Desktop (1024px+):**
- Sidebar navigation visible
- Multi-column layouts
- Hover interactions

**Tablet (768-1023px):**
- Collapsible sidebar
- 2-column layouts become 1-column
- Touch-optimized buttons (larger)

**Mobile (< 768px):**
- Hamburger menu
- All content stacks vertically
- Simplified animations (performance)
- Thumb-friendly touch targets (48px min)

### Mobile-Specific Features
```
• Pull-to-refresh (reload page)
• Swipe between sections
• Bottom sheet modals (not center)
• Sticky "Contact" button at bottom
• Simplified charts (mobile-optimized)
```

---

## 🎨 Visual Design System for About Page

### Color Usage

**Primary Colors:**
- **Nigerian Green (#008751)**: Section headers, primary CTAs, active states
- **Deep Navy (#1A1F36)**: Body text, secondary headers
- **Cool Gray (#F7F9FC)**: Backgrounds, cards

**Accent Colors:**
- **Gold (#FFB81C)**: Highlights, stats, achievement badges
- **Teal (#17A2B8)**: Info boxes, tech-related content
- **Red (#E74C3C)**: Minimal use for important callouts

### Typography Scale

```
Hero Title: 56px, Bold, Navy
Section Titles: 40px, Bold, Navy (with green underline)
Subsection: 28px, Semibold, Navy
Body Large: 18px, Regular, Dark Gray
Body: 16px, Regular, Gray