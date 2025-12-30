<p align="center">
  <img src="public/assets/logo/technova.png" alt="Technova Logo" width="120" height="120">
</p>

<h1 align="center">Technova</h1>

<p align="center">
  <strong>Empowering the Next Generation of Technologists</strong>
</p>

<p align="center">
  <em>Technova Website V2 — The official repository for the Technova 2025/2026 college website.<br>
  Serving as the central hub for event information, student leadership, user registration, and administrative management.</em>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## About

**Technova** is the official technical society of the **Sharda School of Computing Science and Engineering (SSCSE)**, Technova brings together students who aspire to explore technology beyond textbooks and classrooms.

Driven by curiosity and powered by collaboration, the society creates opportunities through technical events, workshops, competitions, and collaborative projects enabling students to experiment, innovate, and grow in a dynamic environment. Technova promotes not only technical proficiency but also creativity, leadership, and problem-solving skills essential for the ever-evolving technological world.

**Technova represents a community of forward-thinkers committed to continuous learning and meaningful impact, preparing students to become confident professionals and responsible innovators of the future.**

### Platform Capabilities

This digital platform serves as the central hub for:
- **Event Discovery & Registration** — Stay informed about workshops, hackathons, and tech talks
- **Community Engagement** — Connect with peers, track achievements, and climb the leaderboard  
- **Leadership Showcase** — Meet the driving force behind our initiatives
- **Seamless Administration** — Powerful tools for organizers and volunteers

---

## Features

### 🌐 Public Portal
| Feature | Description |
|---------|-------------|
| **Landing Page** | Modern, responsive design with dynamic animations showcasing upcoming events and community highlights |
| **Events Directory** | Comprehensive listing of workshops, hackathons, and technical sessions with filtering capabilities |
| **Leadership Team** | Dedicated section introducing core team members, executives, and domain leads |
| **Past Events Timeline** | Archive of previously conducted events with highlights and outcomes |

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| **Secure OAuth** | Google Sign-In powered by NextAuth.js with Supabase integration |
| **Smart Onboarding** | Streamlined flow collecting essential details (name, college, phone) post-registration |
| **Role-Based Access** | Granular permission system for students, volunteers, and administrators |

### 📊 Member Dashboard
| Feature | Description |
|---------|-------------|
| **XP & Achievements** | Gamified experience tracking participation, contributions, and milestones |
| **Live Leaderboard** | Real-time rankings with weekly, monthly, and all-time filters |
| **Profile Management** | Personalized profiles with XP history charts and achievement badges |
| **Event Participation** | View registered events, download certificates, and track attendance history |

### 🛠️ Admin Control Center
| Feature | Description |
|---------|-------------|
| **Event Management** | Full CRUD operations with support for custom registration forms, virtual/hybrid modes, and capacity limits |
| **User Administration** | Comprehensive member directory with registration management and role assignment |
| **Feedback Analytics** | Dashboard displaying average ratings, response rates, and rating distributions |
| **Registration Insights** | Real-time analytics on registration numbers, attendance rates, and engagement metrics |

### 📱 Scanner Application
| Feature | Description |
|---------|-------------|
| **QR Code Verification** | Mobile-optimized interface for instant attendance marking |
| **Real-Time Sync** | Immediate database updates with offline queue support |
| **Multi-Event Support** | Seamlessly switch between concurrent events |

### ✨ Advanced Capabilities
| Feature | Description |
|---------|-------------|
| **Custom Form Builder** | Dynamic registration forms with Text, Number, Checkbox, and Select field types |
| **Virtual Event Support** | Native handling for online/hybrid events with meeting link distribution |
| **Banner Management** | Intelligent image uploads with customizable focus points |
| **Email Notifications** | Automated confirmations, reminders, and updates via Resend |
| **Payment Integration** | Razorpay support for paid workshop registrations |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) + [Radix Primitives](https://www.radix-ui.com/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL + Edge Functions) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) |
| **Email** | [React Email](https://react.email/) + [Resend](https://resend.com/) |
| **Payments** | [Razorpay](https://razorpay.com/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## Project Architecture

```
technova_website_v2/
├── app/
│   ├── (admin)/        # Administrative dashboards and management interfaces
│   ├── (auth)/         # Authentication flows and onboarding
│   ├── (dashboard)/    # Member dashboard, leaderboard, and profiles
│   ├── (public)/       # Public-facing pages (Home, Events, Leadership)
│   ├── (scanner)/      # QR code scanner for event attendance
│   ├── api/            # RESTful API routes
│   └── globals.css     # Global styles and Tailwind configuration
├── components/         # Reusable UI components organized by feature
├── lib/                # Utility functions, actions, and business logic
├── supabase/           # Database migrations and configuration
├── emails/             # React Email templates
├── public/             # Static assets and images
└── types/              # TypeScript type definitions
```

---

## Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm**, **yarn**, or **pnpm**
- **Supabase** account (free tier available)
- **Google Cloud Console** project (for OAuth)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sam0786-xyz/technova_website_v2.git
   cd technova_website_v2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the project root:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Authentication
   AUTH_SECRET=your_generated_auth_secret
   AUTH_GOOGLE_ID=your_google_oauth_client_id
   AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize Database**
   ```bash
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

Please read our **[Contributing Guide](CONTRIBUTING.md)** for detailed instructions on:
- Setting up your local development environment
- Database configuration with your own Supabase project
- Code style guidelines and best practices
- Pull request process and review criteria

### Quick Start for Contributors

1. Fork the repository
2. Create your own [Supabase](https://supabase.com) project
3. Copy `.env.example` to `.env` and configure credentials
4. Run database migrations
5. Create a feature branch and start developing

> **Note**: Contributors use their own isolated Supabase instances for development, ensuring production data remains secure.

---

## Community

- **GitHub Issues** — Report bugs or request features
- **Discussions** — Ask questions and share ideas
- **Pull Requests** — Contribute code and improvements

---

## Acknowledgments

Built with ❤️ by the Technova Development Team.

Special thanks to all contributors who help make this platform better for our community.

---

---

<p align="center">
  <sub>© 2025 Technova - SSCSE. All rights reserved.</sub>
</p>
