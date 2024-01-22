import express from 'express'
import { getAllFollowings } from '../controllers/friend.js'

const router = express.Router()

router.get("/", getAllFollowings)

export default router