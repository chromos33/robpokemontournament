/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'my-blob-store.public.blob.vercel-storage.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'sod7jq9qjdt0eygr.public.blob.vercel-storage.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;
