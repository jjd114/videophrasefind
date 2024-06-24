/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "project-one-thumbnail.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "deuqpmn4rs7j5.cloudfront.net",
      },
    ],
  },
};

module.exports = nextConfig;
