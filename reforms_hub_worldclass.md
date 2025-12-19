# 2026 Tax Reforms Hub - World-Class UI Design Document
## Tax Code Nigeria | Nigeria's Tax Revolution Explained

---

## 🎯 PAGE VISION

**The 2026 Tax Reforms Hub is Nigeria's definitive resource for understanding the most significant tax overhaul in 26 years.**

This page must communicate:
- **Urgency**: January 1, 2026 deadline is approaching
- **Clarity**: Complex reforms explained simply
- **Empowerment**: "You can understand and prepare for this"
- **Authority**: Official, accurate, comprehensive information
- **Action**: Clear next steps for every user type

**User Promise:** "Understand exactly how the 2026 tax reforms affect YOU—in plain language, with tools to prepare."

---

## 🏗 PAGE ARCHITECTURE

### Information Hierarchy Strategy: **"Progressive Revelation"**

```
1. HERO: What's changing + Countdown urgency
2. OVERVIEW: The 4 reform acts explained
3. IMPACT: "How does this affect ME?" (personalized)
4. TIMELINE: What happens when
5. BEFORE/AFTER: Visual comparisons
6. DEEP DIVES: Each reform act detailed
7. RESOURCES: Tools, guides, documents
8. FAQ: Common concerns addressed
9. STAY UPDATED: Newsletter + notifications
```

**Design Philosophy:**
- Start broad, then drill down
- Visual-first (less reading, more understanding)
- Interactive elements everywhere
- Personalization based on user type
- Mobile-optimized (70% of traffic)

---

## 🎨 HERO SECTION - "THE REVOLUTION IS HERE"

### Design Concept: **"Countdown + Impact Visualization"**

**Layout (Full viewport height - 100vh):**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    NIGERIA'S TAX REVOLUTION                      │
│                    ══════════════════════════                    │
│                                                                  │
│         Understanding the 2026 Tax Reforms That Change          │
│                    Everything You Know About Tax                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │           ⏰ REFORM TAKES EFFECT IN:                    │    │
│  │                                                         │    │
│  │        [45] DAYS : [12] HOURS : [34] MINUTES           │    │
│  │                                                         │    │
│  │             January 1, 2026                             │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   4 NEW      │  12+ OLD     │   MILLIONS   │   ₦800,000   │ │
│  │   ACTS       │  LAWS        │  AFFECTED    │   TAX-FREE   │ │
│  │              │  REPLACED    │              │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  [📖 Start Learning]  [🧮 Impact Calculator]  [📥 Download     │
│                                                    Guide]       │
│                                                                  │
│                      [Scroll to explore ↓]                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Visual Treatment:**

**Background:**
- Animated gradient: Nigerian flag colors (Green → White → Green)
- Subtle particle system: Flowing data points representing transformation
- Parallax effect on scroll
- Dark overlay (60% opacity) for text readability

**Countdown Timer:**
- **Size**: Massive numbers (72px bold)
- **Style**: Monospace font (JetBrains Mono)
- **Animation**: Numbers flip when changing (like airport board)
- **Container**: Semi-transparent dark card with subtle glow
- **Mobile**: Stacks vertically, slightly smaller (48px)

**Impact Stats (4-Column Grid):**
- **Card Style**: Glassmorphism (frosted glass effect)
- **Number**: 56px, bold, white
- **Label**: 16px, white/80% opacity
- **Icons**: Above each number (64px, green)
- **Hover**: Card lifts 4px, glow intensifies
- **Animation**: Numbers count up on page load

**CTA Buttons:**
- **Primary** (Start Learning): Solid green, white text, 56px height
- **Secondary** (Impact Calculator): White border, white text
- **Tertiary** (Download Guide): Text link with arrow
- **Spacing**: 16px gap between buttons
- **Hover**: Scale 1.05, shadow increase
- **Icons**: 24px, left-aligned in button

**Scroll Indicator:**
- Animated down arrow (bounces gently)
- Fades out on scroll
- Click scrolls smoothly to next section

---

## 📋 SECTION 1: WHAT'S CHANGING - OVERVIEW

### Design Concept: **"4 Acts, One Revolution"**

