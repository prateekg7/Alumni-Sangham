import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Sarah Chen',
    avatar: 'SC',
    title: 'AI in Product Management',
    excerpt: 'How AI is transforming the way we approach product strategy and user research...',
    upvotes: 234,
    downvotes: 12,
    comments: 45,
    userVoted: null,
  },
  {
    id: 2,
    author: 'Michael Johnson',
    avatar: 'MJ',
    title: 'Career Transition Tips',
    excerpt: 'My journey from engineering to product management and lessons learned along the way...',
    upvotes: 189,
    downvotes: 8,
    comments: 32,
    userVoted: null,
  },
];

export default function DiscoverCard() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);

  const handleVote = (postId, voteType) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        if (post.userVoted === voteType) {
          return {
            ...post,
            upvotes: voteType === 'up' ? post.upvotes - 1 : post.upvotes,
            downvotes: voteType === 'down' ? post.downvotes - 1 : post.downvotes,
            userVoted: null,
          };
        } else if (post.userVoted === null) {
          return {
            ...post,
            upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
            downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes,
            userVoted: voteType,
          };
        } else {
          return {
            ...post,
            upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes - 1,
            downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes - 1,
            userVoted: voteType,
          };
        }
      }
      return post;
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6 shadow-xl border border-gray-100">
      <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Discover</h3>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm font-bold text-black">{post.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black leading-tight">{post.author}</p>
                <p className="text-xs text-gray-500 font-light mt-0.5">Just now</p>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-bold text-black mb-1.5 leading-snug">{post.title}</h4>
              <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleVote(post.id, 'up')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  post.userVoted === 'up'
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes}</span>
              </button>
              <button
                onClick={() => handleVote(post.id, 'down')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  post.userVoted === 'down'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{post.downvotes}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100 transition-all">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
