import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, res: NextResponse) {
  // const country = req.geo.country?.toLowerCase() || 'us'
  const locale = req.headers.get('accept-language')?.split(',')?.[0] || 'en'

  const cookie = req.cookies[locale]

  // if (!cookie && locale) return NextResponse.next().cookie('locale', locale)
  // else return NextResponse.next()

  return NextResponse.next().cookie('locale', locale)
  // req.nextUrl.pathname = `/${locale}/us`

  // return NextResponse.rewrite(req.nextUrl)
}
