import {signUp,login,refershAccessToken} from '../controllers/user.controller.js'
import { Router } from 'express'

const router = Router();

router.post('/users/signup',signUp);
router.post('/users/login',login);
router.post('/users/refreshtoken',refershAccessToken);

export default router;