import type { TechLayer } from '../types'

export const techStack: TechLayer[] = [
  {
    layer: 'UI',
    items: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'shadcn/ui'],
  },
  {
    layer: 'API',
    items: ['NestJS 10', 'AWS Lambda', 'REST + SSE'],
  },
  {
    layer: 'Agent engine',
    items: ['LangGraph', 'LangChain', 'LiteLLM'],
  },
  {
    layer: 'Memory & RAG',
    items: ['LangMem', 'pgvector', 'Hybrid retrieval'],
  },
  {
    layer: 'Infra',
    items: ['Vercel', 'AWS ECS Fargate', 'Terraform'],
  },
  {
    layer: 'Observability',
    items: ['LangSmith', 'OpenTelemetry'],
  },
]
