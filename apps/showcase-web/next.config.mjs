/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is crucial for Monorepos! It tells Next.js to compile our local package.
  transpilePackages: ["@craft/ui-system"],
};

export default nextConfig;
