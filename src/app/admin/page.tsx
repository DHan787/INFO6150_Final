'use client';
export default function AdminPage() {
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
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold">From: Fremont to NEU</h3>
                        <p>Time: 8:30 AM, April 20</p>
                        <p>Contact: WeChat: xy1234</p>
                        <div className="mt-2 flex justify-between">
                            <button className="text-blue-600 hover:underline">Pin</button>
                            <button className="text-green-600 hover:underline">Mark Complete</button>
                            <button className="text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                    {/* 更多卡片可用 map 渲染 */}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">📩 Requests for Pin</h2>
                <div className="bg-white p-4 rounded shadow">No new requests.</div>
            </section>
        </main>
    );
}
