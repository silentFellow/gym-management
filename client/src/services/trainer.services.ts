import API from '@/api'

// Fetch all trainers
export const getAllTrainers = async () => {
  const response = await API.get('/trainers')
  return response.data
}

// Fetch all eligible members (paid users)
export const getEligibleMembers = async () => {
  const response = await API.get('/users/eligible-members')
  return response.data
}

export const assignTraineeToTrainer = async ({
  trainerId,
  memberId,
}: {
  trainerId: string
  memberId: string
}) => {
  const res = await API.post('/trainers/assign', {
    trainerId,
    memberId,
  })
  return res.data
}
