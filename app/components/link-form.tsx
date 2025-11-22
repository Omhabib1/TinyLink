'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

export default function LinkForm() {
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link')
      }

      toast({
        title: 'Success!',
        description: `Short link created: /${data.code}`,
      })

      setUrl('')
      setCode('')
      // Notify other client components (like LinksTable) about the new link
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('link:created', { detail: data }))
        } catch (err) {
          // Ignore; CustomEvent might throw in some older environments
        }
      }

      // Refresh server data as a fallback
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Original URL *
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-2">
              Custom Code (optional)
            </label>
            <Input
              id="code"
              type="text"
              placeholder="mycode (6-8 characters)"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              disabled={loading}
              maxLength={8}
              pattern="[A-Za-z0-9]{6,8}"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to auto-generate. Must be 6-8 alphanumeric characters.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Short Link'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const el = document.getElementById('links')
                  if (el) {
                    try {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    } catch (_) {
                      el.scrollIntoView()
                    }
                    // update the hash so the URL reflects the anchor
                    history.replaceState(null, '', '#links')
                  } else {
                    // fallback: navigate to dashboard with hash
                    window.location.href = '/#links'
                  }
                }
              }}
              className="whitespace-nowrap"
            >
              View Links
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
