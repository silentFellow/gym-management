import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import trainerRoutes from './routes/trainerRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/trainers', trainerRoutes)
app.use('/payments', paymentRoutes)

app.get('/', (req, res) => res.send('Gym Management API Running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
