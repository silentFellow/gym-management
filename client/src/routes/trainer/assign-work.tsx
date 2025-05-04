import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkout,
  fetchTrainerWorkouts,
} from '@/services/workout.services'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const TrainerWorkoutsPage = () => {
  const queryClient = useQueryClient()
  const trainerId = localStorage.getItem('user_id')!
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['trainer-workouts'],
    queryFn: () => fetchTrainerWorkouts(trainerId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => createWorkout({ trainerId, title, description }),
    onSuccess: () => {
      toast.success('Workout assigned')
      setTitle('')
      setDescription('')
      queryClient.invalidateQueries({ queryKey: ['trainer-workouts'] })
    },
    onError: () => toast.error('Failed to assign workout'),
  })

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Assign New Workout</h2>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Workout Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Workout Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button disabled={isPending || !title} onClick={() => mutate()}>
          Assign Workout
        </Button>
      </div>

      <h2 className="text-xl font-semibold mt-6">Assigned Workouts</h2>
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading workouts...</p>
        ) : (
          workouts.map((w: any) => (
            <Card key={w._id}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{w.title}</h3>
                <p>{w.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Completed by {w.completedBy.length} /{' '}
                  {w.assignedTrainees.length} trainees
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/trainer/assign-work')({
  component: TrainerWorkoutsPage,
})
