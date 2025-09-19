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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Edit,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Users,
  Mail,
  Calendar,
  Activity
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

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastActive: string;
    joinDate: string;
    avatar?: string;
  } | null>(null);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const { toast } = useToast();

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@travelblog.com',
      role: 'admin',
      lastActive: '2024-01-15',
      status: 'active',
      avatar: '/media/avatars/300-1.png',
      joinDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@travelblog.com',
      role: 'editor',
      lastActive: '2024-01-14',
      status: 'active',
      avatar: '/media/avatars/300-2.png',
      joinDate: '2023-03-22',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@travelblog.com',
      role: 'contributor',
      lastActive: '2024-01-10',
      status: 'active',
      avatar: '/media/avatars/300-3.png',
      joinDate: '2023-06-10',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@travelblog.com',
      role: 'editor',
      lastActive: '2024-01-12',
      status: 'inactive',
      avatar: '/media/avatars/300-4.png',
      joinDate: '2023-08-05',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@travelblog.com',
      role: 'contributor',
      lastActive: '2024-01-08',
      status: 'active',
      avatar: '/media/avatars/300-5.png',
      joinDate: '2023-11-18',
    },
  ];

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features', color: 'bg-red-100 text-red-800' },
    { value: 'editor', label: 'Editor', description: 'Can create, edit, and publish content', color: 'bg-blue-100 text-blue-800' },
    { value: 'contributor', label: 'Contributor', description: 'Can create and edit own content', color: 'bg-green-100 text-green-800' },
  ];

  const permissions = {
    admin: ['Create Posts', 'Edit All Posts', 'Delete Posts', 'Moderate Comments', 'Manage Users', 'View Analytics', 'Export Reports'],
    editor: ['Create Posts', 'Edit All Posts', 'Moderate Comments', 'View Analytics'],
    contributor: ['Create Posts', 'Edit Own Posts', 'View Own Analytics'],
  };

  const getRoleBadge = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return (
      <Badge className={roleData?.color || 'bg-gray-100 text-gray-800'}>
        {roleData?.label || role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangeRole = (user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastActive: string;
    joinDate: string;
    avatar?: string;
  }) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsChangeRoleOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser || !newRole) return;

    // Validate role change
    if (selectedUser.role === 'admin' && newRole !== 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        toast({
          title: "Cannot downgrade last admin",
          description: "At least one admin must remain in the system.",
          variant: "destructive",
        });
        return;
      }
    }

    // Simulate API call
    try {
      // PATCH /api/admin/users/{id}/role { role: newRole }
      console.log('Role change:', { userId: selectedUser.id, newRole });
      
      toast({
        title: "Role updated",
        description: `${selectedUser.name}'s role has been updated to ${newRole}.`,
      });
      
      setIsChangeRoleOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 ml-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage RBAC for Admin / Editor / Contributor
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="h-3 w-3" />
                      <span>{user.lastActive}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{user.joinDate}</span>
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
                        <DropdownMenuItem onClick={() => handleChangeRole(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Profile
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

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Select New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center space-x-2">
                        <Badge className={role.color}>{role.label}</Badge>
                        <span className="text-sm text-muted-foreground">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newRole && (
              <div>
                <Label>Permissions Preview</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">This role can:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {permissions[newRole as keyof typeof permissions]?.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedUser?.role === 'admin' && newRole !== 'admin' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Admin Downgrade Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This user currently has admin privileges. Make sure at least one admin remains in the system.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={!newRole || newRole === selectedUser?.role}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
