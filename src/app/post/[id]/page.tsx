/*
 * @Author: Jiang Han
 * @Date: 2025-04-22 13:47:10
 * @Description: 
 */
import React from "react";

import { notFound } from 'next/navigation';

interface Post {
    id: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    carModel: string;
    carYear: string;
    carColor: string;
    message: string;
    remarks: string;
    status: 'active' | 'completed' | 'pinned';
}

async function fetchPost(id: string): Promise<Post | null> {
    const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' });
    const data = await res.json();
    return data.find((post: Post) => post.id === id) || null;
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
    const post = await fetchPost(params.id);
    if (!post) return notFound();

    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const calculateTimeDifference = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffInMs = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
                <h1 className="text-3xl font-bold mb-4">Post Details</h1>
                <p><strong>Start Location:</strong> {post.startLocation}</p>
                <p><strong>End Location:</strong> {post.endLocation}</p>
                <p><strong>Start Time:</strong> {formatTime(post.startTime)}</p>
                <p><strong>End Time:</strong> {formatTime(post.endTime)}</p>
                <p><strong>Estimated Time:</strong> {calculateTimeDifference(post.startTime, post.endTime)}</p>
                <p><strong>Car Model:</strong> {post.carModel}</p>
                <p><strong>Car Year:</strong> {post.carYear}</p>
                <p><strong>Car Color:</strong> <span className="inline-block w-6 h-6 rounded-full ml-2" style={{ backgroundColor: post.carColor }}></span></p>
                <p><strong>Message:</strong> {post.message}</p>
                <p><strong>Remarks:</strong> {post.remarks}</p>
                <p><strong>Status:</strong> {post.status}</p>
            </div>
        </main>
    );
}