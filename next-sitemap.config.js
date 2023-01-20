// https://www.npmjs.com/package/next-sitemap

const lang = "en";

module.exports = {
  siteUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
    }/${lang}`,
  // DEFAULTS
  // changefreq: "daily",
  // priority: 0.7,
  // sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    "/",
    "/401",
    "/404",
    "/500",
    "/blog/*",
    `/${lang}/home`,
    "/partners-directory/*",
    "/templates/category/*",
  ], // <= exclude here
  robotsTxtOptions: {
    policies: process.env.NEXT_PUBLIC_SITE_URL
      ? [
        {
          userAgent: "*",
          allow: "/",
          disallow: `*${lang}/hq*`,
        },
      ]
      : [{ userAgent: "*", disallow: "/" }],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/${lang}/blog-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/${lang}/integrations-sitemap.xml`,
      // `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"}/${lang}/partners-directory-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/${lang}/templates-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/${lang}/use-cases-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/${lang}/webinars-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    if (!path.startsWith(`/${lang}/`) && path !== "/" && path !== `/${lang}`) {
      return null;
    }
    if (
      path.startsWith(`/${lang}/401`) ||
      path.startsWith(`/${lang}/404`) ||
      path.startsWith(`/${lang}/500`) ||
      path.startsWith(`/${lang}/blog/caregory/`) ||
      path.startsWith(`/${lang}/integrations/`) ||
      path.startsWith(`/${lang}/partners-directory/`) ||
      path.startsWith(`/${lang}/templates/`) ||
      // path.startsWith(`/${lang}/templates/category/`) ||
      path.startsWith(`/${lang}/use-cases/`) ||
      path.startsWith(`/${lang}/use-cases/caregory/`) ||
      path.startsWith(`/${lang}/automate-linkedin-marketing-solutions`)
      // path.startsWith(`/${lang}/webinars`)
    ) {
      return null;
    }

    return {
      loc: path.replace(`/${lang}`, ""), // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
