# Product Requirements Document

# Technova Freshers Onboarding Experience 2026

**Proposed Route:** `https://www.technovashardauniversity.in/freshers`  
**Working Product Name:** `FRESHER // 26`  
**Tagline:** *Your first six days. Your first people. Your first chapter.*  
**Status:** Product Definition  
**Target Launch:** Before School-Level Orientation 2026  
**Primary Audience:** Incoming first-year students / freshers  
**Secondary Audience:** Orientation team, faculty, School administration, Technova leadership, club teams

---

# 0. NON-NEGOTIABLE CONSTRAINT

## DO NOT CHANGE THE EXISTING TECHNOVA WEBSITE

This project **must not modify, redesign, restructure, restyle, or interfere with any existing page of the Technova website**.

The existing Technova website remains the source experience for Technova's existing ecosystem.

Current Technova already provides:

- Events
- Clubs
- Workshops
- Hackathons
- DevSpace
- Community
- Buddy Finder
- Showcase
- Resources
- Leadership information
- Technova calendar
- Student authentication

The existing site currently positions Technova as a student-led technical society focused on engineering, innovation, competitions, workshops, networking, open source and DevSpace.

### Therefore:

The fresher experience must be implemented as a **new isolated route / microsite**:

```text
technovashardauniversity.in
│
├── existing pages
│   ├── /
│   ├── /events
│   ├── /clubs
│   ├── /leadership
│   ├── /login
│   └── ...
│
└── /freshers          ← NEW EXPERIENCE
```

### The `/freshers` experience must:

- Reuse existing Technova data where appropriate.
- Link to existing Technova pages rather than duplicating functionality unnecessarily.
- Never alter existing navigation.
- Never alter existing homepage content.
- Never alter existing branding outside the new route.
- Never break existing authentication.
- Never change existing club pages.
- Never replace existing Technova content.
- Never introduce dependencies that can destabilize the current website.

If technically necessary, `/freshers` may be implemented as an isolated application mounted at the route while leaving the current application untouched.

---

# 1. EXECUTIVE SUMMARY

## 1.1 The Problem

Incoming students arrive at university with information overload.

They need to understand:

- Where they need to be.
- What is happening each day.
- Who they need to meet.
- How the university works.
- What opportunities exist.
- What clubs they can join.
- How to navigate campus.
- What technology they should learn.
- Who to ask when they are confused.
- How to begin building their university identity.

Traditional orientation solves only part of this problem.

A timetable or PDF tells students **what happens**.

It does not necessarily help them understand:

> **"What do I do next?"**

The School-level orientation is being conducted by students and the student team is expected to represent itself as **School students**, not as Technova.

Additionally, a dedicated Technova orientation session has been removed.

The product must therefore solve two problems simultaneously:

### Student problem

Create an exceptional, useful and memorable six-day onboarding experience.

### Technova problem

Introduce Technova organically as the ecosystem through which students can discover communities, projects, events, people and technical opportunities, without making the School orientation feel like a Technova promotional event.

---

# 2. PRODUCT VISION

## FRESHER // 26

> **A digital first-week experience for Sharda's newest students.**

The product should function as:

**Orientation Schedule**

+

**Freshers Toolkit**

+

**Campus Guide**

+

**Student Community Discovery**

+

**Club Matching**

+

**Freshers Quest**

+

**Digital Student Identity**

+

**Daily Feedback System**

+

**Faculty Insight Dashboard**

+

**Technova Discovery Gateway**

---

# 3. PRODUCT PHILOSOPHY

The experience should follow one fundamental principle:

> **Do not tell freshers that Technova is valuable. Let them experience the value around them and discover Technova naturally.**

Technova should not appear to be hijacking the official School orientation.

Instead:

### School

Owns the orientation.

### Students

Create and conduct the experience.

### Platform

Makes the experience useful and memorable.

### Technova

Provides the technology/community layer that connects students to what comes next.

---

# 4. STRATEGIC POSITIONING

The experience should be presented primarily as:

# **FRESHER // 26**

### *Your first six days. Your first people. Your first chapter.*

Supporting line:

> **School-led. Student-built.**

Technova appears as:

> **Built by students. Powered by Technova.**

This should be subtle, not dominant.

The first impression should be:

> "This is my orientation platform."

Not:

> "This is a Technova advertisement."

---

# 5. PRODUCT OBJECTIVES

## Primary Objectives

### O1. Make orientation genuinely useful

Every fresher should know:

- Where to go.
- What is happening.
- What happened today.
- What happens tomorrow.
- Where to find information.
- Who to ask for help.

### O2. Create a memorable first-week experience

The product should feel closer to a modern consumer app than a university portal.

### O3. Increase student participation

Drive:

- Orientation engagement.
- Feedback completion.
- Community discovery.
- Club discovery.
- Event discovery.
- Technova participation.

### O4. Create organic Technova visibility

Students should voluntarily share:

- Fresher profile cards.
- Daily achievements.
- Orientation milestones.
- Digital passport.
- Final completion credential.

### O5. Give faculty actionable feedback

Convert daily student feedback into:

- Quantitative metrics.
- Sentiment.
- Issues.
- Suggestions.
- Priority action items.

### O6. Establish Technova as a builder

The product itself should demonstrate:

> **"Students can build serious technology for the student community."**

---

# 6. SUCCESS DEFINITION

The project is successful if:

