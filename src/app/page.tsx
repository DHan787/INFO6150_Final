/*
 * @Author: li wei wang
 * @Date: 2025-04-19 11:57:58
 * @Description: Changes in this update:
 * 1.Import CSS to add bubbles and label gradient. 
 * When the remaining time is less than one hour before the deadline, the label gradually turns pink,
 * the number of bubbles increases until the label disappears.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/bubbles.css';

type Post = {
    id: string;
    title: string;
    startLocation: string;
    endLocation: string;
    time: string;
    createdAt: number;
    status: 'active' | 'completed' | 'pinned';
};
type Bubble = {
    postId: string;
    left: number;
    top: number;
    id: string;
};
export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error('Failed to fetch posts:', err));
    }, []);
    const handleAdminClick = () => {
        window.location.href = '/login';
    };
    const calculateTimeDiff = (postTime: string) => {
        return new Date(postTime).getTime() - Date.now();
    };
    // Bubble loop
    useEffect(() => {
        const interval = setInterval(() => {
            const oneHour = 60 * 60 * 1000;
            const activePost = posts
                .filter(p => p.status !== 'completed')
                .filter(p => {
                    const diff = calculateTimeDiff(p.time);
                    return diff > 0 && diff <= oneHour;
                })
                .sort((a, b) => calculateTimeDiff(a.time) - calculateTimeDiff(b.time))[0];
            if (activePost) {
                const newBubble: Bubble = {
                    id: `${activePost.id}-${Math.random()}`,
                    postId: activePost.id,
                    left: Math.random() * 80,
                    top: Math.random() * 80,
                };
                setBubbles(prev => [...prev, newBubble]);
                setTimeout(() => {
                    setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
                }, 2000);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [posts]);
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex px-[15%] py-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts
                        .filter(p => p.status !== 'completed')
                        .sort((a, b) => calculateTimeDiff(a.time) - calculateTimeDiff(b.time))
                        .map(post => {
                            const timeDiff = calculateTimeDiff(post.time);
                            const oneHour = 60 * 60 * 1000;
                            const isNearOneHour = timeDiff > 0 && timeDiff <= oneHour;
                            const progress = isNearOneHour ? 1 - (timeDiff / oneHour) : 0;
                            const yellow = { r: 252, g: 236, b: 150 };
                            const pink = { r: 251, g: 207, b: 232 };
                            const r = Math.round(yellow.r + (pink.r - yellow.r) * progress);
                            const g = Math.round(yellow.g + (pink.g - yellow.g) * progress);
                            const b = Math.round(yellow.b + (pink.b - yellow.b) * progress);
                            const bgColor = `rgb(${r}, ${g}, ${b})`;
                            if (timeDiff <= 0) return null;
                            return (
                                <div
                                    key={post.id}
                                    className="aspect-square border border-yellow-300 rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between relative"
                                    style={{ backgroundColor: bgColor }}
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
                                    {/* Bubble */}
                                    {bubbles
                                        .filter(b => b.postId === post.id)
                                        .map(bubble => (
                                            <div
                                                key={bubble.id}
                                                className="bubble"
                                                style={{
                                                    top: `${bubble.top}%`,
                                                    left: `${bubble.left}%`,
                                                }}
                                            />
                                        ))}
                                </div>
                            );
                        })}
                </div>
            </div>
        </main>
    );
}
