import {User} from '../models/user.model.js'
import {Expense} from '../models/expense.model.js'
import asyncHandler from '../utilitis/asyncHandler.js'
import { ApiError } from '../utilitis/ApiError.js'
import { ApiResponse } from '../utilitis/ApiResponse.js'

export const createExpense = asyncHandler(async(req,res,next)=>
{
    const userId = req.user?._id;
    const {amount,category,description,paymentMethod} = req.body;
    if([amount,category,description,paymentMethod].some(t => t.trim() === ''))
        {
            throw new ApiError(400,'Fields are missing,Kindly fill all the fields');
        }   
    const newItem = await Expense.create({userId,amount,category,description,paymentMethod});
    return res.statusCode(200).json(new ApiResponse(200,{newItem},'New Item added Successfully'));
})

export const updateExpense = asyncHandler(async(req,res,next)=>
    {
        const expenseId = req.body._id;
        if(!itemId)
        {
            throw new ApiError(400,'Item Id not found');
        }
        const {amount,category,description,paymentMethod} = req.body;
        const existingExpense = await Expense.findByIdAndUpdate(expenseId,{$set:{amount,category,description,paymentMethod}},{new:true});
        if(!expenseId)
        {
            throw new ApiError(500,'Expense not found');
        }
        return res.statusCode(200).json(new ApiResponse(statusCode,{"updateExpense":existingExpense},'Expense Updated Successfully'));
    })

export const deleteExpense = asyncHandler(async(req,res,next)=>{
    const expenseId = req.body._id;
    if(!itemId)
    {
        throw new ApiError(400,'Item Id not found');
    }
    await Expense.findByIdAndDelete(expenseId);
    return res.statusCode(200).json(new ApiResponse(statusCode,{},'Expense Deleted Successfully'));
})

export const getAllExpenses = asyncHandler(async(req,res,next)=>
    {
        const userId = req.user?._id;

        const expenseList = await Expense
        (
            {
                $match:{userId}
            }
        )

        if(!expenseList)
        {
            throw new ApiError(400,'Expense List is not present')
        }

        return res.statusCode(200).json({expenseList:expenseList[0]},'Expenses Retrieved Successfully');
    })