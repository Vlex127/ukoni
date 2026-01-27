"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getApiUrl } from '@/lib/api';

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: string;
  parentId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string | null;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  replies: Comment[];
}

export default function CommentsPage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(getApiUrl('comments'));
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    try {
      const response = await fetch(getApiUrl(`comments/${editingComment.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        await fetchComments();
        setShowEditModal(false);
        setEditingComment(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to moderate this comment? This will replace its content with a policy violation message on the public site.")) return;

    try {
      const response = await fetch(getApiUrl(`comments/${commentId}`), {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to moderate comment:", error);
    }
  };

  const handlePermanentDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this comment from the database? This cannot be undone.")) return;

    try {
      const response = await fetch(getApiUrl(`comments/${commentId}?mode=permanent`), {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to permanently delete comment:", error);
    }
  };


  // Grouping & Tree Building
  const groupCommentsByPost = () => {
    const postGroups: Record<string, { post: any, comments: Comment[] }> = {};

    // First, build a map and tree for all comments to handle potential cross-post replies (though rare)
    // Actually, comments are per-post, so it's easier to group first.
    comments.forEach(c => {
      const postId = c.post?.id || 'unknown';
      if (!postGroups[postId]) {
        postGroups[postId] = {
          post: c.post || { title: 'Unknown Page', slug: '#' },
          comments: []
        };
      }
      postGroups[postId].comments.push(c);
    });

    return Object.values(postGroups).map(group => ({
      ...group,
      tree: buildTree(group.comments)
    }));
  };

  const buildTree = (flatComments: Comment[]) => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    flatComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    flatComments.forEach(c => {
      const node = map.get(c.id);
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  if (!session) return null;

  const grouped = groupCommentsByPost();

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Comment Moderation</h1>
        <p className="text-sm text-gray-400 mt-1">Review and manage discussions across your blog</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatMiniCard label="Total Discussions" value={comments.length} color="blue" />
        <StatMiniCard label="Moderated (Deleted)" value={comments.filter(c => c.status === 'deleted').length} color="red" />
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Fetching conversations...</p>
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400">No comments found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.post.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="text-xs font-bold">{group.comments.length}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{group.post.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">/articles/{group.post.slug}</p>
                  </div>
                </div>
                <a href={`/articles/${group.post.slug}`} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">View Page</a>
              </div>

              <div className="divide-y divide-gray-50 px-6">
                {group.tree.map((comment: any) => (
                  <CommentTreeRow
                    key={comment.id}
                    comment={comment}
                    onEdit={(c: Comment) => {
                      setEditingComment(c);
                      setEditContent(c.content);
                      setShowEditModal(true);
                    }}
                    onModerate={handleDelete}
                    onPermanentDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Comment</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all min-h-[150px] mb-6"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 rounded-xl text-gray-400 font-medium">Cancel</button>
              <button onClick={handleEditSubmit} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentTreeRow({ comment, onEdit, onModerate, onPermanentDelete, depth = 0 }: any) {
  return (
    <div className={`py-6 ${depth > 0 ? 'ml-10 border-l-2 border-blue-50 pl-6 my-2' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
              {comment.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{comment.authorName}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-medium">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {comment.ipAddress && <span>• IP: {comment.ipAddress}</span>}
              </div>
            </div>
          </div>
          <div className={`text-sm text-gray-600 leading-relaxed font-medium ${comment.status === 'deleted' ? 'italic opacity-50' : ''}`}>
            {comment.content}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {comment.status !== 'deleted' && (
            <button onClick={() => onModerate(comment.id)} className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg" title="Moderate (Soft Delete)">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11v4h3v2h-5V7h2z" /></svg>
            </button>
          )}
          <button onClick={() => onPermanentDelete(comment.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Permanent Delete (Remove from DB)">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M6 2a2 2 0 00-2 2v1H2v2h1v10a2 2 0 002 2h10a2 2 0 002-2V7h1V5h-2V4a2 2 0 00-2-2H6zm2 3h4v1H8V5zm-2 4h2v7H6V9zm4 0h2v7h-2V9zm4 0h2v7h-2V9z" /></svg>
          </button>
          <button onClick={() => onEdit(comment)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Edit Content">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M12.3 3.7l4 4L4.3 19.7 0 20l.3-4.3 12-12zM14.7 1.3l4 4-2.3 2.3-4-4 2.3-2.3z" /></svg>
          </button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply: any) => (
            <CommentTreeRow
              key={reply.id}
              comment={reply}
              onEdit={onEdit}
              onModerate={onModerate}
              onPermanentDelete={onPermanentDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatMiniCard({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100"
  };

  return (
    <div className={`px-4 py-3 rounded-2xl border ${colors[color]} flex flex-col items-center justify-center text-center`}>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
    </div>
  );
}
