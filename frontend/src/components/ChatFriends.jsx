import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const ChatFriends = ({ isOpen, onClose }) => {
  const { Authuser } = useAuthContext();
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alex Dev', status: 'online', avatar: '👨‍💻' },
    { id: 2, name: 'Sarah Code', status: 'online', avatar: '👩‍💻' },
    { id: 3, name: 'Mike Java', status: 'offline', avatar: '👨‍🎓' },
  ]);
  
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedFriend]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    const friendId = selectedFriend.id;
    const messageObj = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), messageObj],
    }));

    setNewMessage('');
    
    // Simulate incoming message after delay
    setTimeout(() => {
      const replyObj = {
        id: Date.now() + 1,
        text: `Thanks for the message! 🎉`,
        sender: 'friend',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), replyObj],
      }));
    }, 1000);
  };

  if (!isOpen) return null;

  const currentMessages = messages[selectedFriend?.id] || [];

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50">
      <Toaster />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle size={22} className="text-white" />
          <h3 className="text-white font-bold text-lg">Messages</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-1 rounded transition"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Friends List */}
        <div className="w-1/3 border-r border-slate-700 overflow-y-auto bg-slate-900">
          <div className="flex items-center gap-1 px-3 py-2 text-slate-400 text-xs font-semibold sticky top-0 bg-slate-800">
            <Users size={14} /> Friends
          </div>
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`w-full px-3 py-2 text-left border-b border-slate-700 hover:bg-slate-800 transition ${
                selectedFriend?.id === friend.id ? 'bg-slate-700' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{friend.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{friend.name}</p>
                  <p className={`text-xs ${friend.status === 'online' ? 'text-green-400' : 'text-slate-500'}`}>
                    {friend.status}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedFriend ? (
            <>
              <div className="bg-slate-700 p-3 border-b border-slate-600">
                <p className="font-semibold text-slate-100">{selectedFriend.name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-400 text-sm">No messages yet. Start chatting!</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="border-t border-slate-600 p-3 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p className="text-sm">Select a friend to chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatFriends;
