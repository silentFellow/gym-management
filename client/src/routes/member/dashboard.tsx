import { createFileRoute } from '@tanstack/react-router'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { getMemberDashboard } from '@/services/member.services'
import { Card, CardContent } from '@/components/ui/card'

const COLORS = ['#34d399', '#f87171'] // green, red
const BLUE_COLORS = ['#60a5fa', '#e0e7ff'] // blue, light blue

export const Route = createFileRoute('/member/dashboard')({
  component: MemberDashboardPage,
})

function MemberDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['member-dashboard'],
    queryFn: getMemberDashboard,
  })

  if (isLoading || !data) return <div className="p-4">Loading...</div>

  const attendanceChart = [
    { name: 'Present', value: data.attendance.presentDays },
    {
      name: 'Absent',
      value: data.attendance.totalDays - data.attendance.presentDays,
    },
  ]

  const workoutChart = [
    { name: 'Completed', value: data.workouts.completed },
    {
      name: 'Pending',
      value: data.workouts.assigned - data.workouts.completed,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {data.user.username}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Attendance Card */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 text-center">
              Attendance Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {attendanceChart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workout Card */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 text-center">
              Workout Completion
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="80%"
                barSize={20}
                data={workoutChart}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Tooltip />
                <Legend
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
