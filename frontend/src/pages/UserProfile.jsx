import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { getUserStats, getFriendList, getPendingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../api';
import { Users, Flame, TrendingUp, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = ({ userId, isOwnProfile = false }) => {
  const { Authuser } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userStats = await getUserStats(userId);
        setStats(userStats);

        const friendList = await getFriendList(userId);
        setFriends(friendList);

        if (isOwnProfile) {
          const pending = await getPendingRequests();
          setPendingRequests(pending);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isOwnProfile]);

  const handleSendRequest = async () => {
    try {
      setIsSendingRequest(true);
      await sendFriendRequest(userId);
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error('Failed to send friend request');
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success('Friend request accepted!');
      setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      toast.success('Friend request rejected');
      setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return <div className='text-center text-white py-8'>Loading profile...</div>;
  }

  if (!stats) {
    return <div className='text-center text-white py-8'>Profile not found</div>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Profile Header */}
        <div className='bg-slate-700/50 rounded-lg p-8 mb-6 border border-slate-600'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-center gap-6'>
              <img
                src={stats.profilePic}
                alt={stats.username}
                className='w-24 h-24 rounded-full border-4 border-blue-500'
              />
              <div>
                <h1 className='text-4xl font-bold text-white'>{stats.username}</h1>
                <p className='text-slate-400 mt-1'>Joined recently</p>
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={handleSendRequest}
                disabled={isSendingRequest}
                className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50'
              >
                {isSendingRequest ? 'Sending...' : 'Add Friend'}
              </button>
            )}
          </div>

          {/* Streak */}
          <div className='flex items-center gap-2 text-xl text-orange-400 font-bold'>
            <Flame size={28} />
            {stats.streak} Day Streak
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          {/* Total Stats */}
          <div className='bg-slate-700/50 rounded-lg p-6 border border-slate-600'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <TrendingUp size={24} /> Overall Stats
            </h2>
            <div className='space-y-3'>
              <div className='flex justify-between text-slate-300'>
                <span>Problems Solved:</span>
                <span className='text-white font-bold'>{stats.totalProblems}</span>
              </div>
              <div className='flex justify-between text-slate-300'>
                <span>Total Submissions:</span>
                <span className='text-white font-bold'>{stats.totalSubmissions}</span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className='bg-slate-700/50 rounded-lg p-6 border border-slate-600'>
            <h2 className='text-xl font-bold text-white mb-4'>Difficulty Breakdown</h2>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-300'>Easy</span>
                <div className='flex items-center gap-2'>
                  <div className='w-32 bg-slate-600 rounded-full h-2'>
                    <div
                      className='bg-green-500 h-2 rounded-full'
                      style={{
                        width: `${stats.totalProblems > 0 ? (stats.difficultyBreakdown.easy / stats.totalProblems) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className='text-white font-semibold min-w-[3rem]'>{stats.difficultyBreakdown.easy}</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-300'>Medium</span>
                <div className='flex items-center gap-2'>
                  <div className='w-32 bg-slate-600 rounded-full h-2'>
                    <div
                      className='bg-yellow-500 h-2 rounded-full'
                      style={{
                        width: `${stats.totalProblems > 0 ? (stats.difficultyBreakdown.medium / stats.totalProblems) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className='text-white font-semibold min-w-[3rem]'>{stats.difficultyBreakdown.medium}</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-300'>Hard</span>
                <div className='flex items-center gap-2'>
                  <div className='w-32 bg-slate-600 rounded-full h-2'>
                    <div
                      className='bg-red-500 h-2 rounded-full'
                      style={{
                        width: `${stats.totalProblems > 0 ? (stats.difficultyBreakdown.hard / stats.totalProblems) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className='text-white font-semibold min-w-[3rem]'>{stats.difficultyBreakdown.hard}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests - Only for own profile */}
        {isOwnProfile && pendingRequests.length > 0 && (
          <div className='bg-slate-700/50 rounded-lg p-6 border border-slate-600 mb-6'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <Mail size={24} /> Friend Requests ({pendingRequests.length})
            </h2>
            <div className='space-y-3'>
              {pendingRequests.map(request => (
                <div key={request._id} className='flex items-center justify-between bg-slate-600/50 p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={request.sender.profilePic}
                      alt={request.sender.username}
                      className='w-10 h-10 rounded-full'
                    />
                    <div>
                      <p className='text-white font-semibold'>{request.sender.username}</p>
                      <p className='text-slate-400 text-sm'>{request.sender.email}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition'
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition'
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className='bg-slate-700/50 rounded-lg p-6 border border-slate-600 mb-6'>
          <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
            <Users size={24} /> Friends ({friends.length})
          </h2>
          {friends.length === 0 ? (
            <p className='text-slate-400'>No friends yet. Start by adding some!</p>
          ) : (
            <div className='grid md:grid-cols-2 gap-4'>
              {friends.map(friend => (
                <div key={friend._id} className='flex items-center gap-3 bg-slate-600/50 p-4 rounded-lg'>
                  <img
                    src={friend.profilePic}
                    alt={friend.username}
                    className='w-12 h-12 rounded-full'
                  />
                  <div className='flex-1'>
                    <p className='text-white font-semibold'>{friend.username}</p>
                    <p className='text-slate-400 text-sm'>{friend.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        {stats.lastSubmissions && stats.lastSubmissions.length > 0 && (
          <div className='bg-slate-700/50 rounded-lg p-6 border border-slate-600'>
            <h2 className='text-xl font-bold text-white mb-4'>Recent Submissions</h2>
            <div className='space-y-3'>
              {stats.lastSubmissions.map((submission, idx) => (
                <div key={idx} className='flex items-center justify-between bg-slate-600/50 p-4 rounded-lg'>
                  <div className='flex-1'>
                    <p className='text-white font-semibold'>{submission.problemId.problem_name}</p>
                    <p className='text-slate-400 text-sm'>
                      {new Date(submission.submissionTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      submission.result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {submission.result.status.toUpperCase()}
                    </span>
                    <span className='text-slate-400 text-sm'>{submission.problemId.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
