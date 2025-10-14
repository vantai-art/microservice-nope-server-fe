import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Footer from '../components/Footer';
function BlogPage() {
    const { blogPosts } = useAppContext();

    return (
        <div className="min-h-screen bg-black pt-20">
            <div
                className="relative h-64 flex items-center justify-center text-white"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=400&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <h1 className="relative text-5xl font-bold z-10">TIN TỨC</h1>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                            <div className="p-6 text-white">
                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{post.date}</span>
                                    <span>{post.views} lượt xem</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
export default BlogPage;
