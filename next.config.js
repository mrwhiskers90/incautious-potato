/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["node-ical", "rrule-temporal"],
};

module.exports = nextConfig;
