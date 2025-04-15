'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const CreatePostPage: React.FC = () => {
    const router = useRouter();
    // Define state for the form fields
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [time, setTime] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carYear, setCarYear] = useState('');
    const [carColor, setCarColor] = useState('');
    const [message, setMessage] = useState('');
    const [remarks, setRemarks] = useState('');
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            id: Date.now().toString(),
            startLocation,
            endLocation,
            time,
            carModel,
            carYear,
            carColor,
            message,
            remarks,
            status: 'active',
        };

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        if (res.ok) {
            router.push('/post');
        } else {
            alert('Failed to create post.');
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header>
                <h1 className="text-2xl font-extrabold text-custom-red text-left ml-2" style={{ fontFamily: 'Lobster, cursive' }}>
                    Pin Car
                </h1>
            </header>
            {/* Main Content */}
            <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
                <h2 className="text-2xl font-bold text-center mb-6">Create Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Start Location */}
                    <div>
                        <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">Start Location</label>
                        <input
                            type="text"
                            id="startLocation"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter start location"
                            required
                        />
                    </div>
                    {/* End Location */}
                    <div>
                        <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700">End Location</label>
                        <input
                            type="text"
                            id="endLocation"
                            value={endLocation}
                            onChange={(e) => setEndLocation(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter end location"
                            required
                        />
                    </div>
                    {/* Time */}
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="datetime-local"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Car Year, Car Color, Car Model */}
                    <div className="flex space-x-4">
                        <div className="w-1/3">
                            <label htmlFor="carYear" className="block text-sm font-medium text-gray-700">Car Year</label>
                            <input
                                type="text"
                                id="carYear"
                                value={carYear}
                                onChange={(e) => setCarYear(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                placeholder="Enter car year"
                                required
                            />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="carColor" className="block text-sm font-medium text-gray-700">Car Color</label>
                            <input
                                type="text"
                                id="carColor"
                                value={carColor}
                                onChange={(e) => setCarColor(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                placeholder="Enter car color"
                                required
                            />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Car Model</label>
                            <input
                                type="text"
                                id="carModel"
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md"
                                placeholder="Enter car model"
                                required
                            />
                        </div>
                    </div>
                    {/* Message */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter a message"
                        />
                    </div>
                    {/* Remarks */}
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md"
                            placeholder="Enter any remarks"
                        />
                    </div>
                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="w-full bg-black text-white p-2 rounded-md">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            {/* Footer */}
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
        </div>
    );
};

export default CreatePostPage;
