export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground">Welcome to your dashboard.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Active Agents', value: '0' },
          { label: 'Workflows', value: '0' },
          { label: 'Runs Today', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
