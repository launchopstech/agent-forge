import { buildMiddleware } from '@forge/auth/middleware'

export default buildMiddleware(
  ['/dashboard(.*)', '/admin(.*)'], // protected routes — require auth
  ['/login(.*)', '/signup(.*)', '/forgot-password(.*)'] // auth routes — redirect away if authed
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
