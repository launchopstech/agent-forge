export interface Page {
  slug: string
  title: string
  body: string
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  body: string
}

// TODO: swap with Contentful/Sanity — all functions are async to match future CMS signature

const pages: Page[] = [
  {
    slug: 'about',
    title: 'About Us',
    body: 'AgentForge is a platform for building and deploying AI agents at scale.',
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    body: 'We take your privacy seriously. This policy describes how we collect and use your data.',
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    body: 'By using AgentForge you agree to these terms and conditions.',
  },
]

const posts: Post[] = [
  {
    slug: 'introducing-agent-forge',
    title: 'Introducing AgentForge',
    excerpt: 'Learn how AgentForge helps teams build AI-powered workflows faster.',
    publishedAt: '2025-01-15',
    body: 'AgentForge brings together the best tools for AI agent development in one cohesive platform.',
  },
  {
    slug: 'building-with-next-js',
    title: 'Building with Next.js 16',
    excerpt: 'A deep dive into our decision to use Next.js 16 with the App Router.',
    publishedAt: '2025-02-01',
    body: 'Next.js 16 gives us React Server Components, streaming, and edge-ready middleware out of the box.',
  },
  {
    slug: 'auth-agency-model',
    title: 'The Auth Agency Model',
    excerpt:
      'How we built a pluggable auth system that can swap providers without touching app code.',
    publishedAt: '2025-03-01',
    body: 'By introducing an adapter registry pattern, we isolated all auth provider specifics behind a clean interface.',
  },
  {
    slug: 'tailwind-v4-design-tokens',
    title: 'Design Tokens with Tailwind v4',
    excerpt: 'Using @theme inline and OKLCH colors to create a maintainable design system.',
    publishedAt: '2025-03-10',
    body: 'Tailwind v4 allows us to define all design tokens in CSS using @theme inline, removing the need for a config file.',
  },
]

export async function getPage(slug: string): Promise<Page | null> {
  return pages.find((p) => p.slug === slug) ?? null
}

export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find((p) => p.slug === slug) ?? null
}
