import React, { useState, useContext } from 'react';
import { Copy, X, Share2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CodeExecutionContext } from '../Context';

const ShareCode = ({ isOpen, onClose }) => {
  const { code } = useContext(CodeExecutionContext);
  const [shareUrl, setShareUrl] = useState('');
  
  const generateShareLink = async () => {
    try {
      const shareId = Math.random().toString(36).substring(2, 11);
      // In production, save this to your backend
      const url = `${window.location.origin}?shared=${shareId}`;
      setShareUrl(url);
      toast.success('Share link generated!');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Toaster />
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 gradient-text">
            <Share2 size={24} /> Share Code
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto border border-slate-700">
            <p className="text-slate-300 text-sm font-mono whitespace-pre-wrap break-words">{code || 'No code to share'}</p>
          </div>

          <button
            onClick={generateShareLink}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            Generate Share Link
          </button>

          {shareUrl && (
            <div className="space-y-2">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex justify-between items-center">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="bg-transparent outline-none text-slate-200 text-sm flex-1"
                />
                <button
                  onClick={copyToClipboard}
                  className="text-blue-400 hover:text-blue-300 transition ml-2"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400">Share this link with your friends!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareCode;
