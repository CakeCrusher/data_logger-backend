import {Router} from 'express'
import {getTranscription, classifyTranscription} from '../controllers/transcribe'

const router = Router()

router.post('/transcribe', getTranscription)
router.post('/classify', classifyTranscription)

export default router