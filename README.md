# Technova Website V2

This is a [Next.js](https://nextjs.org) project for the Technova college website.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sam0786-xyz/technova_website_v2.git
    cd technova_website_v2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following environment variables. You will need to obtain these credentials from the project administrator or your Supabase/Google Cloud console.

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    AUTH_SECRET=your_auth_secret  # Generate one: openssl rand -base64 32
    AUTH_GOOGLE_ID=your_google_client_id
    AUTH_GOOGLE_SECRET=your_google_client_secret
    DATABASE_URL=your_database_url
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features
- **Next.js 14** (App Router)
- **Supabase** for Backend/Auth
- **Tailwind CSS** for Styling
- **Shadcn UI** for Components

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
