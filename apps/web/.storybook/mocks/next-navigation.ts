export const usePathname = () => '/'
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
})
export const useSearchParams = () => new URLSearchParams()
export const useParams = () => ({})
export const redirect = () => {}
export const notFound = () => {}

// RedirectType is required by @clerk/nextjs imports
export enum RedirectType {
  push = 'push',
  replace = 'replace',
}

export const useSelectedLayoutSegments = () => []
export const useSelectedLayoutSegment = () => null
