import {Router} from 'express'
import {getTranscription} from '../controllers/transcribe'

const router = Router()

router.post('/transcribe', getTranscription)

export default router