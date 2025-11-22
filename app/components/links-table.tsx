'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import { Input } from './ui/input'
import CopyButton from './copy-button'
import { useToast } from './ui/use-toast'
import Link from 'next/link'

interface Link {
  id: string
  code: string
  url: string
  clicks: number
  createdAt: string
  lastClickedAt: string | null
}

export default function LinksTable({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  useEffect(() => {
    setLinks(initialLinks)
  }, [initialLinks])

  // Listen for optimistic-created links from other components (LinkForm)
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent
      const newLink = custom.detail as Link
      if (!newLink || !newLink.id) return
      setLinks((prev) => [newLink, ...prev])
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('link:created', handler as EventListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('link:created', handler as EventListener)
      }
    }
  }, [])

  // Refresh server data when the tab becomes active so click counts stay up-to-date
  useEffect(() => {
    const onFocus = () => {
      try {
        router.refresh()
      } catch {}
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') onFocus()
      })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus)
        document.removeEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') onFocus()
        })
      }
    }
  }, [router])

  // Smooth-scroll to the table when the hash changes or on initial load
  useEffect(() => {
    const scrollToLinks = () => {
      if (typeof window === 'undefined') return
      if (window.location.hash !== '#links') return
      const el = document.getElementById('links')
      if (el) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch (_) {
          el.scrollIntoView()
        }
      }
    }

    // Run on mount in case the page was loaded with the hash
    scrollToLinks()

    // Listen for hash changes
    window.addEventListener('hashchange', scrollToLinks)

    return () => {
      window.removeEventListener('hashchange', scrollToLinks)
    }
  }, [])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    setDeleting(code)

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete link')
      }

      setLinks(links.filter((link) => link.code !== code))
      toast({
        title: 'Deleted',
        description: 'Link has been deleted successfully',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No links yet. Create your first short link above!</p>
      </div>
    )
  }

  return (
    <div id="links" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Links</h2>
        <Input
          placeholder="Search links..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short Code</TableHead>
              <TableHead>Target URL</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead>Last Clicked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono">
                  <Link
                    href={`/${link.code}`}
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    /{link.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    title={link.url}
                  >
                    {truncate(link.url, 50)}
                  </a>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {link.clicks}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {link.lastClickedAt
                    ? formatDistanceToNow(new Date(link.lastClickedAt), {
                        addSuffix: true,
                      })
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CopyButton text={`${baseUrl}/${link.code}`} />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(link.code)}
                      disabled={deleting === link.code}
                    >
                      {deleting === link.code ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLinks.length === 0 && search && (
        <div className="text-center py-8 text-muted-foreground">
          No links match your search.
        </div>
      )}
    </div>
  )
}
