import fs from 'fs';
import path from 'path';

type Post = {
    id: string;
    title: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'pinned' | 'completed' | 'expired';
};

const filePath = path.join(process.cwd(), 'public', 'posts.json');

export async function expireOutdatedPosts() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const posts: Post[] = JSON.parse(data);

        const now = Date.now();
        const updatedPosts = posts.map((post: Post) => {
            const postTime = new Date(post.endTime).getTime();
            if (post.status === 'active' && postTime < now) {
                return { ...post, status: 'expired' };
            }
            return post;
        });

        fs.writeFileSync(filePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');
        console.log(`[cron] Updated expired posts at ${new Date().toISOString()}`);
    } catch (err) {
        console.error('Failed to update post statuses:', err);
    }
}