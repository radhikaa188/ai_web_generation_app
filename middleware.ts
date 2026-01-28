import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
//clerkiddlewre connects clerk auth with next JS middleware
// create route matcher helps check if the current URL matches certain routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)',
  '/sign-up(.*)',
  '/'
])
// protect all other routes
export default clerkMiddleware(async (auth, req) => {
  //req is route here and it chexks if it matches with the above three
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
//configuration
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}