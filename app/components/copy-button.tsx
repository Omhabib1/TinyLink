'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={copied}
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  )
}
