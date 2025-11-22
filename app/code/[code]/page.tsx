import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import CopyButton from '../../components/copy-button'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

async function getLink(code: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/links/${code}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function StatsPage({
  params,
}: {
  params: { code: string }
}) {
  const link = await getLink(params.code)

  if (!link) {
    notFound()
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const shortUrl = `${baseUrl}/${link.code}`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Link Statistics</h1>
        <p className="text-muted-foreground">Analytics for /{link.code}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Short URL</span>
            <CopyButton text={shortUrl} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-mono text-blue-600 break-all">
            {shortUrl}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Original URL</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {link.url}
          </a>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{link.clicks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {formatDistanceToNow(new Date(link.createdAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Last Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {link.lastClickedAt
                ? formatDistanceToNow(new Date(link.lastClickedAt), {
                    addSuffix: true,
                  })
                : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
