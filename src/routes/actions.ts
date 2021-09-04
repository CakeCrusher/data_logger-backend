import {Router} from 'express'
import {getTranscription} from '../controllers/transcribe'
import {auth0} from '../controllers/actions'

const router = Router()

router.post('/auth0', auth0)

export default router