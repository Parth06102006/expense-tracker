import {createExpense,updateExpense,deleteExpense,getAllExpenses} from '../controllers/expense.controller.js'
import { authVerify } from '../middlewares/auth.middleware.js';
import { Router } from 'express'

const router = Router();

router.post('/expenses/create',authVerify,createExpense);
router.post('/expenses/update',updateExpense);
router.post('/expenses/delete',deleteExpense);
router.get('/expenses/',authVerify,getAllExpenses);

export default router;