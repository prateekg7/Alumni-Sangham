import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import { ThumbsUp, ArrowRight, ArrowLeft, Clock, PenLine, History, Briefcase, MapPin, ExternalLink, Send, MessageSquare, AlertCircle, FileText, ChevronDown, X } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '../components/ui/placeholders-and-vanish-input';
import BorderGlow from '../components/ui/border-glow';
import { StatefulButton } from '../components/ui/stateful-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { fetchBlogFeed, fetchBlogBySlug, createBlogPost, toggleBlogLike, addBlogComment, fetchAdjacentPosts } from '../lib/api';
import blogHero from '../assets/blogHero.svg';

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
    <div className="relative min-h-[360px] overflow-hidden rounded-[8px]">
      <img src={blogHero} alt="Alumni blog and jobs" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/42" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <div className="max-w-3xl rounded-[8px] bg-black p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Blogs & Jobs</div>
          <h1 className="mt-4 text-4xl font-black leading-none tracking-normal text-white md:text-6xl">
            Read alumni stories, job drops, and campus notes.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Browse writing from alumni, discover referral-worthy roles, and keep track of posts you recently opened.
          </p>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }) {
  const placeholders = [
    'Search alumni stories, jobs, or companies',
    'Find referral posts from product alumni',
    'Search backend roles in Bengaluru',
    'Look for resume advice or hiring notes',
    'Find articles by title, author, or topic',
  ];

  return (
    <div className="relative w-full">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSubmit={(event) => event.preventDefault()}
        className="max-w-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/38 transition hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
          Clear search
        </button>
      ) : null}
    </div>
  );
}

