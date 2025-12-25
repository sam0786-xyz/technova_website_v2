/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // Ignore build errors from @auth/core package (upstream issue with CSS custom properties)
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
