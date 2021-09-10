import {Router} from 'express'
import {getTranscription} from '../controllers/transcribe'
import {auth0, createTable} from '../controllers/actions'

const router = Router()

router.post('/auth0', auth0)
router.post('/create-table', createTable)

export default router