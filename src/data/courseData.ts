export const courseModules = [
  {
    id: 1,
    title: "Introduction to Next.js",
    description: "Learn the fundamentals of Next.js and why it's the most popular React framework.",
    lessons: 5,
    difficulty: "Beginner" as const,
    content: {
      overview: "Next.js is a powerful React framework that enables server-side rendering, static site generation, and much more. In this module, you'll learn the basics and set up your first Next.js application.",
      topics: [
        "What is Next.js and why use it?",
        "Setting up your development environment",
        "Creating your first Next.js app",
        "Understanding the project structure",
        "Running and building your app",
      ],
      codeExample: `// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>Your first Next.js application</p>
    </div>
  )
}`,
    },
  },
  {
    id: 2,
    title: "Pages and Routing",
    description: "Master Next.js file-based routing system and learn how to create dynamic routes.",
    lessons: 6,
    difficulty: "Beginner" as const,
    content: {
      overview: "Next.js uses a file-based routing system that makes creating pages incredibly simple. Learn how to create static and dynamic routes.",
      topics: [
        "File-based routing basics",
        "Creating static pages",
        "Dynamic routes with [id]",
        "Nested routes and layouts",
        "Catch-all routes",
        "Programmatic navigation",
      ],
      codeExample: `// pages/blog/[slug].js
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query

  return <h1>Post: {slug}</h1>
}`,
    },
  },
  {
    id: 3,
    title: "Data Fetching Methods",
    description: "Explore getStaticProps, getServerSideProps, and other data fetching techniques.",
    lessons: 7,
    difficulty: "Intermediate" as const,
    content: {
      overview: "Next.js provides multiple ways to fetch data depending on your needs. Learn when and how to use each method.",
      topics: [
        "Understanding different rendering strategies",
        "Static Generation with getStaticProps",
        "Server-side Rendering with getServerSideProps",
        "Incremental Static Regeneration (ISR)",
        "Client-side data fetching",
        "SWR and data fetching patterns",
        "API routes for backend logic",
      ],
      codeExample: `// pages/posts.js
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60 // ISR: regenerate every 60 seconds
  }
}

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}`,
    },
  },
  {
    id: 4,
    title: "API Routes",
    description: "Build serverless API endpoints directly in your Next.js application.",
    lessons: 5,
    difficulty: "Intermediate" as const,
    content: {
      overview: "Next.js allows you to create API routes as serverless functions. Perfect for building backend functionality without a separate server.",
      topics: [
        "Creating API routes",
        "Handling different HTTP methods",
        "Request and response handling",
        "API middleware",
        "Connecting to databases",
      ],
      codeExample: `// pages/api/users.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await fetchUsers()
    res.status(200).json(users)
  } else if (req.method === 'POST') {
    const newUser = await createUser(req.body)
    res.status(201).json(newUser)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}`,
    },
  },
  {
    id: 5,
    title: "Styling in Next.js",
    description: "Learn CSS Modules, Styled Components, Tailwind CSS, and other styling approaches.",
    lessons: 6,
    difficulty: "Beginner" as const,
    content: {
      overview: "Next.js supports various styling solutions. Choose the one that fits your project best.",
      topics: [
        "Global styles and CSS imports",
        "CSS Modules for component-scoped styles",
        "Setting up Tailwind CSS",
        "Styled Components and CSS-in-JS",
        "Sass/SCSS support",
        "Font optimization with next/font",
      ],
      codeExample: `// Using CSS Modules
import styles from './Button.module.css'

export default function Button() {
  return <button className={styles.primary}>Click me</button>
}

// Tailwind CSS
export default function Card() {
  return (
    <div className="rounded-lg shadow-lg p-6 bg-white">
      <h2 className="text-2xl font-bold">Card Title</h2>
    </div>
  )
}`,
    },
  },
  {
    id: 6,
    title: "Image Optimization",
    description: "Use Next.js Image component for automatic image optimization and lazy loading.",
    lessons: 4,
    difficulty: "Beginner" as const,
    content: {
      overview: "Next.js provides powerful image optimization out of the box with the Image component.",
      topics: [
        "next/image component basics",
        "Responsive images",
        "Image sizing and layouts",
        "External image optimization",
      ],
      codeExample: `import Image from 'next/image'

export default function Avatar() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile picture"
      width={500}
      height={500}
      priority
      className="rounded-full"
    />
  )
}`,
    },
  },
  {
    id: 7,
    title: "App Router (Next.js 13+)",
    description: "Explore the new App Router with React Server Components and Layouts.",
    lessons: 8,
    difficulty: "Advanced" as const,
    content: {
      overview: "The App Router is the future of Next.js, introducing Server Components, improved layouts, and more.",
      topics: [
        "App directory structure",
        "Server vs Client Components",
        "Layouts and templates",
        "Loading and error states",
        "Parallel routes",
        "Intercepting routes",
        "Route handlers",
        "Streaming and Suspense",
      ],
      codeExample: `// app/layout.js (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>Navigation</nav>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  )
}

// app/page.js (Server Component by default)
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{data.title}</main>
}`,
    },
  },
  {
    id: 8,
    title: "Authentication & Authorization",
    description: "Implement secure authentication with NextAuth.js and protect your routes.",
    lessons: 6,
    difficulty: "Advanced" as const,
    content: {
      overview: "Learn how to add authentication to your Next.js app using NextAuth.js and other popular solutions.",
      topics: [
        "Setting up NextAuth.js",
        "OAuth providers (Google, GitHub, etc.)",
        "Email/password authentication",
        "Session management",
        "Protected routes and middleware",
        "Role-based access control",
      ],
      codeExample: `// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    }
  }
})`,
    },
  },
  {
    id: 9,
    title: "Database Integration",
    description: "Connect to databases like PostgreSQL, MongoDB, and use Prisma ORM.",
    lessons: 7,
    difficulty: "Advanced" as const,
    content: {
      overview: "Learn how to integrate databases into your Next.js application for persistent data storage.",
      topics: [
        "Choosing the right database",
        "Setting up Prisma ORM",
        "Database schema design",
        "CRUD operations",
        "Database migrations",
        "Connection pooling",
        "Using MongoDB with Next.js",
      ],
      codeExample: `// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// pages/api/posts.js
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  const posts = await prisma.post.findMany({
    include: { author: true }
  })
  res.json(posts)
}`,
    },
  },
  {
    id: 10,
    title: "Deployment & Performance",
    description: "Deploy to Vercel, optimize performance, and implement best practices.",
    lessons: 6,
    difficulty: "Advanced" as const,
    content: {
      overview: "Learn how to deploy your Next.js application and optimize it for production.",
      topics: [
        "Deploying to Vercel",
        "Environment variables",
        "Performance optimization techniques",
        "Monitoring and analytics",
        "SEO best practices",
        "Edge functions and middleware",
      ],
      codeExample: `// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
  },
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  }
}`,
    },
  },
];
