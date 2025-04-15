'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface PostData {
    id: string;
    startLocation: string;
    endLocation: string;
    time: string;
    carModel: string;
    carYear: string;
    carColor: string; // Car color as string
    message: string;
    remarks: string;
    status: 'active' | 'completed' | 'pinned';
}
const PostListPage: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error('Failed to fetch posts:', err));
    }, []);
    const handleDelete = useCallback((id: string) => {
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }, [posts]);
    const handleComplete = useCallback((id: string) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, status: 'completed' } : post
        );
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        console.log(`Post with id ${id} marked as completed.`);
    }, [posts]); const handlePin = useCallback((id: string) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, status: 'pinned' } : post
        );
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        console.log(`Post with id ${id} pinned.`);
    }, [posts]);
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">My Posts</h1>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded shadow-md space-y-2">
                            <div className="flex flex-wrap gap-6">
                                <div className="flex-1">
                                    <p><strong>Start Location:</strong> {post.startLocation}</p>
                                    <p><strong>End Location:</strong> {post.endLocation}</p>
                                    <p><strong>Time:</strong> {post.time}</p>
                                    <p><strong>Car Model:</strong> {post.carModel}</p>
                                    <p><strong>Car Year:</strong> {post.carYear}</p>
                                </div>
                                <div className="flex-1">
                                    {/* Display car color with background color */}
                                    <p><strong>Car Color:</strong>
                                        <span
                                            className="inline-block w-6 h-6 rounded-full ml-2"
                                            style={{ backgroundColor: post.carColor }}
                                        ></span>
                                    </p>
                                    <p><strong>Message:</strong> {post.message}</p>
                                    <p><strong>Remarks:</strong> {post.remarks}</p>
                                    <p><strong>Status:</strong> {post.status}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-black text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleComplete(post.id)}
                                    className="bg-gray-400 text-black px-2 py-1 rounded"
                                >
                                    Complete
                                </button>
                                <button
                                    onClick={() => handlePin(post.id)}
                                    style={{ backgroundColor: 'rgb(209, 75, 121)' }}
                                    className="text-white px-2 py-1 rounded"
                                >
                                    Pin
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostListPage;
