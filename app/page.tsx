import LinkForm from './components/link-form'
import LinksTable from './components/links-table'

export const dynamic = 'force-dynamic'

async function getLinks() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/links`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch links:', error)
    return []
  }
}

export default async function DashboardPage() {
  const links = await getLinks()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">TinyLink Dashboard</h1>
        <p className="text-muted-foreground">
          Create and manage your shortened URLs
        </p>
      </div>

      <LinkForm />

      <div className="pt-4">
        <LinksTable initialLinks={links} />
      </div>
    </div>
  )
}
