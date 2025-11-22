"use client"

const EMAIL = 'omhabib1234@gmail.com'

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground space-y-2">
        <p>© 2025 TinyLink. Built with Next.js, Prisma & Neon.</p>
        <p className="font-medium">Om A Habib</p>
        <div>
          <span className="mr-2">Connect with me:</span>
          <a
            href="https://github.com/Omhabib1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mx-1"
          >
            GitHub
          </a>
          <span className="mx-1">·</span>
          <a
            href="https://www.linkedin.com/in/om-habib-14a733233/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mx-1"
          >
            LinkedIn
          </a>
          <span className="mx-1">·</span>

          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mx-1"
            aria-label={`Open Gmail compose for ${EMAIL}`}
          >
            {EMAIL}
          </a>

          <span className="mx-1">·</span>

          <a
            href={`tel:8431795097`}
            className="text-blue-600 hover:underline mx-1"
            aria-label="Call 8431795097"
          >
            8431795097
          </a>
        </div>
      </div>
    </footer>
  )
}
