import {signUp,login,refershAccessToken, logOut} from '../controllers/user.controller.js'
import { authVerify } from '../middlewares/auth.middleware.js';
import { Router } from 'express'

const router = Router();

router.post('/users/signup',signUp);
router.post('/users/login',login);
router.post('/users/refreshtoken',refershAccessToken);
router.post('/users/logout',authVerify,logOut);

export default router;