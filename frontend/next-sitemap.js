module.exports = {
  siteUrl: process.env.NEXT_SITE_URL || 'https://surfgxds.xyz',
  changefreq: 'hourly',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ['/auth', '/friends/requests', '/friends'],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
  additionalPaths: async (config) => {
    const result = []
    result.push({
      loc: '/tricks/ski2',
      changefreq: 'hourly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    })
    result.push({
      loc: '/tricks/strafes',
      changefreq: 'hourly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    })
    result.push({
      loc: '/leaderboard/ski2',
      changefreq: 'hourly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })
    result.push({
      loc: '/leaderboard/strafes',
      changefreq: 'hourly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })
    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'test-bot',
        allow: ['/path', '/path-2'],
      },
      // {
      //   userAgent: 'black-listed-bot',
      //   disallow: ['/sub-path-1', '/path-2']
      // }
    ],
    // additionalSitemaps: [
    //   'https://example.com/my-custom-sitemap-1.xml',
    //   'https://example.com/my-custom-sitemap-2.xml',
    //   'https://example.com/my-custom-sitemap-3.xml'
    // ]
  },
}
