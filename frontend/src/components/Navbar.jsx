import React, { useContext, useEffect, useState } from 'react'
import list from '../assets/list.svg'
import next from '../assets/next.svg';
import prev from '../assets/prev.svg';
import { CodeExecutionContext } from '../Context'
import { executeCode, getProblems } from '../api';
import { Button, Toast, useToast } from '@chakra-ui/react';
import UseLogout from '../hooks/UseLogout';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProblemBar from './ProblemBar';
import { useTestCaseRunner } from '../tester';
import { Play, Send, LogOut, Share2, MessageCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import ShareCode from './ShareCode';
import ChatFriends from './ChatFriends';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const { Authuser } = useAuthContext();
    const { loading, logout } = UseLogout();
    const [arr, setarr] = useState([]);
    const [showShare, setShowShare] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [Loading, setLoading] = useState(false);
    
    const { language, code, isProblemBar, setisProblemBar, probId, setprobId } = useContext(CodeExecutionContext);
    const { run_all_testcases, load, load1, run_sample_testcases } = useTestCaseRunner();

    const handleUsernameClick = () => {
        navigate('/user-stat');
    };

    const fetchData = async () => {
        try {
            const result = await getProblems();
            setarr(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const next_helper = async () => {
        const index = arr.findIndex((item) => item._id === probId);
        if (index < arr.length - 1) {
            setprobId(arr[index + 1]._id);
        } else {
            toast.error('Reached end of all problems');
        }
    };

    const prev_helper = async () => {
        const index = arr.findIndex((item) => item._id === probId);
        if (index > 0) {
            setprobId(arr[index - 1]._id);
        } else {
            toast.error('Reached start of all problems');
        }
    };

    const run_helper = async () => {
        await run_all_testcases(code, language);
    };

    const run_helper2 = async () => {
        await run_sample_testcases(code, language);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <Toaster />
            <nav className='bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700 shadow-2xl sticky top-0 z-40'>
                <div className='max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-4'>
                    {/* Left - Logo and Navigation */}
                    <div className='flex items-center gap-4'>
                        <h1 className='gradient-text text-2xl font-bold'>
                            CleanCode
                        </h1>
                        <div className='hidden md:flex items-center gap-2 bg-slate-700 rounded-lg px-2 py-1'>
                            {isProblemBar && (
                                <button
                                    onClick={() => setisProblemBar(!isProblemBar)}
                                    className='text-slate-300 hover:text-white transition p-1'
                                >
                                    <Menu size={20} />
                                </button>
                            )}
                            <span className='text-slate-300 text-sm font-semibold'>Problems</span>
                            <button
                                onClick={prev_helper}
                                className='text-slate-400 hover:text-white transition p-1'
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={next_helper}
                                className='text-slate-400 hover:text-white transition p-1'
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Center - Empty Space */}
                    <div className='flex items-center gap-3'>
                    </div>

                    {/* Right - User & Features */}
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setShowShare(true)}
                            className='text-slate-300 hover:text-blue-400 transition p-2 rounded-lg hover:bg-slate-700'
                            title='Share Code'
                        >
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={() => setShowChat(true)}
                            className='text-slate-300 hover:text-purple-400 transition p-2 rounded-lg hover:bg-slate-700'
                            title='Chat with Friends'
                        >
                            <MessageCircle size={20} />
                        </button>
                        <div className='hidden md:flex items-center gap-2 ml-2'>
                            <button
                                onClick={() => navigate('/problems')}
                                className='bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-3 py-2 rounded-lg transition text-sm font-semibold'
                            >
                                Browse Problems
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className='bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white px-3 py-2 rounded-lg transition text-sm font-semibold'
                            >
                                {Authuser?.username || '👤'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className='flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition text-sm font-semibold'
                            >
                                <LogOut size={16} />
                                <span className='hidden sm:inline'>Exit</span>
                            </button>
                        </div>
                        {/* Mobile Menu Button */}
                        <button className='md:hidden text-slate-300 hover:text-white p-2'>
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Modals */}
            <ShareCode isOpen={showShare} onClose={() => setShowShare(false)} />
            <ChatFriends isOpen={showChat} onClose={() => setShowChat(false)} />
        </>
    );
}
export default Navbar