1. Freshers actively return to the platform every day.
2. Freshers use the platform instead of repeatedly asking basic logistical questions.
3. Daily feedback response rates are high.
4. Faculty receive actionable daily reports.
5. Students voluntarily share their onboarding experience.
6. Students discover clubs based on genuine interests.
7. Students join relevant communities.
8. Students discover Technova without needing a traditional promotional session.
9. Faculty consider the system useful enough to repeat the following year.
10. Technova is perceived as an ecosystem and builder, not merely another student club.

---

# 7. TARGET USERS

## 7.1 Primary User: Fresher

Typical characteristics:

- 17–20 years old.
- Coming directly from school.
- May be unfamiliar with university systems.
- May not know campus geography.
- May not know anyone.
- May not understand university terminology.
- Uses mobile-first interfaces.
- Highly visual.
- Low patience for long documentation.
- Comfortable with social media.
- Curious about communities and opportunities.
- Wants to establish an identity in college.

### Emotional state

The platform should account for:

> Excited → Overwhelmed → Curious → Social → Exploratory → Motivated

---

## 7.2 Secondary User: Faculty / Orientation Team

Needs:

- Attendance/engagement visibility where appropriate.
- Student feedback.
- Problems and complaints.
- Session ratings.
- Trends.
- Action items.
- Day-to-day operational insight.

---

## 7.3 Tertiary User: Technova / Club Teams

Needs:

- Community discovery.
- Club interest signals.
- Freshers onboarding.
- Event discovery.
- Membership conversion.
- Community engagement.

---

# 8. EXPERIENCE ARCHITECTURE

The product should be structured around a six-day narrative rather than conventional website navigation.

```text
                    FRESHER // 26
                          │
                          ▼
                    GET READY
                          │
                          ▼
                    DAY 01
                    WELCOME
                          │
                          ▼
                    DAY 02
                    EXPLORE
                          │
                          ▼
                    DAY 03
                    CONNECT
                          │
                          ▼
                    DAY 04
                    DISCOVER
                          │
                          ▼
                    DAY 05
                   UNIVERSITY
                          │
                          ▼
                    DAY 06
                     LAUNCH
                          │
                          ▼
              CONTINUE YOUR JOURNEY
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
         Student Life             Technova
              │                       │
              ▼                       ▼
          Communities              Clubs
          Opportunities            Events
          People                   DevSpace
          Activities               Projects
                                  Hackathons
```

---

# 9. INFORMATION ARCHITECTURE

## Main Experience

### `/freshers`

Landing / onboarding.

### `/freshers/start`

Personalized fresher setup.

### `/freshers/orientation`

Complete 6-day orientation timeline.

### `/freshers/day/[day]`

Individual daily experience.

### `/freshers/passport`

Digital Fresher Passport.

### `/freshers/quest`

Freshers Quest and achievements.

### `/freshers/toolkit`

Freshers Kit.

### `/freshers/campus`

Interactive campus guide.

### `/freshers/find-your-thing`

Interest discovery.

### `/freshers/clubs`

Club discovery and matching.

### `/freshers/community`

People/community discovery.

### `/freshers/technova`

Technova discovery layer.

### `/freshers/feedback`

Daily feedback.

### `/freshers/credential`

Final credential.

### `/freshers/help`

"I'M LOST" help center.

### `/freshers/admin`

Restricted faculty/orientation dashboard.

---

# 10. HOMEPAGE EXPERIENCE

The homepage must not look like a university portal.

It should feel like the opening screen of a modern digital product.

## Hero

### **WELCOME TO YOUR NEXT ERA.**

> Your first six days at Sharda, figured out.

Primary CTA:

**START MY JOURNEY →**

Secondary CTA:

**I ALREADY HAVE AN ACCOUNT**

---

## Visual Direction

The hero should use:

- Large editorial typography.
- Strong negative space.
- Smooth motion.
- Dynamic background.
- Subtle campus/technical visual language.
- Minimal but intentional gradients.
- Micro-interactions.
- Cursor/hover responses on desktop.
- Touch-first interactions on mobile.

Avoid:

- Generic stock photos.
- Corporate university templates.
- Excessive cards.
- Excessive rounded rectangles.
- Random gradients everywhere.
- Overuse of emojis.
- Fake "Gen Z" slang.
- Excessive gamification.

---

# 11. FIRST-TIME ONBOARDING

On first visit:

## Screen 01

> **FIRST THINGS FIRST.**

> Let's make this yours.

Collect:

- Name.
- School.
- Programme.
- Batch.
- Interests.

Optional:

- Profile picture.
- Preferred name.
- Skills.

---

## Screen 02

### **WHAT ARE YOU INTO?**

Multi-select:

- AI
- Machine Learning
- Coding
- Cloud
- Cybersecurity
- Data
- Robotics
- Gaming
- Photography
- Design
- Entrepreneurship
- Open Source
- Content
- Research
- Startups

Do not force users to select a career.

Copy:

> **You don't need to know what you want to become yet.**

---

## Screen 03

### **YOUR JOURNEY IS READY.**

Show:

- Orientation progress.
- Passport.
- Quest.
- Recommended communities.

CTA:

**ENTER ORIENTATION →**

---

# 12. ORIENTATION HUB

The orientation hub is the central operational screen.

## Header

```text
YOUR ORIENTATION

DAY 01 / 06
████░░░░░░░░
```