function FilterPills({ activeType, onSelectType, activePeriod, onSelectPeriod }) {
  const types = ['All', 'Blogs', 'Jobs'];
  const periods = ['All Time', 'Today', 'This Week', 'This Month', '3 Months'];

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
      {/* Type Filter */}
      <div className="flex w-max rounded-[8px] border border-[#f5eee8]/20 bg-[#111] p-1">
        {types.map(t => (
          <button
            key={t}
            onClick={() => onSelectType(t)}
            className={`rounded-[6px] px-4 py-1.5 text-sm font-semibold transition-all ${activeType === t ? 'bg-[#f5eee8] text-black' : 'text-[#f5eee8]/50 hover:text-[#f5eee8]'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Period Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 min-w-[160px] items-center justify-between gap-2 rounded-[8px] border border-[#f5eee8]/20 bg-[#111] px-4 text-sm font-semibold text-[#f5eee8] outline-none transition hover:bg-[#171717]"
          >
            {activePeriod}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
          {periods.map((period) => (
            <DropdownMenuItem
              key={period}
              onSelect={() => onSelectPeriod(period)}
              className={activePeriod === period ? 'bg-[#f5eee8] text-black' : ''}
            >
              {period}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function BlogCard({ blog, onLike, currentUserId }) {
  const isJob = blog.postType === 'job';
  const hasLiked = blog.likes?.includes(currentUserId);

  return (
    <BorderGlow className="h-full">
      <article className="group relative min-h-[160px] rounded-[24px] bg-[#f5eee8] p-6 transition-transform duration-300 hover:-translate-y-0.5">
      
        {/* Badge depending on type */}
        {isJob ? (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Briefcase className="h-3 w-3" /> Job Posting
          </div>
        ) : (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-700">
            <PenLine className="h-3 w-3" /> Blog Post
          </div>
        )}

        {/* top */}
        <div className="pr-24">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#8e6cf3]">
            {blog.title}
          </h3>

          {isJob && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                <Briefcase className="h-3 w-3 text-gray-500" /> {blog.company}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                <MapPin className="h-3 w-3 text-gray-400" /> {blog.location}
              </span>
            </div>
          )}

          <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-500">
            {blog.body}
          </p>
        </div>

        {/* author row */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0f0f0f] text-sm font-bold text-[#f5eee8]">
            {blog.authorName ? blog.authorName[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1 flex items-center justify-between">
            <div>
              <p className="truncate text-sm font-semibold text-gray-800">{blog.authorName}</p>
              <p className="text-xs text-gray-400">{blog.authorMeta || 'Alumni'}</p>
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
        <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onLike(blog._id);
              }}
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
            className="inline-flex items-center gap-1 text-sm font-bold text-[#8e6cf3] transition-all hover:gap-2"
          >
            Read Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </BorderGlow>
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
        return <strong key={`${idx}-${i}`} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={elements.length} className="text-[17px] leading-8 text-white/80 mb-6">
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
        <h3 key={elements.length} className="text-2xl font-bold text-white mt-10 mb-5">
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
          <span className="text-[#facc15] font-bold text-sm mt-0.5">{trimmed.match(/^\d+/)[0]}.</span>
          <p className="text-[17px] leading-7 text-white/80">{processInline(content, idx)}</p>
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
          <span className="text-[#facc15] font-black mt-0.5">•</span>
          <p className="text-[17px] leading-7 text-white/80">{processInline(content, idx)}</p>
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
          <div className="sticky top-0 z-20 bg-[#101010]/90 backdrop-blur-md px-8 pt-6 pb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[#facc15]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </button>
          </div>

          {/* Main content wrapper */}
          <div className="px-5 py-8 md:px-10 lg:px-12 max-w-[850px] mx-auto">
            
            {isJob ? (
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <Briefcase className="h-3.5 w-3.5" /> Job Opportunity
              </div>
            ) : (
              <div className="mb-8 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-[#facc15]/50" />
                <div className="text-[11px] font-bold tracking-[0.25em] text-[#facc15] uppercase">
                  Read Time: {blog.readTime} min
                </div>
              </div>
            )}

            <h1 className="text-5xl font-serif tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.05]">
              {blog.title}
            </h1>

            {/* Author / Meta Block */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold bg-[#eab308] text-black">
                {blog.authorName ? blog.authorName[0].toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-[17px] font-bold text-white">{blog.authorName}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                  <span>{blog.authorMeta || "Alumni"}</span>
                  <span>•</span>
                  <span>Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 h-[1px] w-full bg-white/5" />

            {/* Article body - now integrated into dark theme */}
            <div className="mt-12">
              <div className="blog-detail-body max-w-none">
                {renderMarkdownContent(blog.body)}
              </div>
              
              {/* Bottom Like Section */}
              <div className="mt-16 flex items-center justify-between">
                <button
                   onClick={handleLike}
                   className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all border ${hasLiked ? 'border-[#eab308] bg-[#eab308]/10 text-[#eab308]' : 'border-white/10 hover:border-white/25 text-white/60'}`}
                >
                   <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                   {blog.likes?.length || 0} Likes
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-serif text-[#eab308] mb-10 text-center">
                Comments ({blog.commentsCount || 0})
              </h2>

              {/* Comment Composer */}
              <div className="mb-10">
                {userCommentCount >= 2 ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-sm text-white/60 font-medium">You have reached the maximum of 2 comments per post.</p>
                  </div>
                ) : (blog.comments?.length >= 100) ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-sm text-white/60 font-medium">This post has reached the maximum of 100 comments.</p>
                  </div>
                ) : (
                  <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 focus-within:border-[#eab308]/40 transition-colors">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts... (Max 200 words)"
                      className="w-full bg-transparent text-white placeholder-white/20 text-[16px] leading-relaxed resize-none h-32 outline-none"
                    />
                    {commentError && (
                      <p className="text-red-400 text-sm mt-3 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {commentError}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-white/30">
                        <span className={wordCount > 200 ? 'text-red-400' : ''}>
                          {wordCount}/200 words
                        </span>
                        <span className="mx-3 text-white/10">•</span>
                        <span>
                          {2 - userCommentCount} comment(s) left
                        </span>
                      </div>
                      <button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || wordCount > 200 || submittingComment}
                        className="bg-[#eab308] hover:bg-[#eab308]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 text-sm transition-all"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'} <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comment List */}
              <div className="space-y-8">
                {!blog.comments || blog.comments.length === 0 ? (
                  <p className="text-center text-white/30 text-sm py-10 italic">No comments yet. Be the first!</p>
                ) : (
                  [...(blog.comments)].reverse().map((cmd, i) => (
                    <div key={i} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/10 ring-4 ring-transparent group-hover:ring-[#eab308]/5 transition-all">
                        {cmd.userName ? cmd.userName[0].toUpperCase() : 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl rounded-tl-none p-5 transition-all hover:bg-white/[0.06] hover:border-white/10 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-[14px] font-bold text-white group-hover:text-[#eab308] transition-colors">{cmd.userName}</p>
                              <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider">{cmd.userMeta || "Alumni Member"}</p>
                            </div>
                            <p className="text-[11px] text-white/20 font-medium whitespace-nowrap ml-4">
                              {new Date(cmd.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                            </p>
                          </div>
                          <p className="text-[15px] text-white/70 leading-relaxed font-normal">{cmd.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 ml-1">
                          <button className="text-[11px] font-bold text-white/30 hover:text-[#eab308] transition-colors uppercase tracking-widest">Like</button>
                          <button className="text-[11px] font-bold text-white/30 hover:text-[#eab308] transition-colors uppercase tracking-widest">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Next/Prev Navigation */}
            <div className="mt-20 border-t border-white/5 pt-12 flex flex-col sm:flex-row gap-6 justify-between">
              {adjacent?.previous ? (
                <Link to={`/blog/${adjacent.previous.slug}`} className="flex-1 block group rounded-2xl bg-white/5 border border-white/5 p-6 transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-[#eab308] text-[11px] font-bold tracking-[0.15em] uppercase">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Post
                    </span>
                    {adjacent.previous.createdAt && (
                      <span className="text-[11px] text-white/20 font-medium uppercase tracking-wider">
                        {new Date(adjacent.previous.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-serif text-white leading-snug group-hover:text-[#eab308] transition-colors duration-200 line-clamp-2">
                    {adjacent.previous.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40 line-clamp-2">
                    Read article...
                  </p>
                </Link>
              ) : <div className="flex-1"></div>}
              
              {adjacent?.next ? (
                <Link to={`/blog/${adjacent.next.slug}`} className="flex-1 block group rounded-2xl bg-white/5 border border-white/5 p-6 transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {adjacent.next.createdAt && (
                      <span className="text-[11px] text-white/20 font-medium uppercase tracking-wider">
                        {new Date(adjacent.next.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-[#eab308] text-[11px] font-bold tracking-[0.15em] uppercase">
                      Next Post <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-white leading-snug group-hover:text-[#eab308] transition-colors duration-200 line-clamp-2 text-right">
                    {adjacent.next.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40 line-clamp-2 text-right">
                    Read article...
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
  const [publishComplete, setPublishComplete] = useState(false);

  useEffect(() => {
    if (!publishComplete) return undefined;

    const timeout = window.setTimeout(() => {
      setExpanded(false);
      setPublishComplete(false);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [publishComplete]);

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
      setPublishComplete(true);
    } catch (err) {
      setError(err.message || 'Failed to post');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center gap-4 border-y border-white/10 py-5 text-left transition hover:border-[#f5eee8]/45"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f5eee8] text-sm font-bold text-black">
          {user.initials || user.name?.[0] || 'A'}
        </div>
        <span className="text-[15px] font-medium text-white/50">Share an insightful article or a job opportunity...</span>
        <PenLine className="ml-auto h-5 w-5 text-[#f5eee8]/55" />
      </button>
    );
  }

  return (
    <div className="border-y border-[#f5eee8]/25 py-6">
      <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f5eee8] text-sm font-bold text-black">
              {user.initials || user.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-wide text-white">{user.name}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Alumni Contributor</p>
            </div>
          </div>
          <h3 className="mt-6 text-2xl font-black leading-tight tracking-normal text-white">
            Create something useful for the network.
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Keep the post specific. Articles need a title and body. Jobs need role, company, location, link, and description.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { value: false, title: 'Blog Post', copy: 'Title and body for advice, reflections, or updates.' },
            { value: true, title: 'Job Post', copy: 'Role details, company, location, link, and description.' },
          ].map((option) => {
            const active = isJob === option.value;
            return (
              <button
                key={option.title}
                type="button"
                onClick={() => setIsJob(option.value)}
                className={`block w-full rounded-[8px] border px-4 py-3 text-left transition ${
                  active
                    ? 'border-[#f5eee8] bg-[#f5eee8] text-black'
                    : 'border-white/10 bg-transparent text-white/58 hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black">{option.title}</span>
                  <span className={`h-3 w-3 rounded-full border ${active ? 'border-black bg-black' : 'border-white/25'}`} />
                </div>
                <p className={`mt-2 text-xs leading-5 ${active ? 'text-black/62' : 'text-white/38'}`}>{option.copy}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">
            {isJob ? 'Job title' : 'Blog title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isJob ? 'Senior Frontend Engineer' : 'What alumni should know before referral season'}
            className="mt-2 w-full rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-[15px] font-semibold text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5eee8]/50"
          />
        </div>

        {isJob ? (
          <>
            <div className="lg:col-span-5">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className="mt-2 w-full rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5eee8]/50"
              />
            </div>
            <div className="lg:col-span-5">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote, Bengaluru, Hyderabad"
                className="mt-2 w-full rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5eee8]/50"
              />
            </div>
            <div className="lg:col-span-7">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">External link</label>
              <input
                type="url"
                value={applyLink}
                onChange={(e) => setApplyLink(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5eee8]/50"
              />
            </div>
          </>
        ) : null}

        <div className="lg:col-span-12">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">
            {isJob ? 'Description' : 'Body'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={isJob ? 'Describe the role, requirements, team, and referral context.' : 'Write your article using simple markdown like **bold text** and bullets.'}
            className="mt-2 w-full resize-y rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-[15px] leading-relaxed text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5eee8]/50"
          />
        </div>
      </div>

      {error && <p className="mt-3 flex items-center gap-1 text-sm text-red-400"><AlertCircle className="w-4 h-4"/> {error}</p>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/30">Posts are visible to the network after publishing.</p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-[8px] px-5 py-2.5 text-sm font-semibold text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <StatefulButton
            onClick={handleSubmit}
            disabled={!canSubmit || submitting || publishComplete}
            loadingLabel="Publishing..."
            successLabel={isJob ? 'Job published' : 'Blog published'}
            className="gap-2"
          >
            <span className="inline-flex items-center gap-2">
              {isJob ? 'Publish job' : 'Publish blog'}
              {isJob ? <ExternalLink className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
            </span>
          </StatefulButton>
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
    <div className="sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="flex-1 text-xl font-black tracking-normal text-white">Recently Viewed</h3>
        <History className="h-5 w-5 text-white/45" />
      </div>

      {recentPosts.length === 0 ? (
        <div className="border-t border-white/10 py-5 text-sm text-white/45">
          No reading history yet.
        </div>
      ) : (
        <div className="overflow-y-auto pr-1">
          {recentPosts.map((post) => (
            <Link
              key={`${post.slug}-${post.visitedAt}`}
              to={`/blog/${post.slug}`}
              className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/10 py-4 last:border-b"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5eee8] text-xs font-black text-black">
                {String(post.author || '?')
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0] || '')
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white transition group-hover:text-[#f5eee8]">
                  {post.title}
                </p>
                <p className="mt-1 truncate text-xs text-white/45">
                  {post.author}
                </p>
              </div>
              <div className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.16em] text-white/38">
                {formatVisitedTime(post.visitedAt)}
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