**Section Header:**
```
THE 4 ACTS THAT CHANGE EVERYTHING
════════════════════════════════════

On June 26, 2025, President Bola Ahmed Tinubu signed four landmark 
tax reform bills into law, fundamentally reshaping how Nigeria 
collects revenue. Here's what you need to know.
```

**Visual Layout: Interactive Card Grid**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │                      │  │                      │          │
│  │  📜 ACT 1            │  │  🏛️ ACT 2            │          │
│  │                      │  │                      │          │
│  │  Nigeria Tax         │  │  Nigeria Tax         │          │
│  │  Bill 2024           │  │  Administration      │          │
│  │                      │  │  Bill 2024           │          │
│  │  "The Framework"     │  │  "The Enforcer"      │          │
│  │                      │  │                      │          │
│  │  Key Changes:        │  │  Key Changes:        │          │
│  │  • Single tax code   │  │  • TIN mandatory     │          │
│  │  • Simplified rates  │  │  • Enhanced powers   │          │
│  │  • Clear rules       │  │  • Data sharing      │          │
│  │                      │  │                      │          │
│  │  [Learn More →]      │  │  [Learn More →]      │          │
│  │                      │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │                      │  │                      │          │
│  │  💼 ACT 3            │  │  ⚖️ ACT 4            │          │
│  │                      │  │                      │          │
│  │  Nigeria Revenue     │  │  Joint Revenue       │          │
│  │  Service Bill        │  │  Board Bill          │          │
│  │                      │  │                      │          │
│  │  "The Institution"   │  │  "The Coordinator"   │          │
│  │                      │  │                      │          │
│  │  Key Changes:        │  │  Key Changes:        │          │
│  │  • FIRS → NRS        │  │  • New oversight     │          │
│  │  • AI-driven tools   │  │  • State-Fed harmony │          │
│  │  • Modern systems    │  │  • Dispute resolver  │          │
│  │                      │  │                      │          │
│  │  [Learn More →]      │  │  [Learn More →]      │          │
│  │                      │  │                      │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Card Design:**
- **Size**: 400px × 500px (desktop), full-width stacked (mobile)
- **Background**: White with subtle gradient on hover
- **Border**: 2px solid light gray (green on hover)
- **Shadow**: 0 4px 16px rgba(0,0,0,0.08)
- **Icon**: 80px, colored (unique per act), top of card
- **Nickname**: Italicized, 18px, gray
- **Bullet Points**: Green checkmarks, 16px text
- **Hover State**: 
  - Card lifts 8px
  - Shadow intensifies
  - "Learn More" button appears/glows
  - Subtle scale increase (1.02)

**Mobile Adaptation:**
- Cards stack vertically
- Swipe left/right to navigate
- Progress dots at bottom
- Reduced padding/text size

---

## 🎯 SECTION 2: HOW DOES THIS AFFECT YOU?

### Design Concept: **"Personalized Impact Quiz"**

**Interactive Selector:**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│            HOW DO THE 2026 REFORMS AFFECT YOU?                   │
│            ═══════════════════════════════════                   │
│                                                                  │
│  Select your profile to see personalized insights:              │
│                                                                  │
│  ┌────────────┬────────────┬────────────┬────────────┐         │
│  │            │            │            │            │         │
│  │    👤      │    💼      │    🏢      │    🎓      │         │
│  │            │            │            │            │         │
│  │ Individual │  Business  │ Large      │  Student/  │         │
│  │ Taxpayer   │  Owner     │ Enterprise │  Unemployed│         │
│  │            │            │            │            │         │
│  │  [Select]  │  [Select]  │  [Select]  │  [Select]  │         │
│  │            │            │            │            │         │
│  └────────────┴────────────┴────────────┴────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Profile Card Interaction:**
1. User clicks profile type
2. Card highlights (green border, slight scale)
3. Smooth scroll down to personalized content
4. Content area updates with relevant information