Then:

### TODAY

Timeline.

Example:

```text
09:00
WELCOME SESSION

10:30
FACULTY INTERACTION

12:00
CAMPUS EXPERIENCE

14:00
STUDENT ACTIVITIES

16:00
WRAP-UP
```

Each item is interactive.

---

# 13. SESSION CARDS

Each session card should include:

- Time.
- Location.
- Session title.
- Description.
- Host.
- Duration.
- Status.

Actions:

**ADD TO CALENDAR**

**GET DIRECTIONS**

**SESSION DETAILS**

---

## Dynamic session states

### Upcoming

> Starts in 24 min

### Live

> ● LIVE NOW

### Completed

> ✓ COMPLETED

### Delayed

> Schedule updated

### Cancelled

> This session has been cancelled.

Never silently modify an official schedule.

Every schedule change should include:

> **Updated at 10:42 AM**

---

# 14. DAILY EXPERIENCE

Each day gets a unique identity.

## DAY 01

# 👋 WELCOME

Goal:

> Remove uncertainty.

Features:

- Schedule.
- Reporting locations.
- Welcome information.
- Faculty introductions.
- First quest.
- First feedback.

---

## DAY 02

# 🧭 EXPLORE

Goal:

> Help students understand their physical environment.

Features:

- Interactive campus map.
- Location discovery.
- Campus Quest.
- Important facilities.
- Navigation.

---

## DAY 03

# 🤝 CONNECT

Goal:

> Help students meet people.

Features:

- Buddy discovery.
- Interest matching.
- Conversation prompts.
- Community discovery.
- Team finder.

---

## DAY 04

# ⚡ DISCOVER

Goal:

> Introduce student communities and opportunities.

This is the strongest Technova discovery day.

Features:

- Interest quiz.
- Club matching.
- Technova ecosystem.
- Events.
- Workshops.
- Hackathons.
- Projects.

---

## DAY 05

# 🌎 UNIVERSITY

Goal:

> Understand the larger university ecosystem.

Features:

- Academic systems.
- Student services.
- Support.
- Library.
- Hostel.
- Transport.
- Career resources.
- University opportunities.

---

## DAY 06

# 🚀 LAUNCH

Goal:

> Convert orientation into momentum.

Features:

- Passport completion.
- Quest completion.
- Final reflection.
- Credential.
- LinkedIn share.
- Instagram share.
- Technova discovery.
- Next-step recommendations.

---

# 15. FRESHER PASSPORT

The passport is the student's persistent identity throughout the experience.

## Passport includes

### Identity

- Name.
- School.
- Programme.
- Batch.
- Fresher ID.

### Progress

- Days completed.
- Missions completed.
- Communities discovered.
- Activities completed.

### Achievements

Examples:

**CAMPUS EXPLORER**

Completed campus discovery.

**FIRST CONNECTION**

Completed first community interaction.

**TECH EXPLORER**

Explored technical communities.

**COMMUNITY DISCOVERER**

Found a club matching their interests.

**ORIENTATION COMPLETE**

Completed the six-day journey.

---

# 16. FRESHERS QUEST

The quest should make students explore the actual university rather than merely click buttons.

## Example missions

### Mission 01
**Find your School building.**

### Mission 02
**Find the library.**

### Mission 03
**Meet someone new.**

### Mission 04
**Discover one student community.**

### Mission 05
**Attend one activity.**

### Mission 06
**Complete today's feedback.**

### Mission 07
**Create your LinkedIn profile.**

### Mission 08
**Discover your first project opportunity.**

### Mission 09
**Explore Technova.**

---

# 17. GAMIFICATION PRINCIPLES

Gamification must be purposeful.

Avoid:

- Public rankings.
- Competitive pressure.
- Fake currencies with no value.
- Excessive badges.
- Childish reward systems.

Use:

- Progress.
- Discovery.
- Unlockable content.
- Milestones.
- Personal achievements.
- Cohort-level statistics.

Example:

> **Freshers have collectively completed 4,821 missions.**

This creates community without creating unhealthy competition.

---

# 18. SOCIAL SHARING ENGINE

This is a major product feature.

Do not ask students:

> "Please promote Technova."

Instead, generate content that is genuinely worth sharing.

---

## Instagram Story: Day 1

### **I'M OFFICIALLY A FRESHER.**

Name  
Programme  
School  
Day 01 Complete

Subtle:

**FRESHER // 26**

**Powered by Technova**

---

## Instagram Story: Day 3

### **I FOUND MY PEOPLE.**

Display:

- Interests.
- Community discovery.
- Achievement.

---

## Instagram Story: Day 4

### **I FOUND MY THING.**

Display:

> AI / Robotics

or:

> Cybersecurity

or:

> Photography

etc.

---

## Instagram Story: Day 6

# **THIS IS JUST THE BEGINNING.**

Display:

- 6 days completed.
- Quest progress.
- Achievements.
- Personal interests.

CTA:

**SHARE MY JOURNEY**

---

# 19. SOCIAL SHARE DESIGN REQUIREMENTS

Generated assets should be:

- 9:16.
- High resolution.
- Visually premium.
- Brand-consistent.
- Screenshot-friendly.
- Minimal.
- Personalised.

Never generate generic templates that look like event posters.

The content should resemble something a student would naturally post.

---

# 20. LINKEDIN EXPERIENCE

LinkedIn should be positioned as professional identity, not social advertising.

