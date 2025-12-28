/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // Ignore build errors from @auth/core package (upstream issue with CSS custom properties)
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
