📌 TinyLink – Modern URL Shortener (Next.js + Prisma + PostgreSQL)

TinyLink is a fast, minimal, production-ready URL shortener application built with Next.js 14 App Router, TypeScript, Prisma, and PostgreSQL (Neon).
It allows users to shorten URLs, track clicks, manage links, and redirect users instantly.

🚀 Features
🔗 URL Shortening

Auto-generated 6–8 character codes

Optional custom code support

Instant URL creation

Real-time dashboard update without page reload

📊 Analytics

Tracks:

Total clicks

Last clicked time

Creation time

📁 Dashboard

View all created links

Delete links

Click to redirect

Copy short URL easily

⚙️ Backend (API)

POST /api/links → Create link

GET /api/links → Fetch all links

GET /api/links/[code] → Fetch specific link

DELETE /api/links/[code] → Delete link

GET /[code] → Redirect to original URL

💾 Database (Prisma + PostgreSQL)

Prisma ORM

Neon PostgreSQL (Cloud DB)

Automatic migrations (prisma db push)

🧩 Tech Stack

Next.js 14 (App Router)

React 18

Prisma ORM

PostgreSQL (Neon)

Tailwind CSS

TypeScript


