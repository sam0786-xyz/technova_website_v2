# Technova Website V2

This is the repository for the **Technova 2025/2026** college website. It serves as the central hub for event information, student leadership, user registration, and administrative management.

## 🚀 Features

### 🌐 Public Interface
- **Landing Page**: Modern, responsive design showcasing the event.
- **Leadership**: Introduces the core team and executive members.
- **Events**: Browsable list of upcoming events.

### 🔐 Authentication & Onboarding
- **Secure Login**: Powered by **NextAuth.js** and **Supabase**.
- **Onboarding Flow**: Collects essential user details (name, college, phone) after initial sign-up.

### 📊 User Dashboard
- **Personal Stats**: Users can track their participation and achievements.
- **Leaderboard**: Real-time ranking of students based on points/participation.
- **Profile Management**: Easy update of personal information.

### 🛠️ Admin Dashboard
- **Event Management**: Create, update, and manage events.
- **User Oversight**: View and manage registered users.
- **Analytics**: Insights into registration numbers and engagement.

### 📱 Scanner App
- **QR Code Scanning**: Mobile-friendly interface for verifying event attendance.
- **Real-time Validation**: Instantly marks attendance in the database.

### ✨ New Event Features
- **Custom Registration Questions**: Admins can now add custom fields (Text, Number, Checkbox, Select) to event forms.
- **Virtual Event Support**: Toggle events as virtual/hybrid and provide meeting links.
- **Banner Management**: Upload banners directly and adjust their focus point (Center, Top, Custom Coordinates).
- **Real-time Capacity**: Registration cards show live capacity bars and disable automatically when full.
- **User Cancellation**: Admins can cancel registrations directly from the dashboard.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) / [Auth.js](https://authjs.dev/)

## 📂 Project Structure

The project follows the standard Next.js App Router structure:

```
app/
├── (admin)/       # Administrative routes and layouts
├── (auth)/        # Authentication and onboarding pages
├── (dashboard)/   # User dashboard and leaderboard
├── (public)/      # Public-facing pages (Home, Leadership, etc.)
├── (scanner)/     # QR Code scanner interface
├── api/           # API routes (Auth, Events, User handling)
└── globals.css    # Global styles
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sam0786-xyz/technova_website_v2.git
    cd technova_website_v2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory. You will need credentials from your Supabase project and Google Cloud Console (for OAuth).

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # NextAuth
    AUTH_SECRET=your_generated_secret
    AUTH_GOOGLE_ID=your_google_client_id
    AUTH_GOOGLE_SECRET=your_google_client_secret
    
    # App-Specific
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed setup instructions.

**Quick Start for Contributors:**
1. Fork the repository
2. Create your own [Supabase](https://supabase.com) project (free tier works!)
3. Copy `.env.example` to `.env` and add your credentials
4. Run the database migrations
5. Start developing!

> **Note**: You don't need access to our production database. The CONTRIBUTING.md guide walks you through setting up your own local development environment.
