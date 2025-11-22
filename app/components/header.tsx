import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TinyLink
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
