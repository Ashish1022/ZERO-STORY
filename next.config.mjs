/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript:{
        ignoreBuildErrors:true
    },
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'lovely-flamingo-139.convex.cloud'
            },
            {
                protocol:'https',
                hostname:'img.clerk.com'
            },
            {
                protocol:'https',
                hostname:'energetic-hedgehog-505.convex.cloud'
            },
        ]
    },
    eslint:{
        ignoreDuringBuilds:true
    }
};

export default nextConfig;
