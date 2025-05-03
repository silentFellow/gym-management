import API from '@/api'

export const fetchAttendanceSummaries = async () => {
  const response = await API.get('/attendance/summaries')
  return response.data
}

export const fetchUserAttendance = async (userId: string) => {
  const response = await API.get(`/attendance/${userId}`)
  return response.data
}

export const markAttendance = async (
  trainerId: string,
  traineeId: string,
  status: 'present' | 'absent',
) => {
  const response = await API.post(`/attendance/mark`, {
    trainerId,
    traineeId,
    status,
  })
  return response.data
}
