module.exports = {
  reactStrictMode: true,
  /*basePath: "/en",*/
  env: {},
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["default", "en"],
    defaultLocale: "default",
    localeDetection: false,
  },
  images: {
    // Allow images from external domains
    domains: ["images.ctfassets.net", "api.producthunt.com"],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source:
            "/en/:path*.:ext(png|svg|pdf|ico|css|zip|txt|webmanifest|xml|ttf|jpg|jpeg|js|otf|woff|woff2|json)",
          destination: "/:path*.:ext",
          locale: false,
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/technical-and-organizational-measures",
        destination: "/technical-and-organizational-measures.pdf",
        permanent: true,
      },
      {
        source: "/sub-processors",
        destination: "/sub-processors.pdf",
        permanent: true,
      },
    ];
  },
  experimental: {
    largePageDataBytes: 15000 * 1000,
  },
};
