/*
 * @Author: Jiang Han
 * @Date: 2025-04-15 16:24:58
 * @Description: 
 */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'posts.json');

export async function GET() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(data || '[]'));
    } catch {
        return NextResponse.json({ error: 'Failed to read data.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let existing = [];
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            existing = JSON.parse(data || '[]');
        }
        existing.push(body);
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to write data.' }, { status: 500 });
    }
}

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

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const posts = JSON.parse(data || '[]');
        const updatedPosts = posts.filter((post: Post) => post.id !== id);

        fs.writeFileSync(filePath, JSON.stringify(updatedPosts, null, 2));
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
