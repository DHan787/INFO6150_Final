'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn !== 'true') {
            router.push('/login');
        } else {
            fetch("/api/posts")
                .then(res => res.json())
                .then(data => {
                    const pinned = data.filter((post: Post) => post.status === 'pinned');
                    const others = data.filter((post: Post) => post.status !== 'pinned');
                    setPinnedPosts(pinned);
                    setPosts(others);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch posts:", err);
                    setLoading(false);
                });
        }
    }, [router]);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id));
                setPinnedPosts(prev => prev.filter(p => p.id !== id));
            } else {
                console.error('Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handlePin = async (id: string) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'pinned' }),
            });
            if (res.ok) {
                const pinnedPost = posts.find(p => p.id === id);
                if (pinnedPost) {
                    setPinnedPosts(prev => [...prev, { ...pinnedPost, status: 'pinned' }]);
                    setPosts(prev => prev.filter(p => p.id !== id));
                }
            } else {
                console.error('Failed to pin post');
            }
        } catch (err) {
            console.error('Error pinning post:', err);
        }
    };

    const calculateTimeDiff = (postTime: string) => {
        const postDate = new Date(postTime);
        const now = new Date();
        const diff = postDate.getTime() - now.getTime();
        return diff;
    };

    // Sort posts by time
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    const expiredPosts = sortedPosts.filter(post => calculateTimeDiff(post.time) < 0);
    const upcomingPosts = sortedPosts.filter(post => calculateTimeDiff(post.time) >= 0);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-gray-100 px-[15%] py-10 relative">
            <button
                className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => router.push('/')}
            >
                ← Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-6 text-custom-red">Admin Dashboard</h1>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2 text-black">📌 Pinned Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pinnedPosts.length === 0 ? (
                        <div className="bg-white p-4 rounded shadow">No pinned posts yet.</div>
                    ) : (
                        pinnedPosts.map((post: Post) => (
                            <Link key={post.id} href={`/post/${post.id}`} className="bg-blue-50 border border-blue-200 p-4 rounded shadow block hover:shadow-md transition">
                                <h3 className="font-semibold text-blue-900">From: {post.startLocation} to {post.endLocation}</h3>
                                <p className="text-blue-800">Time: {post.time}</p>
                                <p className="text-blue-800">Contact: {post.message}</p>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2 text-black">📝 User Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...upcomingPosts, ...expiredPosts].map((post: Post) => {
                        return (
                            <Link key={post.id} href={`/post/${post.id}`} className="bg-blue-50 border border-blue-200 p-4 rounded shadow relative block hover:shadow-md transition">
                                <h3 className="font-semibold text-blue-900">From: {post.startLocation} to {post.endLocation}</h3>
                                <p className="text-blue-800">Time: {post.time}</p>
                                <p className="text-blue-800">Contact: {post.message}</p>
                                {new Date(post.time) < new Date() && (
                                    <p className="text-sm text-red-600 font-medium">Expired</p>
                                )}
                                <div className="mt-4 flex justify-between space-x-2">
                                    <button
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePin(post.id);
                                        }}
                                    >
                                        Pin
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                                    >
                                        Mark Complete
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">📩 Requests for Pin</h2>
                <div className="bg-white p-4 rounded shadow">No new requests.</div>
            </section>
        </main>
    );
}
