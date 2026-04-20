import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Split from 'react-split';
import ProblemDesc from '../components/ProblemDesc';
import CodeSpace from '../components/CodeSpace';
import TestSpace from '../components/TestSpace';
import ProblemsPage from './ProblemsPage';
import { Code, Users, Zap, Shield, Github, ArrowRight } from 'lucide-react';

const Home = ({ selectedProblemId }) => {
    const { Authuser } = useAuthContext();
    const navigate = useNavigate();
    const [showEditor, setShowEditor] = useState(!!selectedProblemId);

    const handleSelectProblem = (problemId) => {
        setShowEditor(true);
    };

    // If user is authenticated and wants to see the editor
    if (Authuser && showEditor) {
        return (
            <>
                <Navbar />
                <div className='bg-slate-900 min-h-screen'>
                    <Split className='split'>
                        <div className='flex-1 min-w-[300px] h-[100%] overflow-y-auto border-r border-slate-700 m-3 rounded-lg bg-slate-800/50 backdrop-blur-sm'>
                            <ProblemDesc />
                        </div>
                        <div className='flex-2 flex flex-col max-h-fit mr-2 rounded-xl'>
                            <Split direction='vertical' className='flex flex-col h-[810px]'>
                                <div className='flex-1 border-b border-slate-700 p-4 rounded-xl bg-slate-800/50 backdrop-blur-sm'>
                                    <CodeSpace />
                                </div>
                                <div className='flex overflow-y-auto p-4 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm'>
                                    <TestSpace />
                                </div>
                            </Split>
                        </div>
                    </Split>
                </div>
            </>
        );
    }

    // If user is authenticated, show problems list
    if (Authuser) {
        return (
            <>
                <Navbar />
                <ProblemsPage onSelectProblem={handleSelectProblem} />
            </>
        );
    }

    // Landing page for unauthenticated users
    return (
        <div className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen'>
            {/* Animated background */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob'></div>
                <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000'></div>
            </div>

            {/* Navigation */}
            <nav className='relative z-20 flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0'>
                <h1 className='gradient-text text-3xl font-bold'>CleanCode</h1>
                <div className='flex gap-3'>
                    <button
                        onClick={() => navigate('/login')}
                        className='px-6 py-2 text-slate-200 hover:text-white transition font-semibold'
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className='px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition transform hover:scale-105'
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className='relative z-10 max-w-6xl mx-auto px-6 py-20 text-center'>
                <h2 className='text-5xl md:text-7xl font-bold mb-6 gradient-text'>
                    Code. Learn. Grow.
                </h2>
                <p className='text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto'>
                    Master coding with our modern, clean, and intuitive platform. Write, test, and share your code with friends in real-time.
                </p>
                <div className='flex gap-4 justify-center flex-wrap'>
                    <button
                        onClick={() => navigate('/signup')}
                        className='flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition transform hover:scale-105 shadow-2xl'
                    >
                        Start Coding <ArrowRight size={24} />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className='px-8 py-4 border-2 border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-bold text-lg rounded-xl transition'
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className='relative z-10 max-w-6xl mx-auto px-6 py-20'>
                <h3 className='text-4xl font-bold text-center mb-16 text-slate-100'>Why Choose CleanCode?</h3>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {[
                        { icon: <Code size={32} />, title: 'Clean Code', desc: 'Modern editor with syntax highlighting' },
                        { icon: <Zap size={32} />, title: 'Lightning Fast', desc: 'Instant code execution' },
                        { icon: <Users size={32} />, title: 'Share & Collaborate', desc: 'Share code with friends instantly' },
                        { icon: <Shield size={32} />, title: 'Secure', desc: 'Your code is safe and private' },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className='group p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition transform hover:-translate-y-2 cursor-pointer'
                        >
                            <div className='text-blue-400 group-hover:text-purple-400 transition mb-4'>
                                {feature.icon}
                            </div>
                            <h4 className='text-xl font-bold text-white mb-3'>{feature.title}</h4>
                            <p className='text-slate-400'>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className='relative z-10 max-w-6xl mx-auto px-6 py-20'>
                <div className='grid md:grid-cols-3 gap-8'>
                    {[
                        { number: '10K+', label: 'Active Users' },
                        { number: '500+', label: 'Coding Problems' },
                        { number: '1M+', label: 'Code Executions' },
                    ].map((stat, idx) => (
                        <div key={idx} className='text-center'>
                            <h4 className='gradient-text text-5xl font-bold mb-2'>{stat.number}</h4>
                            <p className='text-slate-400 text-lg'>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className='relative z-10 max-w-4xl mx-auto px-6 py-20 text-center'>
                <div className='bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12'>
                    <h3 className='text-4xl font-bold text-white mb-6'>Ready to Master Coding?</h3>
                    <p className='text-xl text-slate-300 mb-8'>Join thousands of developers learning on CleanCode</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className='px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition transform hover:scale-105'
                    >
                        Get Started Free
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className='relative z-10 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm py-8 mt-20'>
                <div className='max-w-6xl mx-auto px-6 text-center text-slate-400'>
                    <p>&copy; 2024 CleanCode. Built for developers, by developers.</p>
                </div>
            </footer>

            {/* Blob animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </div>
    );
};

export default Home;