**Personalized Content Display (After Selection):**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  FOR INDIVIDUAL TAXPAYERS                                        │
│  ═══════════════════════════                                     │
│                                                                  │
│  ✅ GOOD NEWS FOR YOU:                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ • First ₦800,000 of annual income is now TAX-FREE          │ │
│  │ • Simplified tax brackets (easier to calculate)            │ │
│  │ • Relief for low and middle-income earners                 │ │
│  │ • Clearer deduction rules                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ⚠️ WHAT YOU NEED TO DO:                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Get your TIN by January 1, 2026 (if you don't have)    │ │
│  │ 2. Update your employer with your TIN                      │ │
│  │ 3. Understand new PAYE deductions                          │ │
│  │ 4. File returns using new forms                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  💰 ESTIMATED SAVINGS:                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [Interactive Slider]                                        │ │
│  │ Your Annual Income: ₦___________                            │ │
│  │                                                             │ │
│  │ You could save: ₦XX,XXX per year vs old system             │ │
│  │                                                             │ │
│  │ [Calculate My Exact Savings →]                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  📚 RESOURCES FOR YOU:                                           │
│  • [Download: Individual Taxpayer Guide]                        │
│  • [Watch: Understanding PAYE Changes]                          │
│  • [Tool: TIN Registration Guide]                               │
│  • [Course: Tax 101 for Employees]                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Content for Each Profile:**

**Individual Taxpayer:**
- ₦800K tax-free threshold
- PAYE changes
- TIN requirement
- Filing process

**Business Owner:**
- Small company definition (₦50M threshold)
- CIT vs PIT changes
- Development levy
- VAT implications
- Compliance requirements

**Large Enterprise:**
- Transfer pricing rules
- International tax provisions
- Enhanced reporting
- Audit readiness

**Student/Unemployed:**
- When tax applies
- Future planning
- Learning resources
- Entry-level guidance

**Visual Treatment:**
- Good news: Green background, checkmark icons
- Action items: Amber background, numbered list
- Savings calculator: Interactive, real-time updates
- Resources: Link cards with icons

---

## 📅 SECTION 3: REFORM TIMELINE

### Design Concept: **"Interactive Scroll-Based Timeline"**

**Visual Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    REFORM IMPLEMENTATION TIMELINE                │
│                    ═══════════════════════════════               │
│                                                                  │
│  [Vertical timeline with scroll-triggered animations]           │
│                                                                  │
│     2024                                                         │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  📅 Q4 2024: Awareness Campaign Begins                   │
│      │  • Public education starts                               │
│      │  • Stakeholder consultations                             │
│      │  • Resource materials published                          │
│      │                                                           │
│     2025                                                         │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  ✅ June 26, 2025: Acts Signed into Law                  │
│      │  • 4 reform bills become law                             │
│      │  • Implementation planning begins                        │
│      │  • Training programs launch                              │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  📢 July-Dec 2025: Preparation Period                    │
│      │  • NRS infrastructure setup                              │
│      │  • TIN registration drives                               │
│      │  • Business compliance guidance                          │
│      │  • Digital systems testing                               │
│      │                                                           │
│     2026                                                         │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  🚀 JANUARY 1, 2026: FULL EFFECT                         │
│      │  • New tax structure applies                             │
│      │  • TIN mandatory for all                                 │
│      │  • Enhanced enforcement begins                           │
│      │  • NRS officially operational                            │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  📊 Q1 2026: First Filing Under New System               │
│      │  • New return forms                                      │
│      │  • Digital submission priority                           │
│      │  • Support systems active                                │
│      │                                                           │
│      ●───────────────────────────────────────────────            │
│      │  ⚖️ Q2-Q4 2026: Enforcement & Refinement                 │
│      │  • Compliance monitoring                                 │
│      │  • Policy adjustments as needed                          │
│      │  • Taxpayer support ongoing                              │
│      │                                                           │
│      ▼                                                           │
│                                                                  │
│                 [WHERE ARE WE NOW? → Mark on timeline]           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Interactive Features:**

**1. Current Position Indicator:**
- Large pulsing dot showing "You are here"
- Different color (red for urgency if close to deadline)
- Always visible as user scrolls

**2. Scroll-Triggered Animations:**
- Timeline items fade in as user scrolls down
- Connecting line draws progressively
- Milestones appear with gentle bounce
- Past events: Green (completed)
- Future events: Gray (upcoming)
- Current event: Pulsing orange

**3. Expandable Details:**
- Click any milestone → Expands with more details
- Shows related actions, documents, news
- "Learn more" links to deep-dive content

**4. Sticky Date Labels:**
- Year labels stick to top as you scroll through that year
- Provides context without cluttering

**Mobile Optimization:**
- Horizontal scroll option (swipe through timeline)
- Simplified milestones (fewer details)
- Tap to expand full info

---

## 📊 SECTION 4: BEFORE vs AFTER COMPARISON

### Design Concept: **"Interactive Comparison Slider"**

**Section Header:**
```
SEE THE DIFFERENCE: BEFORE & AFTER 2026
═══════════════════════════════════════

Use the slider to compare how things worked before vs after the reforms
```

**Comparison Categories (Tabbed Interface):**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [Tax Rates] [Filing Process] [Enforcement] [Business Rules]    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  TAX RATES COMPARISON                                       │ │
│  │                                                             │ │
│  │  [Drag slider left/right to compare]                       │ │
│  │                                                             │ │
│  │  BEFORE 2026          │  │          AFTER 2026             │ │
│  │  ─────────────────    │  │    ─────────────────            │ │
│  │                       │  │                                  │ │
│  │  Personal Income Tax: │  │  Personal Income Tax:           │ │
│  │  • Complex brackets   │  │  • Simplified brackets          │ │
│  │  • No tax-free amount │  │  • ₦800,000 tax-free           │ │
│  │  • Rates: 7%-24%      │  │  • Rates: 0%-24%                │ │
│  │                       │  │                                  │ │
│  │  Companies Tax:       │  │  Companies Tax:                 │ │
│  │  • 30% flat rate      │  │  • ₦50M threshold               │ │
│  │  • No size exemptions │  │  • Small co. benefits           │ │
│  │                       │  │                                  │ │
│  │  [Visual: Tax burden  │  │  [Visual: Lower tax burden      │ │
│  │   chart showing high  │  │   chart showing relief]         │ │
│  │   rates]              │  │                                  │ │
│  │                       │  │                                  │ │
│  └───────────────────────┴──┴──────────────────────────────────┘ │
│                             ↕                                    │
│                       [Drag slider]                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Slider Interaction:**
- Drag handle left: Shows "BEFORE 2026" side
- Drag handle right: Shows "AFTER 2026" side
- Smooth transition with fade effect
- Comparison updates in real-time
- Mobile: Tap buttons to switch sides

**Comparison Topics:**

**1. Tax Rates:**
- Income tax brackets
- Corporate tax rates
- VAT rates
- Other taxes

**2. Filing Process:**
- Old: Paper-based, manual
- New: Digital-first, automated

**3. Enforcement:**
- Old: Limited tools, manual audits
- New: AI-driven, data sharing, real-time

**4. Business Rules:**
- Old: Complex thresholds
- New: Simplified, clearer definitions

**5. Taxpayer Rights:**
- Old: Ambiguous procedures
- New: Clear appeal processes

**Visual Treatment:**
- **Before side**: Slightly desaturated, gray tones
- **After side**: Vibrant colors, green accents
- **Icons**: Different for before/after (old vs modern)
- **Charts**: Side-by-side bar charts showing differences

---

## 📖 SECTION 5: DEEP DIVES - EACH ACT EXPLAINED

### Design Concept: **"Expandable Accordion with Rich Content"**

**Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              UNDERSTANDING EACH REFORM ACT IN DETAIL             │
│              ═══════════════════════════════════════             │
│                                                                  │
│  Click any act to explore its provisions, impacts, and actions  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  📜 NIGERIA TAX BILL 2024                         [+ Expand]│ │
│  │  "The Framework - Consolidating 12+ Tax Laws into One"      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🏛️ NIGERIA TAX ADMINISTRATION BILL 2024        [+ Expand] │ │
│  │  "The Enforcer - Powers, Procedures, and Compliance"        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  💼 NIGERIA REVENUE SERVICE BILL 2024            [+ Expand] │ │
│  │  "The Institution - FIRS Becomes NRS with Modern Tools"     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ⚖️ JOINT REVENUE BOARD BILL 2024                [+ Expand] │ │
│  │  "The Coordinator - Federal-State Tax Harmony"              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Expanded View (Example: Nigeria Tax Bill 2024):**

```
┌──────────────────────────────────────────────────────────────────┐
│  📜 NIGERIA TAX BILL 2024                             [- Collapse]│
│  ════════════════════════                                        │
│                                                                  │
│  OVERVIEW                                                        │
│  ────────                                                        │
│  This act consolidates over a dozen scattered tax laws into     │
│  one coherent statute, making Nigeria's tax system simpler      │
│  and more predictable.                                           │
│                                                                  │
│  KEY PROVISIONS                                                  │
│  ──────────────                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. SIMPLIFIED TAX STRUCTURE                             │  │
│  │     • Personal Income Tax: ₦800,000 tax-free threshold   │  │
│  │     • Progressive rates: 0%, 7%, 11%, 15%, 19%, 21%, 24% │  │
│  │     • Clear deduction rules                               │  │
│  │                                                           │  │
│  │  2. SMALL COMPANY SUPPORT                                 │  │
│  │     • Companies with turnover < ₦50M get benefits        │  │
│  │     • Reduced compliance burden                           │  │
│  │     • Simplified reporting requirements                   │  │
│  │                                                           │  │
│  │  3. VAT MODERNIZATION                                     │  │
│  │     • Expanded zero-rating for essentials                │  │
│  │     • Clearer input tax credit rules                      │  │
│  │     • Digital services included                           │  │
│  │                                                           │  │
│  │  4. DEVELOPMENT LEVY CLARITY                              │  │
│  │     • Clear thresholds and rates                          │  │
│  │     • Defined exemptions                                  │  │
│  │     • Simplified calculation                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  WHO THIS AFFECTS                                                │
│  ────────────────                                                │
│  ✓ All individuals earning income in Nigeria                    │
│  ✓ Companies of all sizes (special benefits for small)          │
│  ✓ VAT-registered businesses                                    │
│  ✓ Employers (PAYE obligations)                                 │
│                                                                  │
│  WHAT YOU MUST DO                                                │
│  ─────────────────                                               │
│  → Understand new tax brackets                                   │
│  → Review your tax position under new rates                      │
│  → Update payroll systems (employers)                            │
│  → Claim new reliefs and deductions                              │
│                                                                  │
│  RESOURCES & TOOLS                                               │
│  ──────────────────                                              │
│  📥 [Download Full Act Text - PDF]                              │
│  🧮 [Use Tax Calculator Under New Rates]                        │
│  📖 [Read Plain Language Guide]                                 │
│  🎥 [Watch Video Explainer - 10 mins]                           │
│  💬 [Ask AI Assistant Your Questions]                            │
│                                                                  │
│  OFFICIAL SOURCES                                                │
│  ─────────────────                                               │
│  • Nigeria Official Gazette: Vol. 112, No. 66                   │
│  • Signed: June 26, 2025                                        │
│  • Effective: January 1, 2026                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Accordion Behavior:**
- **Click header**: Expands smoothly (0.4s transition)
- **Multiple open**: Allow multiple acts expanded simultaneously
- **Deep linking**: URL updates on expand (shareable links)
- **Bookmark**: "Save for later" button in each section
- **Print/Export**: Option to export as PDF

**Content Structure (Consistent Across All Acts):**
1. Overview (2-3 sentences)
2. Key Provisions (expandable sub-items)
3. Who This Affects
4. What You Must Do (action items)
5. Resources & Tools (links)
6. Official Sources (credibility)

---

## 🎓 SECTION 6: LEARNING RESOURCES HUB

### Design Concept: **"Resource Library with Smart Filtering"**

**Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  COMPREHENSIVE REFORM RESOURCES                  │
│                  ═══════════════════════════════                 │
│                                                                  │
│  Everything you need to understand and prepare for 2026         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🔍 Search resources...          [Filter: All Types ▼]     │ │
│  │                                                             │ │
│  │  [All] [Guides] [Videos] [Tools] [Courses] [Documents]    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  FEATURED RESOURCES                                              │
│  ──────────────────                                              │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐    │
│  │             │             │             │             │    │
│  │  📖 GUIDE   │  🎥 VIDEO   │  🧮 TOOL    │  🎓 COURSE  │    │
│  │             │             │             │             │    │
│  │  Complete   │  2026       │  Tax Impact │  Reform     │    │
│  │  Reform     │  Reforms    │  Calculator │  Mastery    │    │
│  │  Guide      │  Explained  │             │  Program    │    │
│  │  60 pages   │  45 mins    │  Free       │  6 weeks    │    │
│  │             │             │             │             │    │
│  │  [Download] │  [Watch]    │  [Calculate]│  [Enroll]   │    │
│  │             │             │             │             │    │
│  └─────────────┴─────────────┴─────────────┴─────────────┘    │
│                                                                  │
│  ALL RESOURCES (Searchable Grid)                                 │
│  ────────────────────────
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Sort: [Most Relevant ▼]   View: [Grid ▦] [List ☰]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────┬───────────────┬───────────────┬────────────┐  │
│  │ 📖 Guide       │ 🧾 Template    │ ✅ Checklist   │ 📄 Document │  │
│  │ 2026 reforms   │ Objection      │ VAT readiness  │ Full act    │  │
│  │ overview       │ letter (draft) │                │ text (PDF)  │  │
│  │ 8 min read     │ 1 page         │ 12 steps       │ Official    │  │
│  │ [Open] [Save]  │ [Preview]      │ [Start]        │ [Download]  │  │
│  └───────────────┴───────────────┴───────────────┴────────────┘  │
│                                                                  │
│  ┌───────────────┬───────────────┬───────────────┬────────────┐  │
│  │ 📖 Guide       │ ✅ Checklist   │ 🧾 Template    │ 📖 Guide    │  │
│  │ Taxpayer       │ PAYE/employee  │ Record-keeping │ Small biz   │  │
│  │ rights primer  │ compliance     │ template       │ compliance  │  │
│  │ 10 min read    │ 9 steps        │ Spreadsheet    │ starter     │  │
│  │ [Open] [Save]  │ [Start]        │ [Download]     │ [Open]      │  │
│  └───────────────┴───────────────┴───────────────┴────────────┘  │
│                                                                  │
│          [Load more resources ↓]                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Resource Taxonomy (Matches `Resources Library` page):**

**Categories (Top-level):**
- **Guides**: “2026 reforms overview”, “Taxpayer rights primer”, “Small business compliance starter”
- **Templates**: “Objection letter (draft)”, “Appeal checklist”, “Record-keeping template”
- **Checklists**: “VAT readiness”, “PAYE/employee compliance”, “Year-end close”

**Resource Card Anatomy (Consistent UI Pattern):**
- **Left icon**: Guide / Template / Checklist / Document
- **Title**: 1 line max, truncates with ellipsis
- **Micro-meta**: duration/pages/format + “Updated” date
- **Primary action**: Open / Download / Start
- **Secondary**: Save for later, Share, Ask AI about this

**Smart Filtering (High-value, low friction):**
- **Search bar**: “Search resources…” (predictive suggestions)
- **Filters**:
  - Type: Guide / Template / Checklist / Document / Video / Tool / Course
  - Profile: Individual / Business / Large enterprise / Student
  - Act: Tax Bill / Admin Bill / NRS Bill / JRB Bill
  - Topic: PAYE, VAT, TIN, Objections/Appeals, Record-keeping
  - Status: New / Updated / Official
- **Chips** show applied filters with one-tap removal

**AI Assist Integration (Resource-to-Action):**
- “Ask AI to find a template” CTA (links to assistant)
- Inline “Ask AI” on every resource card:
  - “Summarize this in 60 seconds”
  - “Does this apply to me?”
  - “Generate a checklist from this”

**Trust & Compliance:**
- Official documents get an **“Official source”** badge
- Clear disclaimer: “Educational information — not legal advice”
- Versioning note: “Reforms effective Jan 1, 2026 — this page updates as guidance is published”

**Mobile Optimization:**
- Filter chips become horizontal scroll row
- Resource grid becomes 1-column list with sticky “Filter” button
- Primary action button stays visible (“Open/Download”) with thumb-friendly spacing

---

## ❓ SECTION 7: FAQ - ANSWER THE QUESTIONS EVERYONE ASKS

### Design Concept: **"Fast Answers + Deep Links"**

**Goal:** Reduce anxiety and friction by answering the top questions in **one screen**, then offer deep dives for users who need more.

**Layout (Two-Column on Desktop, Single-Column on Mobile):**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                         FREQUENTLY ASKED                         │
│                         ════════════════                         │
│                                                                  │
│  Quick answers, plain language, official references.             │
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │ 🔍 Search questions...        │  │  Popular topics          │ │
│  │ [__________________________]  │  │  [TIN] [PAYE] [VAT]      │ │
│  └──────────────────────────────┘  │  [Small business] [Rights]│ │
│                                    └──────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Q: When do the reforms start?                     [+]      │  │
│  │ A: They take effect January 1, 2026.                        │  │
│  │    [See timeline →] [Get readiness checklist →]             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Q: Do I need a TIN now?                          [+]        │  │
│  │ A: Prepare before Jan 1, 2026. TIN becomes essential for     │  │
│  │    smooth compliance under the new system.                   │  │
│  │    [TIN guide →] [Ask AI: do I have one? →]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Q: What does ₦800,000 tax‑free mean for me?       [+]       │  │
│  │ A: For many employees, the first ₦800,000 of annual income   │  │
│  │    is not taxed under the new structure.                     │  │
│  │    [Use savings slider →] [See before/after →]               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Still unsure?  [Ask the AI Assistant]  [Contact Support]        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**FAQ Content Rules (Tone + Utility):**
- **First sentence** answers the question directly
- **Second sentence** adds context (who it affects / what to do)
- **Always include** 1–2 deep links to relevant sections/resources
- **Avoid jargon**; define terms in-line when unavoidable

**Interaction Design:**
- Accordion opens with smooth height animation (0.25–0.35s)
- “Copy link” on each question for sharing
- “Was this helpful?” micro-feedback (Yes/No) to improve ordering
- Keyboard navigable (tab + enter/space), ARIA-compliant

**Mobile Optimization:**
- Search stays sticky at top of FAQ list
- Popular topics become a scrollable chip row
- Accordion hit targets ≥ 44px

---

## 🔔 SECTION 8: STAY UPDATED - NEVER MISS A CHANGE

### Design Concept: **"Confidence Loop: Subscribe + Alerts + Milestones"**

**Why it matters:** The reforms are fixed in effective date, but **guidance, forms, and implementation details** will evolve. This section turns curiosity into an ongoing relationship.

**Layout (High-trust signup card + preference controls):**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                         STAY AHEAD OF 2026                        │
│                         ════════════════                         │
│                                                                  │
│  Get plain-language updates, deadlines, and new tools as they’re │
│  published. No spam. Unsubscribe anytime.                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Email: [you@example.com_____________________]  [Subscribe]  │  │
│  │                                                            │  │
│  │ Updates you want:                                           │  │
│  │ [✓] Key dates & deadlines   [✓] New resources & templates    │  │
│  │ [ ] Business guidance       [ ] Policy analysis (deep)       │  │
│  │                                                            │  │
│  │ Your profile (optional):                                    │  │
│  │ ( ) Individual  ( ) Business  ( ) Large enterprise  ( ) Student│ │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  NEXT MILESTONE                                                   │
│  ─────────────                                                   │
│  ⏰ January 1, 2026 — reforms take effect                         │
│  [Add reminder to calendar →]   [Download readiness checklist →]  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Trust Signals (Non-negotiable):**
- Show **privacy promise** under the form (one line)
- Link to privacy policy + data use statement
- Add “Official sources cited” badge where appropriate

**Conversion Boosters (Without being pushy):**
- Pre-filled suggested preference based on selected profile in Section 2
- “What you’ll receive” preview (3 sample subject lines)
- Calendar reminder CTA (ICS download)

**Success State (After Subscribe):**
- Confirmation message
- “Start here” links:
  - Impact calculator
  - Most relevant guide/template/checklist
  - Deep dive act most relevant to their profile

---

## ✅ QUALITY BAR (WORLD-CLASS REQUIREMENTS)

**Performance:**
- LCP under 2.5s on mobile (optimize images, defer heavy visuals)
- Timelines/accordions use lightweight animations (CSS transforms)
- Prefer static content + progressive enhancement for interactive modules

**Accessibility:**
- Color contrast AA+ (green accents must meet contrast on white/dark)
- Full keyboard navigation for quiz, timeline, accordion, filters
- Screen-reader labels for all controls (countdown, slider, tabs)

**Content Governance:**
- Every “fact” element maps to a source in deep dives/resources
- Visible “Last updated” date for resources and FAQ
- Clear boundary between **official text** and **plain-language explanation**