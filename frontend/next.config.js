/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const avatarNull =
  'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/avatar%2Favatar.gif?alt=media&token=b75ff4ef-2142-465c-b44b-a4a1ed9230e9'

const dashboardNull =
  'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/dashboard%2Fdashboard.jpg?alt=media&token=455fd849-d65f-4142-956c-e5913668bcf3'

// GenerateSitemap
// const generateSitemap = require('./scripts/sitemap')
// const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
// const sitemapDest = path.resolve('.next/static')

// ServiceWorker
// const serviceWorkerPath = 'static/sw.js'
// const serviceWorkerUrl = `/_next/${serviceWorkerPath}`
// const serviceWorkerDest = `.next/${serviceWorkerPath}`

module.exports = {
  webpack5: true,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  sassOptions: {
    prependData: `@import "styles/variables.scss";`,
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    NOT_FOUND:
      'https://garnetgaming.net/forums/uploads/monthly_2018_11/lain-transparent-static-4.gif.abf402297aef7303cde0c2da0ebc81be.gif',
    NOT_INVITES:
      'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/etc%2Fnot_invites.gif?alt=media&token=1b1d83e1-f6f4-4a48-85cb-5520663ced0a',
    NOT_PERMISSION:
      'https://image.myanimelist.net/ui/9FMmrCQC46J-Q4IkG6w8PBvPOFvxngba4X1fu-l1uTkq2PvdpLk_ALPmLy6Tx7hy',
    NOT_TRIGGER:
      'https://firebasestorage.googleapis.com/v0/b/surfgxds.appspot.com/o/triggers%2FtriggerNone.gif?alt=media&token=82bf1192-4985-4fb9-b912-7c2415e8f677',
    NEXT_BACKEND_URL: process.env.NEXT_BACKEND_URL,
    DASHBOARD_NULL: dashboardNull,
    AVATAR_NULL: avatarNull,
    NEXT_APIKEY: process.env.NEXT_APIKEY,
    NEXT_AUTHDOMAIN: process.env.NEXT_AUTHDOMAIN,
    NEXT_PROJECTID: process.env.NEXT_PROJECTID,
    NEXT_STORAGEBUCKET: process.env.NEXT_STORAGEBUCKET,
    NEXT_MESSAGINGSENDERID: process.env.NEXT_MESSAGINGSENDERID,
    NEXT_APPID: process.env.NEXT_APPID,
    NEXT_MEASUREMENTID: process.env.NEXT_MEASUREMENTID,
    NEXT_MY_ARENA_TOKEN: process.env.NEXT_MY_ARENA_TOKEN,
    SITE_URL: process.env.NEXT_SITE_URL,
  },
  excludeFile: (str) => /\/src\/sw\/.*/.test(str),
  webpackDevMiddleware: (config) => {
    config.watchOption = {
      pool: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      }
    )

    return config
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/apishka/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  // headers: () => [
  //   {
  /*
   * Since we're outputing service worker
   * with static files in /_next/static directory
   * we have to return the service worker file with an additional header
   * so that the browser would know that it's safe to run it on the root scope.
   */
  // source: serviceWorkerUrl,
  // headers: [
  //   {
  //     key: 'service-worker-allowed',
  //     value: '/'
  //   }
  // ]
  // }
  // ]
}
