"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getApiUrl } from '@/lib/api';

interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  status: string;
  parent_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string | null;
  post: {
    id: number;
    title: string;
    slug: string;
  };
}

export default function CommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [filterStatus]);

  // Update the fetchComments function in src/app/admin/comments/page.tsx
const fetchComments = async () => {
  try {
    const token = localStorage.getItem("access_token");
    let url = getApiUrl('api/v1/comments');
    
    if (filterStatus !== "all") {
      url += `?status=${filterStatus}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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

const handleStatusUpdate = async (commentId: number, newStatus: string) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(getApiUrl(`api/v1/comments/${commentId}`), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      await fetchComments();
    }
  } catch (error) {
    console.error("Failed to update comment status:", error);
  }
};

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(getApiUrl(`api/v1/comments/${editingComment.id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(getApiUrl(`api/v1/comments/${commentId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "spam":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: comments.length,
      pending: comments.filter(c => c.status === "pending").length,
      approved: comments.filter(c => c.status === "approved").length,
      rejected: comments.filter(c => c.status === "rejected").length,
      spam: comments.filter(c => c.status === "spam").length,
    };
    return counts;
  };

  if (!user) return null;

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and moderate blog comments.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filterStatus === status
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.author_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.author_email}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          comment.status
                        )}`}
                      >
                        {comment.status}
                      </span>
                    </div>

                  // Update the comment rendering part to handle missing post data
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      {comment.post ? (
                        <>
                          On:{" "}
                          <a
                            href={`/articles/${comment.post.slug}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {comment.post.title}
                          </a>
                        </>
                      ) : (
                        <span className="text-gray-400">[Post not found]</span>
                      )}
                    </p>
                  </div>

                    <div className="text-gray-700 mb-3">
                      <p className="whitespace-pre-wrap">{comment.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {new Date(comment.created_at).toLocaleDateString()} at{" "}
                        {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                      {comment.ip_address && (
                        <span>IP: {comment.ip_address}</span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                      {comment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(comment.id, "approved")}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(comment.id, "rejected")}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {comment.status === "approved" && (
                        <button
                          onClick={() => handleStatusUpdate(comment.id, "rejected")}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Reject
                        </button>
                      )}
                      {comment.status === "rejected" && (
                        <button
                          onClick={() => handleStatusUpdate(comment.id, "approved")}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {comments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filterStatus === "all"
                  ? "No comments found."
                  : `No ${filterStatus} comments found.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Comment Modal */}
      {showEditModal && editingComment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Comment
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      by {editingComment.author_name} on{" "}
                      {editingComment.post.title}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Comment Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update Comment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
