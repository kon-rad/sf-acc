const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true, // Treat all packages as ESM externals
    // OR specify specific packages as ESM externals
    // esmExternals: ['package-name', /regex-pattern/],
  },
  images: {
    domains: ['i.ytimg.com'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // this is supposed to fix the slow dev mode server
  // modularizeImports: {
  //   "react-icons/?(((\\w*)?/?)*)": {
  //     transform: "react-icons/{{ matches.[1] }}/{{member}}",
  //   },
  // },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async headers() {
    if (process.env.NEXT_PUBLIC_ENV === "prod") {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    } else {
      return [];
    }
  },
};

const ContentSecurityPolicy = `
  default-src 'self' https://fonts.googleapis.com ${process.env.NEXT_PUBLIC_SUPABASE_URL} https://api.june.so https://www.synducer.com/; 
  connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL} ${process.env.NEXT_PUBLIC_BACKEND_URL} https://api.june.so https://api.openai.com https://cdn.growthbook.io;
  img-src 'self' data:;
  media-src 'self' https://user-images.githubusercontent.com;
  script-src 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com/  https://www.synducer.com/;
  frame-ancestors 'none';
  style-src 'unsafe-inline' https://www.synducer.com/;
`;

// Define headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
];
//AJouter le content security policy uniquement en pre-vew et en prod

// Check if the SENTRY_DSN environment variable is defined
if (process.env.SENTRY_DSN) {
  // SENTRY_DSN exists, include Sentry configuration
  const { withSentryConfig } = require("@sentry/nextjs");

  module.exports = withSentryConfig(
    nextConfig,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: "synducer-0f",
      project: "javascript-nextjs",
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    }
  );
} else {
  // SENTRY_DSN does not exist, export nextConfig without Sentry
  module.exports = nextConfig;
}