At completion:

# **YOUR FIRST UNIVERSITY MILESTONE**

Generate a digital credential.

## Credential

**FRESHER ONBOARDING 2026**

Awarded to:

**[NAME]**

For successfully completing the six-day university onboarding experience covering:

- Academic Orientation.
- Campus Discovery.
- Student Communities.
- University Resources.
- Career Exploration.
- Student Engagement.

Include:

- School.
- Programme.
- Batch.
- Credential ID.
- Issue date.
- Verification URL/QR.

Supporting attribution:

> **School-led · Student-built · Powered by Technova**

---

# 21. CREDENTIAL VERIFICATION

Every credential should have:

```text
/freshers/verify/[credential-id]
```

Verification page:

> **VERIFIED CREDENTIAL**

Name  
Programme  
Batch  
Credential  
Issue Date

Status:

**✓ Verified**

This makes the certificate feel like an actual digital credential rather than a downloadable PDF.

---

# 22. TECHNOVA DISCOVERY

Technova should not dominate the initial orientation.

It should become visible when students reach the question:

# **WHAT DO YOU WANT TO DO OUTSIDE CLASS?**

Copy:

> Your degree is one part of university.
>
> The rest is what you build, explore, compete in, create and experience.

---

# 23. "FIND YOUR THING"

Interactive interest discovery.

Students select interests.

Example:

```text
WHAT SOUNDS LIKE YOU?

[ AI ]
[ CLOUD ]
[ CYBER ]
[ DATA ]
[ GAMING ]
[ OPEN SOURCE ]
[ PHOTOGRAPHY ]
[ STARTUPS ]
[ ROBOTICS ]
[ DEVELOPMENT ]
```

Then generate:

# **YOUR TOP MATCHES**

### AI & Robotics
96% match

### Datapool
88% match

### GitHub Club
81% match

### Techpreneur
76% match

The existing Technova ecosystem includes clubs such as AI & Robotics, AWS Cloud, CyberPirates, Datapool, Game Drifters, GDG on Campus, GitHub Club and PiXelance.

---

# 24. CLUB EXPERIENCE

Do not simply display:

> Club name + description + Join button.

Instead:

## Club card

**AI & ROBOTICS**

> Build intelligent systems. Explore ML. Experiment with robotics.

### You might enjoy this if:

- You like AI.
- You enjoy experimentation.
- You want to build projects.
- You want to explore robotics.

### What you can do:

- Workshops.
- Projects.
- Competitions.
- Peer learning.

CTA:

**EXPLORE CLUB →**

Secondary:

**JOIN COMMUNITY →**

Existing club pages should remain the canonical destination where appropriate. For example, the current Datapool page already provides its own description, activities, member information and join flow.

---

# 25. TECHNOVA ECOSYSTEM SCREEN

After club discovery:

# **WELCOME TO TECHNOVA**

> A student-led technical ecosystem where you can learn, build, compete, collaborate and lead.

Show the existing ecosystem as six pillars:

### ⚡ EVENTS

Hackathons, workshops and tech talks.

### 🧠 LEARN

Bootcamps, peer learning and technical sessions.

### 🛠 BUILD

Projects and real-world experimentation.

### 🤝 CONNECT

Students, seniors, alumni and industry.

### 🌐 DEVSPACE

Community, resources, showcase and collaboration.

### 🚀 LEAD

Club contribution, volunteering and leadership.

The current Technova website already presents hackathons, workshops, networking, Open Source/DevSpace, Buddy Finder, Showcase and Resources as core parts of its ecosystem.

---

# 26. BUDDY / PEOPLE DISCOVERY

Where technically and administratively appropriate, connect the experience to the existing Technova Buddy Finder rather than creating a competing system.

Students can discover:

- Study partners.
- Project teammates.
- Hackathon teammates.
- People with similar interests.

The existing Buddy Finder is explicitly designed around finding peers for hackathons, projects and study groups.

CTA:

**FIND MY PEOPLE →**

---

# 27. FRESHERS TOOLKIT

The toolkit should be extremely practical.

## COLLEGE 101

- CGPA explained.
- Credits explained.
- Attendance.
- Exams.
- Internal assessment.
- Academic calendar.
- University terminology.
- How to communicate with faculty.

## TECH 101

- Git.
- GitHub.
- Python.
- C++.
- SQL.
- Linux.
- VS Code.
- Markdown.
- Terminal.

## CAREER 101

- LinkedIn.
- GitHub.
- Resume.
- Projects.
- Internships.
- Portfolio.
- Networking.

## LIFE 101

- Making friends.
- Managing time.
- Managing money.
- Talking to seniors.
- Handling the first semester.
- Getting help.

Every resource should be bite-sized.

Target:

**30 seconds – 3 minutes per resource.**

---

# 28. CAMPUS MODE

Interactive campus guide.

Categories:

- Academic blocks.
- Library.
- Cafeteria.
- Auditorium.
- Labs.
- Medical facilities.
- Student activity areas.
- Hostel.
- Transport.
- Administrative offices.

Each location:

```text
LOCATION

[NAME]

WHAT IT IS
Short explanation.

YOU MAY NEED THIS FOR
Relevant use cases.

[GET DIRECTIONS]
```

---

# 29. "I'M LOST" BUTTON

Persistent floating action.

# 🆘 I'M LOST

When opened:

> **What do you need?**

