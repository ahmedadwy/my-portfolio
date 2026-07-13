/** @type {import('next').NextConfig} */
const nextConfig = {
  // يضمن تشغيل الأنيميشن والـ Turbopack بشكل مستقر مع Tailwind
  experimental: {
    turbo: {},
  },
};

export default nextConfig;