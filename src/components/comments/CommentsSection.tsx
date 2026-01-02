'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '@/lib/api-client';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  Send, 
  CornerDownRight, 
  User, 
  Mail, 
  Loader2,
  Reply,
  Plus,
  X
} from 'lucide-react';

// --- Types & Schema ---

const commentSchema = z.object({
  author_name: z.string().min(2, 'Name must be at least 2 characters'),
  author_email: z.string().email('Please enter a valid email'),
  content: z.string().min(3, 'Comment must be at least 3 characters'),
  parent_id: z.number().optional(),
});

type Comment = {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  replies: Comment[];
};

interface CommentsSectionProps {
  postId: number;
}

// --- Utilities ---
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 80%)`;
};

// --- Sub-Components ---
const CommentSkeleton = () => (
  <div className="flex gap-4 mb-6 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

// --- Main Component ---

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // UI State: Controls visibility of the form
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author_name: '',
      author_email: '',
      content: '',
      parent_id: undefined as undefined | number,
    },
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await apiClient<Comment[]>(`/comments/comments?post_id=${postId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    try {
      const newComment = await apiClient<Comment>('/comments/comments', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          post_id: postId,
          parent_id: replyTo?.id || null,
        }),
      });
      
      // Update logic...
      if (replyTo?.id) {
        const addReplyRecursively = (list: Comment[]): Comment[] => {
          return list.map(c => {
            if (c.id === replyTo.id) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            if (c.replies) return { ...c, replies: addReplyRecursively(c.replies) };
            return c;
          });
        };
        setComments(addReplyRecursively(comments));
      } else {
        setComments([newComment, ...comments]);
      }

      // Cleanup
      reset();
      setReplyTo(null);
      setIsFormVisible(false); // Hide form after success
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenForm = () => {
    setReplyTo(null);
    setIsFormVisible(true);
    setTimeout(() => {
        document.getElementById('comment-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setFocus('author_name');
    }, 100);
  };

  const handleReplyClick = (commentId: number, authorName: string) => {
    setReplyTo({ id: commentId, name: authorName });
    setIsFormVisible(true);
    
    setTimeout(() => {
      document.getElementById('comment-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFocus('content');
    }, 100);
  };

  const RecursiveComment = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`relative ${depth > 0 ? 'mt-4' : 'mt-6'}`}>
      <div className="flex gap-4 group">
        <Avatar className="w-10 h-10 border-2 border-white shadow-sm shrink-0 z-10">
          <AvatarFallback style={{ backgroundColor: stringToColor(comment.author_name) }} className="text-gray-700 font-semibold">
            {comment.author_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900">{comment.author_name}</span>
            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</div>
          <div className="mt-2">
            <button 
              onClick={() => handleReplyClick(comment.id, comment.author_name)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" /> Reply
            </button>
          </div>
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="relative mt-2 ml-5 pl-6 border-l-2 border-gray-100 pb-2">
          {comment.replies.map(reply => <RecursiveComment key={reply.id} comment={reply} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20">
      
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Comments <span className="text-gray-400 font-normal">({comments.length})</span>
          </h3>
        </div>
        
        {/* Only show the "Write Comment" button if the form is HIDDEN */}
        {!isFormVisible && (
          <Button onClick={handleOpenForm} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Write a Comment
          </Button>
        )}
      </div>

      {/* --- Conditional Form Section --- */}
      {isFormVisible && (
        <div id="comment-form-container" className="animate-in fade-in slide-in-from-top-4 duration-300 mb-10">
          <Card className="border-blue-100 shadow-lg ring-1 ring-blue-500/20">
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {replyTo ? (
                  <span className="flex items-center gap-2 text-blue-700">
                    <CornerDownRight className="w-4 h-4" />
                    Replying to <span className="font-bold">{replyTo.name}</span>
                  </span>
                ) : (
                  'Write a new comment'
                )}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-white"
                onClick={() => {
                   setIsFormVisible(false);
                   setReplyTo(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Your Name" className="pl-9" {...register('author_name')} disabled={isSubmitting} />
                    {errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name.message}</p>}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Your Email" className="pl-9" {...register('author_email')} disabled={isSubmitting} />
                    {errors.author_email && <p className="text-red-500 text-xs mt-1">{errors.author_email.message}</p>}
                  </div>
                </div>

                <Textarea 
                  placeholder={replyTo ? `Replying to ${replyTo.name}...` : "What are your thoughts?"} 
                  className="min-h-[120px] resize-y" 
                  {...register('content')} 
                  disabled={isSubmitting} 
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}

                <div className="flex justify-end gap-3">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setIsFormVisible(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Post Comment
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Comments List --- */}
      <div className="space-y-2">
        {isLoading ? (
          [1, 2, 3].map(i => <CommentSkeleton key={i} />)
        ) : comments.length > 0 ? (
          comments.map(comment => <RecursiveComment key={comment.id} comment={comment} />)
        ) : (
          !isFormVisible && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No comments yet</p>
                <Button variant="link" onClick={handleOpenForm} className="text-blue-600 font-semibold">
                    Start the conversation
                </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}