### 📍 I don't know where to go.

### 📚 I need academic help.

### 🏢 I need administrative help.

### 🚌 I need transport information.

### 🏠 I need hostel information.

### 🤝 I need student/community help.

### 💻 I need technical-community help.

### 🙋 I don't know who to ask.

This should be one of the fastest paths through the product.

---

# 30. DAILY FEEDBACK SYSTEM

Feedback must be built into the journey.

Never make the primary CTA:

> "Fill Google Form."

Instead:

# **DAY 02 COMPLETE**

> Before you leave, tell us how today felt.

### Overall rating

★★★★★

### Today's pace

Too slow ← → Too fast

### How welcomed did you feel?

😕 😐 🙂 😍

### What did you enjoy?

Multi-select.

### What confused you?

Multi-select.

### What should we change tomorrow?

Free text.

### One thing we should definitely keep?

Free text.

CTA:

**SEND FEEDBACK →**

---

# 31. FEEDBACK PRINCIPLES

Feedback should be:

- Mobile-first.
- Anonymous by default where appropriate.
- Short.
- Contextual.
- Completed immediately after a relevant day/session.
- Limited to high-value questions.

Target completion time:

**≤ 2 minutes**

---

# 32. FACULTY / ORIENTATION DASHBOARD

A completely separate authenticated interface.

# **ORIENTATION CONTROL ROOM**

## Overview

```text
DAY 02

842 RESPONSES

4.42 / 5
OVERALL

91%
FELT WELCOMED

87%
UNDERSTOOD TOMORROW
```

---

# 33. LIVE FEEDBACK INSIGHTS

Dashboard sections:

### Overall Satisfaction

Trend over days.

### Session Ratings

Ranked by session.

### Sentiment

Positive / Neutral / Negative.

### Top Issues

Automatically grouped.

### Student Suggestions

Representative feedback.

### Action Items

High / Medium / Low priority.

---

# 34. ACTIONABLE DAILY REPORT

Example:

# DAY 02 ORIENTATION REPORT

### Overall

**4.42 / 5**

### What worked

1. Campus tour.
2. Faculty interaction.
3. Student activities.

### Problems

1. Navigation confusion.
2. Session transition delays.
3. Insufficient Q&A time.

### Student suggestion

> "We need more time to ask seniors questions."

### Recommended action

**Add a 10-minute student Q&A tomorrow.**

This report should be exportable as:

- PDF.
- CSV.
- Dashboard link.

---

# 35. FEEDBACK PRIVACY

The system must clearly separate:

### Anonymous feedback

Used for aggregate experience insights.

### Identified support requests

Only when a student explicitly requests help.

Never expose individual feedback unnecessarily.

---

# 36. ADMIN FEATURES

Admin users should be able to manage:

### Orientation

- Days.
- Sessions.
- Time.
- Location.
- Speaker.
- Description.
- Status.

### Content

- FAQs.
- Toolkit resources.
- Campus locations.
- Announcements.

### Clubs

- Club descriptions.
- Interest tags.
- CTA links.

### Feedback

- Questions.
- Response windows.
- Dashboard.

### Credentials

- Templates.
- Credential IDs.
- Verification.

---

# 37. CONTENT SOURCE HIERARCHY

The platform must distinguish between information types.

## Tier 1: Official

University/School-approved information.

Example:

- Official schedule.
- Official policies.
- Official administrative instructions.

## Tier 2: Orientation Team

Student-organizer guidance.

Example:

- Practical tips.
- Campus navigation advice.
- Student experience.

## Tier 3: Community

Technova / club information.

Example:

- Club descriptions.
- Events.
- Community opportunities.

Visual labels:

**OFFICIAL**

**STUDENT GUIDE**

**COMMUNITY**

This prevents students from confusing student advice with university policy.

---

# 38. AI ASSISTANT

Optional Phase 2 feature.

## Name

# **ASK FRESHER**

Students can ask:

> "Where is my orientation?"

> "What is CGPA?"

> "How do I find my classroom?"

> "What is Technova?"

> "Which club should I join?"

The assistant must answer from an approved knowledge base.

It must never invent university policies.

For official information:

> **Official information**

For student guidance:

> **Student guide**

For Technova:

> **Technova community information**

---

# 39. UX PRINCIPLES

## Principle 01: Mobile first

Most freshers will access this from their phones.

Design for:

**390 × 844**

before desktop.

---

## Principle 02: One primary action per screen

Avoid:

> 12 buttons competing for attention.

Every screen should answer:

> **What should I do next?**

---

## Principle 03: Progressive disclosure

Don't overwhelm users with everything on Day 1.

Reveal information when relevant.

---

## Principle 04: Motion with purpose

Use animation for:

- Transitions.
- Progress.
- Achievement unlocks.
- Feedback.
- Navigation.
- Context changes.

Never animate purely for decoration.

---

## Principle 05: Gen Z without trying to be Gen Z

Use:

- Direct copy.
- Humor sparingly.
- Personality.
- Strong typography.
- Interactive experiences.
- Visual storytelling.

Avoid forced slang.

Do not write things like:

> "Hey bestie 😭🔥 Let's absolutely slay your orientation."

The product should feel **cool**, not like an adult trying to imitate teenagers.

---

# 40. VISUAL DESIGN DIRECTION

## Overall aesthetic

**Editorial + Technical + Premium + Playful**

