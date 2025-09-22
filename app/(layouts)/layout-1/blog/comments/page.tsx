'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Calendar,
  Ban,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function CommentModerationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [selectedComment, setSelectedComment] = useState<{
    id: number;
    author: string;
    email: string;
    content: string;
    post: string;
    postId: number;
    status: string;
    reason?: string | null;
    reportedBy?: string | null;
    createdAt: string;
    isSpam?: boolean;
    isOffensive?: boolean;
    avatar?: string;
  } | null>(null);
  const [, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const comments = [
    {
      id: 1,
      author: 'John Doe',
      email: 'john.doe@email.com',
      content: 'Great article! I really enjoyed reading about these destinations. The photos are amazing.',
      post: '10 Best Travel Destinations in Europe',
      postId: 123,
      status: 'pending',
      reason: null,
      reportedBy: null,
      createdAt: '2024-01-15T10:30:00Z',
      isSpam: false,
      isOffensive: false,
      avatar: '/media/avatars/300-1.png',
    },
    {
      id: 2,
      author: 'Jane Smith',
      email: 'jane.smith@email.com',
      content: 'This is spam! Click here for free money: https://scam.com',
      post: 'Travel Tips for Beginners',
      postId: 124,
      status: 'reported',
      reason: 'spam',
      reportedBy: 'moderator@travelblog.com',
      createdAt: '2024-01-15T09:15:00Z',
      isSpam: true,
      isOffensive: false,
      avatar: '/media/avatars/300-2.png',
    },
    {
      id: 3,
      author: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      content: 'You are all idiots! This article is complete garbage!',
      post: 'Budget Travel Guide',
      postId: 125,
      status: 'reported',
      reason: 'abuse',
      reportedBy: 'user@travelblog.com',
      createdAt: '2024-01-15T08:45:00Z',
      isSpam: false,
      isOffensive: true,
      avatar: '/media/avatars/300-3.png',
    },
    {
      id: 4,
      author: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      content: 'Thanks for sharing this information. I\'m planning a trip to Japan next month.',
      post: 'Japan Travel Guide',
      postId: 126,
      status: 'approved',
      reason: null,
      reportedBy: null,
      createdAt: '2024-01-14T16:20:00Z',
      isSpam: false,
      isOffensive: false,
      avatar: '/media/avatars/300-4.png',
    },
    {
      id: 5,
      author: 'David Brown',
      email: 'david.brown@email.com',
      content: 'This doesn\'t relate to travel at all. Why is this comment here?',
      post: 'Travel Photography Tips',
      postId: 127,
      status: 'reported',
      reason: 'off-topic',
      reportedBy: 'moderator@travelblog.com',
      createdAt: '2024-01-14T14:10:00Z',
      isSpam: false,
      isOffensive: false,
      avatar: '/media/avatars/300-5.png',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'reported':
        return <Badge className="bg-orange-100 text-orange-800">Reported</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getReasonBadge = (reason: string | null) => {
    if (!reason) return null;
    switch (reason) {
      case 'spam':
        return <Badge className="bg-red-100 text-red-800">Spam</Badge>;
      case 'abuse':
        return <Badge className="bg-orange-100 text-orange-800">Abuse</Badge>;
      case 'off-topic':
        return <Badge className="bg-blue-100 text-blue-800">Off-topic</Badge>;
      default:
        return <Badge variant="secondary">{reason}</Badge>;
    }
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.post.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || comment.reason === reasonFilter;
    return matchesSearch && matchesStatus && matchesReason;
  });

  const handleSelectComment = (commentId: number) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map(c => c.id));
    }
  };

  const handleModerateComment = async (commentId: number, action: string, reason?: string) => {
    try {
      // PATCH /api/admin/comments/{id} { action, reason }
      console.log('Moderate comment:', { commentId, action, reason });
      
      toast({
        title: "Comment moderated",
        description: `Comment ${action}ed successfully.`,
      });
    } catch (error) {
      console.error('Error moderating comment:', error);
      toast({
        title: "Error",
        description: "Failed to moderate comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedComments.length === 0) return;

    try {
      // Bulk moderate comments
      console.log('Bulk action:', { action, commentIds: selectedComments });
      
      toast({
        title: "Bulk action completed",
        description: `${selectedComments.length} comments ${action}ed.`,
      });
      
      setSelectedComments([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetail = (comment: {
    id: number;
    author: string;
    email: string;
    content: string;
    post: string;
    postId: number;
    status: string;
    reason?: string | null;
    reportedBy?: string | null;
    createdAt: string;
    isSpam?: boolean;
    isOffensive?: boolean;
    avatar?: string;
  }) => {
    setSelectedComment(comment);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 ml-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
          <p className="text-muted-foreground">
            Approve/Reject/Spam comments efficiently
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="abuse">Abuse</SelectItem>
                  <SelectItem value="off-topic">Off-topic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {selectedComments.length} comment{selectedComments.length > 1 ? 's' : ''} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedComments([])}>
                  Clear
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('spam')}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Mark as Spam
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({filteredComments.length})</CardTitle>
          <CardDescription>
            Review and moderate comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => handleSelectComment(comment.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className={`text-sm ${comment.isOffensive ? 'blur-sm hover:blur-none' : ''}`}>
                        {comment.content.length > 100 
                          ? `${comment.content.substring(0, 100)}...` 
                          : comment.content
                        }
                      </p>
                      {comment.isSpam && (
                        <Badge className="mt-1 bg-red-100 text-red-800">Spam</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{comment.author}</div>
                        <div className="text-xs text-muted-foreground">{comment.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{comment.post}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(comment.status)}</TableCell>
                  <TableCell>{getReasonBadge(comment.reason || null)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetail(comment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleModerateComment(comment.id, 'approve')}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModerateComment(comment.id, 'reject')}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleModerateComment(comment.id, 'spam')}
                          className="text-orange-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Mark as Spam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <Card className="fixed inset-4 z-50 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Comment Details</CardTitle>
              <Button variant="ghost" onClick={() => setIsDetailOpen(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={selectedComment.avatar} alt={selectedComment.author} />
                <AvatarFallback>{selectedComment.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedComment.author}</div>
                <div className="text-sm text-muted-foreground">{selectedComment.email}</div>
              </div>
            </div>
            
            <div>
              <Label>Comment Content</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">{selectedComment.content}</p>
              </div>
            </div>
            
            <div>
              <Label>Post Context</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{selectedComment.post}</p>
                <p className="text-xs text-muted-foreground mt-1">Post ID: {selectedComment.postId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedComment.status)}</div>
              </div>
              <div>
                <Label>Reason</Label>
                <div className="mt-1">{getReasonBadge(selectedComment.reason || null)}</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => handleModerateComment(selectedComment.id, 'reject')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button 
                onClick={() => handleModerateComment(selectedComment.id, 'approve')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
