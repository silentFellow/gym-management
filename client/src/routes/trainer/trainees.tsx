import { useState } from 'react'
import { toast } from 'sonner'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { markAttendance } from '@/services/attendance.services'
import { fetchTraineesForTrainer } from '@/services/trainer.services'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const TrainerTraineesPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const trainerId = localStorage.getItem('user_id') as string

  // Utility to check if attendance for today exists
  const getTodayAttendance = (attendance: any[]) => {
    const today = new Date().toISOString().slice(0, 10) // format: 'YYYY-MM-DD'
    return attendance.find((a) => a.date.slice(0, 10) === today)
  }

  // Fetch trainees and their attendance details
  const { data: trainees = [], isLoading } = useQuery({
    queryKey: ['trainer-trainees'],
    queryFn: async () => {
      if (!trainerId) {
        throw new Error('Trainer ID is missing')
      }
      return fetchTraineesForTrainer(trainerId)
    },
  })

  // Mutation to mark attendance for a trainee
  const mutation = useMutation({
    mutationFn: ({
      traineeId,
      status,
    }: {
      traineeId: string
      status: 'present' | 'absent'
    }) => markAttendance(trainerId, traineeId, status),
    onSuccess: () => {
      toast.success('Attendance updated')
      queryClient.invalidateQueries({ queryKey: ['trainer-trainees'] })
    },
    onError: () => {
      toast.error('Failed to update attendance')
    },
  })

  // Function to mark all trainees' attendance
  const markAllAttendance = (status: 'present' | 'absent') => {
    trainees.forEach((trainee: any) => {
      mutation.mutate({ traineeId: trainee.id, status })
    })
    toast.success(`All trainees marked as ${status}`)
  }

  // Filter trainees based on search query
  const filteredTrainees = trainees.filter((t: any) =>
    t.username.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-4">
      <div className="max-w-md">
        <Input
          placeholder="Search trainees by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-10">
          Loading trainees...
        </p>
      ) : filteredTrainees.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No trainees found.
        </p>
      ) : (
        <div>
          {/* Mark All Attendance Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => markAllAttendance('present')}
              disabled={mutation.isPending}
            >
              Mark All Present
            </Button>
            <Button
              variant="destructive"
              onClick={() => markAllAttendance('absent')}
              disabled={mutation.isPending}
            >
              Mark All Absent
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainees.map((trainee: any) => {
              const todayAttendance = getTodayAttendance(
                trainee.attendance || [],
              )
              return (
                <Card key={trainee.id} className="rounded-2xl shadow-md">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-1">
                      {trainee.username}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {/* Show today's attendance status if available */}
                      <span className="font-bold">
                        {todayAttendance ? (
                          <span className="font-semibold">
                            {todayAttendance.status.toUpperCase()} (on{' '}
                            {new Date(
                              todayAttendance.date,
                            ).toLocaleDateString()}
                            )
                          </span>
                        ) : (
                          <span className="italic text-gray-500">
                            Not marked today
                          </span>
                        )}
                      </span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          mutation.mutate({
                            traineeId: trainee.id,
                            status: 'present',
                          })
                        }
                        disabled={mutation.isPending || todayAttendance}
                      >
                        Mark Present
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          mutation.mutate({
                            traineeId: trainee.id,
                            status: 'absent',
                          })
                        }
                        disabled={mutation.isPending || todayAttendance}
                      >
                        Mark Absent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/trainer/trainees')({
  component: TrainerTraineesPage,
})