Reference mental models:

- Modern product onboarding.
- Premium developer tools.
- Interactive editorial websites.
- Modern portfolio sites.
- Gaming progression systems.
- High-end SaaS dashboards.

Not:

- University ERP.
- Government portal.
- Event registration form.
- Generic Bootstrap dashboard.

---

# 41. TYPOGRAPHY

Use a strong modern sans-serif.

Hierarchy:

```text
DISPLAY
Large, expressive

HEADLINE
Clear and confident

BODY
Highly readable

MICRO
Metadata and labels
```

Use typography as a primary visual element rather than relying on excessive graphics.

---

# 42. COLOR SYSTEM

The color system should complement existing Technova branding rather than replacing it.

Suggested structure:

### Base

Near-black / off-white.

### Accent

Existing Technova accent.

### Semantic

Success  
Warning  
Error  
Info

### Club colors

Optional controlled accent colors per club.

Do not create a rainbow UI.

---

# 43. INTERACTION DESIGN

Important interactions:

### Hover

Cards subtly respond.

### Press

Buttons provide tactile feedback.

### Scroll

Sections reveal progressively.

### Achievement

Use a short celebratory animation.

### Progress

Smoothly animate completion.

### Navigation

Use directional transitions to reinforce journey.

---

# 44. MICROCOPY

Examples:

Instead of:

> "Orientation Schedule"

Use:

> **WHERE YOU NEED TO BE**

Instead of:

> "Resources"

Use:

> **YOUR TOOLKIT**

Instead of:

> "Clubs"

Use:

> **FIND YOUR PEOPLE**

Instead of:

> "Feedback Form"

Use:

> **BE BRUTALLY HONEST**

Instead of:

> "Help"

Use:

> **I'M LOST**

Instead of:

> "Technova"

Use:

> **WHAT WILL YOU BUILD HERE?**

The UI should be understandable even when the user scans it quickly.

---

# 45. ACCESSIBILITY

Must support:

- Keyboard navigation.
- Screen readers.
- Proper contrast.
- Reduced motion.
- Accessible form controls.
- Large tap targets.
- Semantic HTML.
- Visible focus states.
- Alternative text.

Never make animation necessary to understand information.

---

# 46. PERFORMANCE

Target:

- Fast initial load.
- Mobile 4G usability.
- Minimal JavaScript blocking.
- Optimized images.
- Lazy-loaded media.
- Responsive layouts.
- Graceful degradation.

Targets:

### LCP

< 2.5s

### INP

< 200ms

### CLS

< 0.1

The site should feel instant on average student mobile hardware.

---

# 47. TECHNICAL ARCHITECTURE

The exact implementation can be selected by the engineering team, but the architecture should support:

- Existing Technova website isolation.
- Responsive frontend.
- Authentication where necessary.
- CMS/admin content management.
- Database for profiles/progress/feedback.
- Analytics.
- Credential generation.
- Social image generation.
- Secure admin dashboard.
- API integration with existing Technova services where available.

---

# 48. DATA MODEL

Core entities:

```text
Student
├── student_id
├── name
├── school
├── programme
├── batch
├── interests[]
└── profile

OrientationDay
├── day
├── title
├── description
└── sessions[]

Session
├── title
├── start_time
├── end_time
├── location
├── host
└── status

Quest
├── mission_id
├── title
├── description
├── reward
└── completion_rule

Achievement
├── achievement_id
├── title
├── description
└── icon

Club
├── club_id
├── name
├── description
├── interests[]
└── external_url

Feedback
├── day
├── session
├── rating
├── sentiment
├── answers
└── created_at

Credential
├── credential_id
├── student_id
├── issued_at
└── verification_status
```

---

# 49. ANALYTICS

Track events such as:

```text
freshers_page_view
onboarding_started
onboarding_completed
orientation_day_opened
session_viewed
calendar_clicked
navigation_clicked
quest_started
quest_completed
achievement_unlocked
passport_viewed
share_card_generated
instagram_share_clicked
linkedin_credential_generated
credential_downloaded
credential_verified
interest_selected
club_viewed
club_join_clicked
technova_viewed
technova_cta_clicked
feedback_started
feedback_completed
help_opened
```

---

# 50. NORTH STAR METRIC

## **Meaningful Freshers Activation Rate**

Percentage of students who complete:

```text
Visit
 ↓
Onboard
 ↓
Complete at least one orientation action
 ↓
Complete feedback
 ↓
Discover a community
 ↓
Take one meaningful next step
```

A "meaningful next step" may be:

- Joining a club.
- Joining a community.
- Attending an event.
- Creating a buddy profile.
- Starting a project.
- Exploring DevSpace.

---

# 51. SECONDARY KPIs

## Orientation

- Daily active freshers.
- Orientation completion.
- Session information views.
- Calendar interactions.

## Engagement

- Quest completion.
- Passport completion.
- Toolkit usage.
- Campus map usage.

## Feedback

- Response rate.
- Average rating.
- Issue resolution rate.
- Daily sentiment.

## Social

- Story generations.
- Story shares.
- LinkedIn credential generations.
- Credential downloads.

## Technova

- Technova discovery rate.
- Club profile views.
- Club join clicks.
- Community signups.
- Event registrations.

---

# 52. ANTI-GAMING / ANTI-SPAM

The system must not reward students simply for repeatedly clicking.

Quest completion must require meaningful actions.

