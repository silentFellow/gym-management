import { useState } from 'react'
import { toast } from 'sonner'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAssignedWorkouts,
  markWorkoutComplete,
} from '@/services/member.services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/member/assigned-workouts')({
  component: MemberAssignedWorkoutsPage,
})

function MemberAssignedWorkoutsPage() {
  const queryClient = useQueryClient()
  const [selectedWorkout, setSelectedWorkout] = useState(null)

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['assigned-workouts'],
    queryFn: getAssignedWorkouts,
  })

  const { mutate } = useMutation({
    mutationFn: markWorkoutComplete,
    onSuccess: () => {
      toast.success('Workout marked as completed')
      setSelectedWorkout(null)
      queryClient.invalidateQueries({ queryKey: ['assigned-workouts'] })
    },
  })

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Assigned Workouts</h2>

      {isLoading && <div>Loading...</div>}

      {workouts.map((w: any) => {
        const isCompleted = w.completedBy.includes(
          localStorage.getItem('user_id'),
        )
        return (
          <Card key={w._id}>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{w.title}</h3>
              <p>{w.description}</p>
              <p className="text-sm text-muted-foreground">
                Status: {isCompleted ? '✅ Completed' : '⏳ Pending'}
              </p>

              {!isCompleted && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setSelectedWorkout(w)}
                      variant="outline"
                    >
                      Mark as Completed
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mark this workout as completed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (selectedWorkout) mutate(selectedWorkout._id)
                        }}
                      >
                        Yes, Complete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
