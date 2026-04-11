import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ThumbsUp, ArrowRight, ArrowLeft, Clock, Calendar, User, PenLine, History, Briefcase, MapPin, ExternalLink, Send, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';
import { fetchBlogFeed, fetchBlogBySlug, createBlogPost, toggleBlogLike, addBlogComment, fetchAdjacentPosts } from '../lib/api';

/* ───────────────────── recent posts helpers ───────────────────── */

const RECENT_POSTS_KEY = 'alumni-blog-recent-posts';

function getRecentPosts() {
  try {
    const raw = localStorage.getItem(RECENT_POSTS_KEY);
    if (!raw) return [];
    const posts = JSON.parse(raw);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    // Filter out posts viewed more than 7 days ago
    const valid = posts.filter(p => now - p.visitedAt < sevenDaysMs);
    
    // Update storage if we purged any stale entries
    if (valid.length !== posts.length) {
      localStorage.setItem(RECENT_POSTS_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

function addRecentPost(blog) {
  const existing = getRecentPosts().filter((p) => p.slug !== blog.slug);
  const entry = { slug: blog.slug, title: blog.title, author: blog.authorName, date: new Date(blog.createdAt).toLocaleDateString(), visitedAt: Date.now() };
  const updated = [entry, ...existing].slice(0, 15);
  localStorage.setItem(RECENT_POSTS_KEY, JSON.stringify(updated));
  return updated;
}

/* ───────────────────────── sub-components ───────────────────────── */

function HeroBanner() {
  return (
    <div
      className="w-full px-8 py-14 md:px-16 md:py-20"
      style={{ background: '#facc15' }}
    >
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl lg:text-6xl leading-tight">
        The Alumni{' '}
        <span className="text-white">Blog & Jobs</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg font-medium">
        Stories, insights, knowledge, and career opportunities shared by the community. 
      </p>
    </div>
  );
}

function SearchBar({ value, onChange }) {
  const [localVal, setLocalVal] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localVal);
    }, 500);
    return () => clearTimeout(timer);
  }, [localVal, onChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
      <input
        type="text"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        placeholder="Search articles and jobs..."
        className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] py-3.5 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all focus:border-[#facc15]/50 focus:ring-1 focus:ring-[#facc15]/30 text-sm"
      />
    </div>
  );
}

