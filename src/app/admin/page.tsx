"use client";

import { useEffect, useState } from "react";

type Post = {
    id: string;
    startLocation: string;
    endLocation: string;
    time: string;
    carModel: string;
    carYear: string;
    carColor: string;
    message: string;
    remarks: string;
    status: string;
};

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/api/posts")
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Failed to fetch posts:", err));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id));
            } else {
                console.error('Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 px-[15%] py-10">
            <button
                className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => window.location.href = '/'}
            >
                ← Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-6 text-custom-red">Admin Dashboard</h1>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2">📌 Pinned Posts</h2>
                <div className="bg-white p-4 rounded shadow">No pinned posts yet.</div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2">📝 User Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {posts.map((post: Post) => (
                        <div key={post.id} className="bg-white p-4 rounded shadow">
                            <h3 className="font-bold">From: {post.startLocation} to {post.endLocation}</h3>
                            <p>Time: {post.time}</p>
                            <p>Contact: {post.message}</p>
                            <div className="mt-2 flex justify-between">
                                <button className="text-blue-600 hover:underline">Pin</button>
                                <button className="text-green-600 hover:underline">Mark Complete</button>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">📩 Requests for Pin</h2>
                <div className="bg-white p-4 rounded shadow">No new requests.</div>
            </section>
        </main>
    );
}