Examples:

- Completing a feedback form.
- Visiting a verified campus location.
- Attending a session.
- Exploring a club.
- Completing a profile.

Do not make:

> "Click this button 10 times"

a mission.

---

# 53. SECURITY

Required:

- Secure admin authentication.
- Role-based access.
- Input validation.
- Rate limiting.
- Secure credential generation.
- Protected student information.
- No exposure of private student data.
- Audit logs for admin changes.

---

# 54. PRIVACY

Collect only what is necessary.

Students should understand:

- What data is collected.
- Why it is collected.
- What is public.
- What is private.
- How feedback is used.

Do not publicly expose:

- Student email.
- Phone number.
- Sensitive personal information.
- Anonymous feedback identity.

---

# 55. SOCIAL SHARING SAFETY

Before sharing a generated card, show:

> **This will include your name, programme and selected interests.**

Allow:

**EDIT**

**SHARE**

**CANCEL**

Never automatically post to social media.

---

# 56. ADMIN ROLES

### Super Admin

Full control.

### Orientation Admin

Schedule + feedback.

### Faculty Viewer

Analytics + reports.

### Technova Admin

Technova/community content.

### Club Admin

Own club information.

Each role should have minimum required permissions.

---

# 57. PHASED DELIVERY

## Phase 1: Core MVP

Must launch before orientation.

### Required

- Landing page.
- Onboarding.
- Six-day schedule.
- Daily pages.
- Session information.
- Freshers Passport.
- Basic Quest.
- Toolkit.
- Club discovery.
- Feedback.
- Faculty dashboard.
- Social share cards.
- Final credential.

---

# 58. PHASE 2

After core launch:

- Advanced club matching.
- Campus map.
- Buddy integration.
- Event recommendations.
- LinkedIn credential integration.
- Advanced analytics.
- Automated daily reports.
- AI assistant.

---

# 59. PHASE 3

Long-term:

## Student OS

The `/freshers` product evolves into a permanent student experience layer.

Potential modules:

- Student opportunities.
- Project matching.
- Hackathon teams.
- Club discovery.
- Events.
- Student showcase.
- Mentorship.
- Resources.
- Career pathways.

The orientation experience becomes the student's first entry point.

---

# 60. LAUNCH STRATEGY

## Before orientation

Send:

> **Your orientation has a new home.**

Link:

`technovashardauniversity.in/freshers`

Students complete:

- Profile.
- Interests.
- Pre-arrival checklist.

---

## Day 1

QR code shown during orientation.

> **SCAN TO ENTER YOUR ORIENTATION**

No long URL.

---

## Every day

End the official orientation day with:

> **Before you leave:**
>
> Check tomorrow's schedule.
>
> Complete today's feedback.
>
> Claim today's achievement.

---

## Day 4

Introduce:

> **You've learned about your university.**
>
> Now discover the people building things inside it.

Then introduce Technova.

---

## Day 6

Final:

> **You arrived as a fresher.**
>
> **You leave knowing where you belong.**

Generate:

- Passport.
- Credential.
- Instagram story.
- LinkedIn credential.

---

# 61. THE TECHNOVA CONVERSION FUNNEL

The experience should naturally become:

```text
                  FRESHER
                     │
                     ▼
              ORIENTATION
                     │
                     ▼
              FRESHER PASSPORT
                     │
                     ▼
               FRESHER QUEST
                     │
                     ▼
               FIND YOUR THING
                     │
                     ▼
               FIND YOUR PEOPLE
                     │
                     ▼
                TECHNOVA
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
     CLUBS         EVENTS       DEVSPACE
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                   BUILD
                     │
                     ▼
                CONTRIBUTE
                     │
                     ▼
                   LEAD
```

---

# 62. WHAT MAKES THIS DIFFERENT

The product must not be:

> A prettier orientation PDF.

It must be:

### 01. A journey

Students return every day.

### 02. A personal identity

Every fresher has a Passport.

### 03. A game layer

Students complete meaningful missions.

### 04. A social layer

Students create content worth sharing.

### 05. A discovery engine

Students discover communities based on who they are.

### 06. A feedback engine

Faculty see what students actually think.

### 07. A bridge into Technova

Technova becomes the natural next step.

---

# 63. THE "WOW" MOMENTS

The product should deliberately engineer memorable moments.

## WOW #1

First visit:

> **WELCOME TO YOUR NEXT ERA.**

## WOW #2

Personal profile generated instantly.

## WOW #3

First achievement unlock.

## WOW #4

Campus Quest.

## WOW #5

"Find Your Thing" matching.

## WOW #6

Technova discovery.

## WOW #7

Instagram story generated.

## WOW #8

Final Passport.

## WOW #9

Verified digital credential.

The experience should feel progressively richer.

---

# 64. DESIGN ANTI-PATTERNS

Do not build:

- A giant dashboard.
- A PDF repository.
- A Google Forms wrapper.
- A generic college portal.
- A Technova advertisement.
- A club directory with 20 cards.
- A leaderboard that publicly ranks students.
- Excessive neon gradients.
- Excessive emojis.
- Fake Gen-Z slang.
- Overly complex onboarding.
- Long paragraphs.
- Autoplay audio.
- Unnecessary popups.

---

# 65. CONTENT PRINCIPLES

Every piece of content should answer at least one:

> **What is this?**

> **Why do I care?**

> **What do I do next?**

