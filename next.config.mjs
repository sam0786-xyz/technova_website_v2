/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // Ignore build errors from @auth/core package (upstream issue with CSS custom properties)
        ignoreBuildErrors: true,
    },
    eslint: {
        // Only warn on production build (don't fail)
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