function FilterPills({ activeType, onSelectType, activePeriod, onSelectPeriod }) {
  const types = ['All', 'Blogs', 'Jobs'];
  const periods = ['All Time', 'Today', 'This Week', 'This Month', '3 Months'];

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
      {/* Type Filter */}
      <div className="flex bg-[#1a1a2e] border border-white/10 rounded-xl p-1 w-max">
        {types.map(t => (
          <button
            key={t}
            onClick={() => onSelectType(t)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeType === t ? 'bg-[#facc15] text-black shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Period Filter */}
      <select 
        value={activePeriod}
        onChange={(e) => onSelectPeriod(e.target.value)}
        className="bg-[#1a1a2e] border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-[#facc15]/50 transition-colors"
      >
        {periods.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}

function BlogCard({ blog, onLike, currentUserId }) {
  const isJob = blog.postType === 'job';
  const hasLiked = blog.likes?.includes(currentUserId);

  return (
    <article className="group relative rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 min-h-[160px]">
      
      {/* Badge depending on type */}
      {isJob ? (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <Briefcase className="h-3 w-3" /> Job Posting
        </div>
      ) : (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <PenLine className="h-3 w-3" /> Blog Post
        </div>
      )}

      {/* top */}
      <div className="pr-24">
        <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        <h3 className="mt-2 text-xl font-black text-gray-900 leading-snug group-hover:text-[#eab308] transition-colors duration-200 line-clamp-2">
          {blog.title}
        </h3>

        {isJob && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
              <Briefcase className="w-3 h-3 text-gray-500" /> {blog.company}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              <MapPin className="w-3 h-3 text-gray-400" /> {blog.location}
            </span>
          </div>
        )}

        <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2 whitespace-pre-wrap">
          {blog.body}
        </p>
      </div>

      {/* author row */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold bg-[#facc15] text-black">
          {blog.authorName ? blog.authorName[0].toUpperCase() : 'A'}
        </div>
        <div className="min-w-0 flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate">{blog.authorName}</p>
            <p className="text-xs text-gray-400">{blog.authorMeta || "Alumni"}</p>
          </div>
          {!isJob && (
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Clock className="h-3 w-3 text-gray-300" />
              {blog.readTime} min read
            </p>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onLike(blog._id); }}
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${hasLiked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{blog.likes?.length || 0}</span>
          </button>
          
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
            <MessageSquare className="h-4 w-4" />
            <span>{blog.commentsCount || 0}</span>
          </div>
        </div>

        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#eab308] transition-all hover:gap-2"
        >
          Read Details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

/* ───────────────────── blog detail view ───────────────────── */

function renderMarkdownContent(text) {
  // Simple markdown-like rendering for bold text and paragraphs
  const lines = text.split('\n');
  const elements = [];
  let currentParagraph = [];

  const processInline = (line, idx) => {
    // Handle **bold** text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${idx}-${i}`} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={elements.length} className="text-[16px] leading-8 text-gray-700 mb-5">
          {currentParagraph}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      return;
    }

    // Headings
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-xl font-bold text-gray-900 mt-8 mb-4">
          {trimmed.slice(2, -2)}
        </h3>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const content = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={elements.length} className="flex gap-3 py-1.5 pl-2 mb-2">
          <span className="text-[#eab308] font-bold text-sm mt-0.5">{trimmed.match(/^\d+/)[0]}.</span>
          <p className="text-[16px] leading-7 text-gray-700">{processInline(content, idx)}</p>
        </div>
      );
      return;
    }

    // Bullet lists
    if (trimmed.startsWith('- ')) {
      flushParagraph();
      const content = trimmed.slice(2);
      elements.push(
        <div key={elements.length} className="flex gap-3 py-1.5 pl-2 mb-2">
          <span className="text-[#eab308] font-black mt-0.5">•</span>
          <p className="text-[16px] leading-7 text-gray-700">{processInline(content, idx)}</p>
        </div>
      );
      return;
    }

    // Regular text
    if (currentParagraph.length > 0) {
      currentParagraph.push(' ');
    }
    currentParagraph.push(...processInline(trimmed, idx));
  });

  flushParagraph();
  return elements;
}

export function BlogDetailPage() {
  const { user } = useOutletContext();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjacent, setAdjacent] = useState({ next: null, previous: null });
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBlogBySlug(slug);
        if (mounted) {
          setBlog(res);
          addRecentPost(res);
          
          // fetch adjacent
          const adj = await fetchAdjacentPosts(res._id);
          setAdjacent(adj);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  const handleLike = async () => {
    if (!blog) return;
    try {
      const res = await toggleBlogLike(blog._id);
      setBlog(prev => {
        const _likes = [...(prev.likes || [])];
        if (res.liked) {
          _likes.push(user.id);
        } else {
          const idx = _likes.indexOf(user.id);
          if (idx !== -1) _likes.splice(idx, 1);
        }
        return { ...prev, likes: _likes };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    setCommentError('');
    try {
      const res = await addBlogComment(blog._id, commentText);
      setBlog(prev => ({ ...prev, comments: res, commentsCount: res.length }));
      setCommentText('');
    } catch (err) {
      setCommentError(err.message || 'Could not post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden bg-[#101010] text-white font-roboto">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#facc15]/20 border-t-[#facc15] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden bg-[#101010] text-white font-roboto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold text-white mb-2">Post not found</h2>
            <p className="text-white/50 mb-6">The article or job you're looking for doesn't exist.</p>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#facc15] px-6 py-3 text-sm font-bold text-black transition-all hover:bg-[#e0bb00]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isJob = blog.postType === 'job';
  const hasLiked = blog.likes?.includes(user.id);
  const wordCount = commentText.trim() ? commentText.trim().split(/\s+/).length : 0;
  const userCommentsObj = (blog.comments || []).filter(c => c.userId === user.id || (c.userId && c.userId._id === user.id));
  const userCommentCount = userCommentsObj.length;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#101010] text-white font-roboto">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Back navigation bar */}
          <div className="sticky top-0 z-20 bg-[#101010]/90 backdrop-blur-md border-b border-white/5 px-8 pt-4 pb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[#facc15]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </button>
            
            {/* Quick like button in header */}
            <button
               onClick={handleLike}
               className={`hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${hasLiked ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
            >
              <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
              {hasLiked ? 'Liked' : 'Like'} ({blog.likes?.length || 0})
            </button>
          </div>

          {/* Main content wrapper */}
          <div className="px-5 py-8 md:px-10 lg:px-12 max-w-[850px] mx-auto">
            
            {isJob ? (
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <Briefcase className="h-3.5 w-3.5" /> Job Opportunity
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-[#facc15] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <PenLine className="h-3.5 w-3.5" /> Read Time: {blog.readTime} min
              </div>
            )}

            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-[54px] leading-[1.1]">
              {blog.title}
            </h1>

            {/* Author / Meta Block */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-y border-white/10">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold bg-[#facc15] text-black">
                  {blog.authorName ? blog.authorName[0].toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="text-base font-bold text-white">{blog.authorName}</p>
                  <p className="text-sm font-medium text-white/40">{blog.authorMeta || "Alumni"}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-white/40 font-medium">Published on</p>
                <p className="text-base font-semibold text-white/80">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* If it's a job, show job info box */}
            {isJob && (
              <div className="mt-8 rounded-2xl bg-[#1a1a2e] border border-blue-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-x-12 gap-y-4">
                  <div>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-1.5">Company</p>
                    <p className="text-[17px] font-bold text-white flex items-center gap-2"><Briefcase className="w-4 h-4 text-white/40"/> {blog.company}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-1.5">Location</p>
                    <p className="text-[17px] font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40"/> {blog.location}</p>
                  </div>
                </div>
                {blog.applyLink && (
                  <a 
                    href={blog.applyLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)]"
                  >
                    Apply Externally <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* White article card for body */}
            <div className="mt-8 rounded-3xl bg-white p-8 md:p-12 text-black shadow-xl">
              <div className="blog-detail-body">
                {renderMarkdownContent(blog.body)}
              </div>
              
              {/* Bottom Like Section */}
              <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button
                   onClick={handleLike}
                   className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[15px] font-bold transition-all border-2 ${hasLiked ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700'}`}
                >
                  <ThumbsUp className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
                  {blog.likes?.length || 0} Likes
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12 rounded-2xl bg-[#1a1a2e] border border-white/10 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#facc15]" /> Comments ({blog.commentsCount || 0})
              </h2>

              {/* Comment Composer */}
              <div className="mb-8">
                {userCommentCount >= 2 ? (
                  <div className="p-4 bg-white/5 disabled border border-white/10 rounded-xl text-center">
                    <p className="text-sm text-white/60 font-medium">You have reached the maximum of 2 comments per post.</p>
                  </div>
                ) : (blog.comments?.length >= 100) ? (
                  <div className="p-4 bg-white/5 disabled border border-white/10 rounded-xl text-center">
                    <p className="text-sm text-white/60 font-medium">This post has reached the maximum of 100 comments.</p>
                  </div>
                ) : (
                  <div className="bg-[#101010] border border-white/10 rounded-xl p-4 focus-within:border-[#facc15]/40 transition-colors">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts... (Max 200 words)"
                      className="w-full bg-transparent text-white placeholder-white/30 text-[15px] leading-relaxed resize-none h-24 outline-none"
                    />
                    {commentError && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {commentError}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                      <div className="text-xs font-semibold">
                        <span className={wordCount > 200 ? 'text-red-400' : 'text-white/40'}>
                          {wordCount}/200 words
                        </span>
                        <span className="mx-2 text-white/20">•</span>
                        <span className="text-white/40">
                          {2 - userCommentCount} comment(s) left for you
                        </span>
                      </div>
                      <button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || wordCount > 200 || submittingComment}
                        className="bg-[#facc15] hover:bg-[#e0bb00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-1.5 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'} <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comment List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {!blog.comments || blog.comments.length === 0 ? (
                  <p className="text-center text-white/40 text-sm py-4">No comments yet. Be the first!</p>
                ) : (
                  [...(blog.comments)].reverse().map((cmd, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold bg-white/10 text-white">
                        {cmd.userName ? cmd.userName[0].toUpperCase() : 'A'}
                      </div>
                      <div className="flex-1 bg-[#101010] border border-white/5 rounded-2xl rounded-tl-none p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-white">{cmd.userName}</p>
                          <p className="text-[11px] text-white/40 font-medium tracking-wide">
                            {new Date(cmd.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                        <p className="text-[15px] text-white/80 leading-relaxed whitespace-pre-wrap">{cmd.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Next/Prev Navigation */}
            <div className="mt-12 border-t border-white/10 pt-10 flex flex-col sm:flex-row gap-6 justify-between">
              {adjacent?.previous ? (
                <Link to={`/blog/${adjacent.previous.slug}`} className="flex-1 block group rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Post
                    </span>
                    <span className="text-[12px] text-gray-400 font-medium tracking-wide">
                      {new Date(adjacent.previous.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {adjacent.previous.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {adjacent.previous.body ? adjacent.previous.body.substring(0, 100) + '...' : "Read article..."}
                  </p>
                </Link>
              ) : <div className="flex-1"></div>}
              
              {adjacent?.next ? (
                <Link to={`/blog/${adjacent.next.slug}`} className="flex-1 block group rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 min-w-0">
                  <div className="flex items-center justify-end gap-3 mb-3">
                    <span className="text-[12px] text-gray-400 font-medium tracking-wide">
                      {new Date(adjacent.next.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      Next Post <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-snug group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2 text-right">
                    {adjacent.next.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2 text-right">
                    {adjacent.next.body ? adjacent.next.body.substring(0, 100) + '...' : "Read article..."}
                  </p>
                </Link>
              ) : <div className="flex-1"></div>}
            </div>

          </div>

          <div className="h-16" />
        </div>
      </div>
  );
}

/* ───────────── create post composer (alumni only) ───────────── */

function CreatePostComposer({ user, onPost }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isJob, setIsJob] = useState(false);
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = title.trim() && text.trim() && (!isJob || (company.trim() && location.trim() && applyLink.trim()));

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await onPost({
        postType: isJob ? 'job' : 'article',
        title: title.trim(),
        description: text.trim(),
        company: isJob ? company.trim() : '',
        location: isJob ? location.trim() : '',
        applyLink: isJob ? applyLink.trim() : ''
      });
      // reset
      setTitle('');
      setText('');
      setCompany('');
      setLocation('');
      setApplyLink('');
      setIsJob(false);
      setExpanded(false);
    } catch (err) {
      setError(err.message || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 rounded-2xl bg-[#1a1a2e] border border-white/10 p-4 text-left transition-all hover:border-[#facc15]/30 shadow-lg"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#facc15] text-sm font-bold text-black">
          {user.initials || user.name?.[0] || 'A'}
        </div>
        <span className="text-[15px] font-medium text-white/50">Share an insightful article or a job opportunity...</span>
        <PenLine className="ml-auto h-5 w-5 text-white/30" />
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-white/20 p-5 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#facc15] text-sm font-bold text-black">
            {user.initials || user.name?.[0] || 'A'}
          </div>
          <div>
            <p className="text-[15px] font-bold text-white tracking-wide">{user.name}</p>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Alumni Contributor</p>
          </div>
        </div>
        
        {/* Toggle Job vs Blog */}
        <label className="flex items-center cursor-pointer bg-[#010101] p-1 rounded-full border border-white/10">
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${!isJob ? 'bg-[#facc15] text-black shadow-md' : 'text-white/40'}`} onClick={() => setIsJob(false)}>Blog Post</div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isJob ? 'bg-blue-500 text-white shadow-md' : 'text-white/40'}`} onClick={() => setIsJob(true)}>Job Post</div>
        </label>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={isJob ? "Job Title (e.g. Senior Frontend Engineer)" : "Catchy Article Title"}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d17] px-4 py-3 text-[15px] font-semibold text-white placeholder-white/30 outline-none focus:border-[#facc15]/40 mb-3 transition-colors"
      />
      
      {isJob && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name"
            className="w-full rounded-xl border border-white/10 bg-[#0d0d17] px-4 py-3 text-[14px] text-white placeholder-white/30 outline-none focus:border-blue-500/40 transition-colors"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Remote, Bangalore)"
            className="w-full rounded-xl border border-white/10 bg-[#0d0d17] px-4 py-3 text-[14px] text-white placeholder-white/30 outline-none focus:border-blue-500/40 transition-colors"
          />
          <input
            type="url"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
            placeholder="External Apply Link URL (https://...)"
            className="w-full sm:col-span-2 rounded-xl border border-white/10 bg-[#0d0d17] px-4 py-3 text-[14px] text-white placeholder-white/30 outline-none focus:border-blue-500/40 transition-colors"
          />
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={isJob ? "Provide a brief job description, requirements, and any perks..." : "Write your article using basic markdown format (**bold text**, bullet points)..."}
        className="w-full rounded-xl border border-white/10 bg-[#0d0d17] px-4 py-3 text-[15px] leading-relaxed text-white placeholder-white/30 outline-none resize-y focus:border-[#facc15]/40 transition-colors"
      />

      {error && <p className="mt-3 text-sm text-red-400 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {error}</p>}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-white/30 hidden sm:block">Posts are immediately visible to the network.</p>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all disabled:opacity-40 select-none flex items-center gap-2 ${isJob ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#facc15] hover:bg-[#e0bb00] text-black'}`}
          >
            {submitting ? 'Publishing...' : 'Publish'} <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── recent posts sidebar ───────────── */

function RecentPostsSidebar() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    setRecentPosts(getRecentPosts());

    // Listen for storage changes 
    const interval = setInterval(() => {
      setRecentPosts(getRecentPosts());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatVisitedTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="sticky top-0">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-[#facc15]" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recently Viewed</h3>
      </div>

      {recentPosts.length === 0 ? (
        <div className="rounded-xl bg-[#1a1a2e] border border-white/8 p-4 text-center">
          <p className="text-xs font-semibold text-white/50 mb-1">No history</p>
          <p className="text-[11px] text-white/30">Articles you read will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recentPosts.map((post) => (
            <Link
              key={`${post.slug}-${post.visitedAt}`}
              to={`/blog/${post.slug}`}
              className="group flex gap-3 rounded-xl bg-[#1a1a2e] border border-white/6 p-3 transition-all hover:border-[#facc15]/20 hover:bg-[#1e1e35]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/80 leading-snug group-hover:text-[#facc15] transition-colors line-clamp-2">
                  {post.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-medium truncate pr-2">{post.author}</span>
                  <span className="text-[9px] text-white/20 uppercase tracking-widest whitespace-nowrap">{formatVisitedTime(post.visitedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── main listing page ───────────────────────── */

export function BlogsPage() {
  const { user } = useOutletContext();
  
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activePeriod, setActivePeriod] = useState('All Time');
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = React.useRef(null);

  useEffect(() => {
    if (!loading && scrollRef.current) {
      const saved = sessionStorage.getItem('alumni-blog-scroll');
      if (saved) {
        // use setTimeout or small delay to ensure DOM is fully painted
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = parseInt(saved, 10);
          }
        }, 50);
      }
    }
  }, [loading]);

  const handleScroll = (e) => {
    sessionStorage.setItem('alumni-blog-scroll', e.target.scrollTop);
  };

  const isAlumni = user?.role === 'alumni' || user?.role === 'Alumni';

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBlogFeed({ search, type: activeType, period: activePeriod });
      setBlogs(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, activeType, activePeriod]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleLike = async (id) => {
    try {
      const res = await toggleBlogLike(id);
      setBlogs((prev) =>
        prev.map((b) => {
          if (b._id === id) {
            const _likes = [...(b.likes || [])];
            if (res.liked) {
              _likes.push(user.id);
            } else {
              const idx = _likes.indexOf(user.id);
              if (idx !== -1) _likes.splice(idx, 1);
            }
            return { ...b, likes: _likes };
          }
          return b;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (formData) => {
    await createBlogPost({
      postType: formData.postType,
      title: formData.title,
      body: formData.description,
      company: formData.company,
      location: formData.location,
      applyLink: formData.applyLink
    });
    // reload feed
    loadFeed();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#101010] text-white font-roboto">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20" ref={scrollRef} onScroll={handleScroll}>
          <HeroBanner />

          <div className="flex gap-6 px-6 py-8 md:px-10 lg:px-12 max-w-[1300px] mx-auto">

            {/* Left: Blog feed (~75%) */}
            <div className="flex-1 min-w-0">
              
              <div className="flex flex-col gap-4">
                <SearchBar value={search} onChange={setSearch} />
                <FilterPills 
                  activeType={activeType} onSelectType={setActiveType}
                  activePeriod={activePeriod} onSelectPeriod={setActivePeriod} 
                />
              </div>

              {/* Create post — alumni only */}
              {isAlumni && (
                <div className="mt-6 mb-2">
                  <CreatePostComposer user={user} onPost={handlePost} />
                </div>
              )}

              {/* Blog list */}
              <div className="mt-8 flex flex-col gap-6">
                {loading ? (
                  <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-[#facc15] rounded-full animate-spin" />
                  </div>
                ) : blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} onLike={handleLike} currentUserId={user.id} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center bg-[#1a1a2e] border border-white/5 rounded-3xl">
                    <div className="mb-5 p-4 bg-white/5 rounded-full"><FileText className="w-8 h-8 text-white/30" /></div>
                    <p className="text-xl font-bold text-white/80">No posts found</p>
                    <p className="mt-2 text-[15px] font-medium text-white/40 max-w-sm">
                      We couldn't find any articles or jobs matching your current filters.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Recent Posts sidebar (~25%) */}
            <div className="hidden lg:block w-[280px] flex-shrink-0 pt-2">
              <RecentPostsSidebar />
            </div>

          </div>
        </div>
      </div>
  );
}
