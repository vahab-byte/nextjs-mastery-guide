const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Module = require('./models/Module');
const Question = require('./models/Question');

dotenv.config();

const modulesData = [
    {
        id: 1,
        title: 'Introduction to Next.js',
        description: 'Learn the fundamentals of Next.js and why it is the most popular React framework.',
        lessons_count: 5,
        difficulty: 'Beginner',
        content_overview: 'Next.js is a powerful React framework that enables server-side rendering, static site generation, and much more.',
        content_code_example: 'export default function Home() { return <h1>Hello, Next.js!</h1> }',
        content_topics: ['What is Next.js?', 'Setting up environment', 'First App', 'Project Structure', 'VS Code Setup']
    },
    {
        id: 2,
        title: 'Routing & Navigation',
        description: 'Master the file-system based routing mechanism.',
        lessons_count: 8,
        difficulty: 'Beginner',
        content_overview: 'Next.js uses a file-system based router built on the concept of pages.',
        content_code_example: 'import Link from "next/link"; export default function Nav() { return <Link href="/about">About</Link> }',
        content_topics: ['File-system routing', 'Nested routes', 'Dynamic routes', 'next/link', 'useRouter Hook', 'Route Groups']
    },
    {
        id: 3,
        title: 'Data Fetching',
        description: 'Understand how to handle data in Next.js applications.',
        lessons_count: 6,
        difficulty: 'Intermediate',
        content_overview: 'Learn about server and client components data fetching strategies.',
        content_code_example: 'async function getData() { const res = await fetch("..."); return res.json(); }',
        content_topics: ['Server Components', 'Client Components', 'fetch API', 'Caching', 'Revalidating', 'Streaming']
    },
    {
        id: 4,
        title: 'API Routes & Backend',
        description: 'Build serverless APIs with Next.js.',
        lessons_count: 5,
        difficulty: 'Intermediate',
        content_overview: 'Create API endpoints as Node.js serverless functions.',
        content_code_example: 'export default function handler(req, res) { res.status(200).json({ name: "John Doe" }) }',
        content_topics: ['Route Handlers', 'Request Helpers', 'Dynamic API Routes', 'Cookies & Headers', 'Middleware']
    },
    {
        id: 5,
        title: 'Styling & Optimization',
        description: 'Make your application look good and load fast.',
        lessons_count: 7,
        difficulty: 'Advanced',
        content_overview: 'Explore styling options like Tailwind CSS and CSS modules, and optimize images/fonts.',
        content_code_example: 'import Image from "next/image"; export default function Banner() { return <Image src="/hero.jpg" alt="Hero" width={500} height={300} /> }',
        content_topics: ['Tailwind CSS', 'CSS Modules', 'Image Optimization', 'Font Optimization', 'Script Optimization', 'Metadata API']
    },
    {
        id: 6,
        title: 'State Management',
        description: 'Managing complex state in Next.js applications.',
        lessons_count: 4,
        difficulty: 'Intermediate',
        content_overview: 'Patterns for global state, server state, and URL state.',
        content_code_example: '// Context or Zustand example specific to Next.js patterns',
        content_topics: ['Context API', 'Zustand', 'URL State', 'React Query / TanStack Query', 'Server Actions']
    },
    {
        id: 7,
        title: 'Deployment & Ops',
        description: 'Deploying your Next.js application to production.',
        lessons_count: 4,
        difficulty: 'Advanced',
        content_overview: 'Learn how to deploy to Vercel and other platforms.',
        content_code_example: '// build settings and env vars',
        content_topics: ['Vercel Deployment', 'Docker', 'Environment Variables', 'CI/CD Pipelines', 'Monitoring']
    }
];

const questionsData = [
    {
        module_id: 1,
        question: 'What is the main benefit of Next.js over plain React?',
        options: ['It uses Angular syntax', 'Server-Side Rendering (SSR)', 'It is a database', 'It replaces JavaScript'],
        correct_answer: 1,
        explanation: 'Next.js provides SSR out of the box, improving performance and SEO.'
    },
    {
        module_id: 2,
        question: 'How do you create a dynamic route in Next.js?',
        options: ['[id].js', '{id}.js', '(id).js', '<id>.js'],
        correct_answer: 0,
        explanation: 'Using square brackets like [id].js allows for dynamic routing parameters.'
    }
];

const seedData = async () => {
    await connectDB();

    try {
        await Module.deleteMany();
        await Question.deleteMany();

        await Module.insertMany(modulesData);
        await Question.insertMany(questionsData);

        console.log('Comparison Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
