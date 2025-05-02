import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  getAllUsers,
  removeUser,
  updateUserRole,
} from '@/services/user.services'

type Role = 'member' | 'trainer' | 'admin'

const AdminUsers = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const currentUserId = localStorage.getItem('user_id')

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole({ id, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const filteredUsers = users
    .filter((user) => user.id !== currentUserId)
    .filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    )

  const handleRemove = (userId: string) => {
    setSelectedUserId(userId)
    setIsConfirming(true)
  }

  const handleRoleSelect = (
    userId: string,
    currentRole: Role,
    newRole: Role,
  ) => {
    if (currentRole === newRole) return
    setSelectedUserId(userId)
    setSelectedRole(newRole)
    setShowRoleDialog(true)
  }

  const confirmRemoval = () => {
    if (!selectedUserId) return
    toast.promise(removeMutation.mutateAsync(selectedUserId), {
      loading: 'Removing user...',
      success: 'User removed successfully',
      error: 'Failed to remove user',
    })
    setIsConfirming(false)
    setSelectedUserId(null)
  }

  const confirmRoleChange = () => {
    if (!selectedUserId || !selectedRole) return
    toast.promise(
      roleMutation.mutateAsync({ id: selectedUserId, role: selectedRole }),
      {
        loading: 'Updating role...',
        success: 'Role updated successfully',
        error: 'Failed to update role',
      },
    )
    setShowRoleDialog(false)
    setSelectedUserId(null)
    setSelectedRole(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          filteredUsers.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm mt-1">Role: {user.role}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(user.id)}
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending && selectedUserId === user.id
                      ? 'Removing...'
                      : 'Remove'}
                  </Button>
                </div>
                <div>
                  <Select
                    value={user.role}
                    onValueChange={(role) =>
                      handleRoleSelect(user.id, user.role, role as Role)
                    }
                    disabled={roleMutation.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Change Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="member"
                        disabled={user.role === 'member'}
                      >
                        Member
                      </SelectItem>
                      <SelectItem
                        value="trainer"
                        disabled={user.role === 'trainer'}
                      >
                        Trainer
                      </SelectItem>
                      <SelectItem
                        value="admin"
                        disabled={user.role === 'admin'}
                      >
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent className="bg-white shadow-2xl rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this user?</p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirming(false)}
              disabled={removeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoval}
              disabled={removeMutation.isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-white shadow-2xl rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to change this user's role to {selectedRole}?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={roleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={roleMutation.isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})