If it does none of these, remove it.

---

# 66. DESIGN PRINCIPLE: "ONE SCREEN, ONE QUESTION"

Each major screen should answer a single question.

### Home

> What is this?

### Orientation

> Where do I need to be?

### Passport

> How am I doing?

### Quest

> What can I do next?

### Toolkit

> How do I figure this out?

### Campus

> Where is it?

### Clubs

> What am I interested in?

### Community

> Who are my people?

### Technova

> What can I build?

### Feedback

> How was today?

### Credential

> What did I accomplish?

---

# 67. FINAL EXPERIENCE

The final completion screen should feel like an ending to a story.

# **YOU MADE IT.**

### 6 DAYS.
### 1 NEW CHAPTER.

```text
ORIENTATION       ✓
CAMPUS            ✓
COMMUNITY         ✓
DISCOVERY         ✓
UNIVERSITY        ✓
LAUNCH            ✓
```

Then:

> You came here looking for a classroom.
>
> You leave knowing there's a whole world beyond it.

Actions:

**VIEW MY PASSPORT**

**GET MY CREDENTIAL**

**SHARE MY JOURNEY**

**FIND MY COMMUNITY**

**EXPLORE TECHNOVA**

---

# 68. THE FINAL TECHNOVA MESSAGE

The final Technova CTA should never say:

> "Join Technova because we're the best."

Instead:

# **YOUR UNIVERSITY JUST STARTED.**

> Don't spend the next four years only attending classes.
>
> Build something.
>
> Meet people.
>
> Compete.
>
> Experiment.
>
> Fail.
>
> Learn.
>
> Lead.

### **WHAT WILL YOU BUILD HERE?**

**EXPLORE TECHNOVA →**

---

# 69. THE PRODUCT'S CORE MESSAGE

The entire experience should communicate:

> **You don't need to have your future figured out on Day 1.**
>
> **You just need somewhere to start.**

And Technova should be positioned as one of those places to start.

---

# 70. FINAL PRODUCT STATEMENT

## FRESHER // 26

### *Your first six days. Your first people. Your first chapter.*

A student-built digital onboarding experience that transforms university orientation from a schedule of sessions into an interactive journey.

It helps students:

**Know where to go.**

**Understand how university works.**

**Explore their campus.**

**Meet their people.**

**Discover their interests.**

**Find communities.**

**Build their digital identity.**

**Give feedback that actually matters.**

**And find somewhere to start building.**

### School-led.

### Student-built.

### Powered by Technova.

---

# 71. PRODUCT NORTH STAR

At the end of the six days, a fresher should be able to say:

> **"I know where I am."**
>
> **"I know who I can ask."**
>
> **"I know what I am interested in."**
>
> **"I know where I belong."**
>
> **"And I know what I want to try next."**

If the platform achieves that, the orientation has succeeded.

And if students then voluntarily share their experience and discover Technova through it, **Technova has demonstrated its value without needing to take over the School orientation.**

---

# 72. IMPLEMENTATION GUARDRAIL

## ABSOLUTE RULE

### DO NOT MODIFY THE EXISTING TECHNOVA WEBSITE.

The current Technova website remains untouched.

The new experience is an additive layer:

```text
EXISTING TECHNOVA
       │
       │  unchanged
       │
       ▼
/freshers
       │
       ▼
FRESHER // 26
       │
       ├── Orientation
       ├── Passport
       ├── Quest
       ├── Toolkit
       ├── Campus
       ├── Feedback
       ├── Club Discovery
       ├── Social Sharing
       └── Technova Discovery
                    │
                    ▼
             EXISTING TECHNOVA
              EVENTS / CLUBS /
              DEVSPACE / BUDDY
```

The new product should **lead into the existing Technova ecosystem, not replace or redesign it.**

---

# 73. MVP DEFINITION OF DONE

The MVP is ready for launch when a fresher can:

- [ ] Open `/freshers` on mobile.
- [ ] Understand what the platform is within 5 seconds.
- [ ] Complete onboarding.
- [ ] See their personalized orientation.
- [ ] Navigate all six days.
- [ ] Open session details.
- [ ] Find relevant resources.
- [ ] Complete daily missions.
- [ ] Track progress through their Passport.
- [ ] Submit daily feedback.
- [ ] Discover clubs based on interests.
- [ ] Discover Technova.
- [ ] Generate an Instagram story.
- [ ] Generate a LinkedIn-ready credential.
- [ ] Complete the final journey.
- [ ] Verify their credential.

Faculty must be able to:

- [ ] View feedback.
- [ ] View daily ratings.
- [ ] Identify common issues.
- [ ] See trends.
- [ ] Export/share a daily report.

Technova admins must be able to:

- [ ] Manage community information.
- [ ] Track discovery.
- [ ] Link students to existing club/event experiences.

---

# 74. FINAL DESIGN TEST

Before launch, put the product in front of five freshers who have never seen it.

Ask them only:

### "You have 30 seconds. What do you think this website is?"

If they say:

> **"It's my orientation."**

Good.

Then ask:

### "What can you do here?"

If they naturally mention:

> Schedule, campus, resources, clubs, people, feedback, activities.

Good.

Then ask:

### "What is Technova?"

If they can explain:

> **"It's the technical student ecosystem where I can find clubs, events, people and things to build."**

without someone explaining it to them:

# The product has done its job.

---

## END OF PRD