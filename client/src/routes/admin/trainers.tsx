import { toast } from 'sonner'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignTraineeToTrainer,
  getAllTrainers,
  getEligibleMembers,
} from '@/services/trainer.services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const AdminTrainers = () => {
  const [open, setOpen] = useState(false)
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(
    null,
  )
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data: trainers, isLoading: loadingTrainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers,
  })

  const { data: eligibleMembers, isLoading: loadingMembers } = useQuery({
    queryKey: ['eligible-members'],
    queryFn: getEligibleMembers,
  })

  const assignMutation = useMutation({
    mutationFn: assignTraineeToTrainer,
    onSuccess: () => {
      toast.success('Trainee assigned successfully.')
      queryClient.invalidateQueries({ queryKey: ['trainers'] })
      setSelectedMemberId(null)
      setOpen(false)
    },
    onError: () => {
      toast.error('Failed to assign trainee.')
    },
  })

  const openAssignDialog = (trainerId: string) => {
    setSelectedTrainerId(trainerId)
    setOpen(true)
  }

  const handleAssign = () => {
    if (!selectedTrainerId || !selectedMemberId) return
    assignMutation.mutate({
      trainerId: selectedTrainerId,
      memberId: selectedMemberId,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Trainers</h1>

      {loadingTrainers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers?.map((trainer) => (
            <Card key={trainer._id}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-lg font-semibold">{trainer.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Trainees: {trainer.trainees?.length || 0}
                  </p>
                </div>
                {trainer.trainees?.length > 0 && (
                  <ul className="text-sm list-disc list-inside pl-1 text-muted-foreground">
                    {trainer.trainees.map((trainee) => (
                      <li key={trainee._id}>{trainee.username}</li>
                    ))}
                  </ul>
                )}
                <Button onClick={() => openAssignDialog(trainer._id)}>
                  Assign Member
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Member to Trainer</DialogTitle>
          </DialogHeader>

          <Select
            onValueChange={setSelectedMemberId}
            value={selectedMemberId || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {!loadingMembers && eligibleMembers.length > 0 ? (
                eligibleMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.username}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  {loadingMembers
                    ? 'Loading members...'
                    : 'No eligible members available'}
                </div>
              )}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedMemberId || assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Route = createFileRoute('/admin/trainers')({
  component: AdminTrainers,
})
