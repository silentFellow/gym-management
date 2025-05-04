import API from '@/api'

export const getMemberDashboard = async () => {
  const userId = localStorage.getItem('user_id')
  const { data } = await API.get('/members/dashboard', {
    params: { userId },
  })
  return data
}

export const getAssignedWorkouts = async () => {
  const userId = localStorage.getItem('user_id')
  const res = await API.get(`/workouts/assigned?userId=${userId}`)
  return res.data
}

export const markWorkoutComplete = async (workoutId: string) => {
  const userId = localStorage.getItem('user_id')
  const res = await API.post('/workouts/mark-complete', {
    workoutId,
    userId,
  })
  return res.data
}
