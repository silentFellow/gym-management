import API from '@/api'

export const fetchTrainerWorkouts = async (trainerId: string) => {
  const res = await API.get(`/workouts/trainer`, { params: { trainerId } })
  return res.data
}

export const createWorkout = async ({
  trainerId,
  title,
  description,
}: {
  trainerId: string
  title: string
  description: string
}) => {
  const res = await API.post(`/workouts/create`, {
    trainerId,
    title,
    description,
  })
  return res.data
}
