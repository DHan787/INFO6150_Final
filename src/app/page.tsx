'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = {
    id: string;
    title: string;
    startLocation: string;
    endLocation: string;
    time: string;
    createdAt: number;
    status: 'active' | 'completed' | 'pinned';
};

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error('Failed to fetch posts:', err));
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-gray-800 text-white flex justify-between items-center px-4 py-2">
                <h1 className="text-2xl font-extrabold text-custom-red" style={{ fontFamily: 'Lobster, cursive' }}>
                    Pin Car
                </h1>
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
                        if (isLoggedIn) {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/login';
                        }
                    }}
                >
                    Admin
                </button>
            </header>

            <div className="flex-1 flex px-[15%] py-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts
                        .filter((p) => p.status !== 'completed')
                        .sort((a, b) => {
                            if (a.status === 'pinned' && b.status !== 'pinned') return -1;
                            if (b.status === 'pinned' && a.status !== 'pinned') return 1;
                            return b.createdAt - a.createdAt;
                        })
                        .map((post) => (
                            <div
                                key={post.id}
                                className="aspect-square bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                                    <p><strong>From:</strong> {post.startLocation}</p>
                                    <p><strong>To:</strong> {post.endLocation}</p>
                                    <p><strong>Time:</strong> {post.time}</p>
                                </div>
                                <Link
                                    href={`/post/${post.id}`}
                                    className="text-blue-500 mt-2 hover:underline"
                                >
                                    View Details →
                                </Link>
                            </div>
                        ))}
                </div>
            </div>

            <footer className="bg-gray-800 text-white text-center py-4 mt-6">
                <hr className="border-t-2 border-gray-500 mb-4" />
                <div className="space-x-6">
                    <a href="/conditions-of-use" className="text-sm hover:underline">Conditions of Use</a>
                    <a href="/privacy-notice" className="text-sm hover:underline">Privacy Notice</a>
                    <a href="/help" className="text-sm hover:underline">Help</a>
                </div>
                <div className="mt-4 text-sm">
                    © 2025, Pin Car.com
                </div>
            </footer>
        </main>
    );
}