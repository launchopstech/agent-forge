// Override default dashboard padding for full-height builder layout
export default function AgentBuilderLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-full overflow-hidden -m-6">{children}</div>
}
