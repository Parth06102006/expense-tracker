import {User} from '../models/user.model.js'
import {Expense} from '../models/expense.model.js'
import {asyncHandler} from '../utilitis/asyncHandler.js'
import { ApiError } from '../utilitis/ApiError.js'
import { ApiResponse } from '../utilitis/ApiResponse.js'
import mongoose from 'mongoose'

export const createExpense = asyncHandler(async(req,res,next)=>
{
    const userId = req.user?._id;
    const {amount,category,description,paymentMethod} = req.body;
    if(!amount||!category||!description||!paymentMethod)
        {
            throw new ApiError(400,'Fields are missing,Kindly fill all the fields');
        } 
    const newItem = await Expense.create({userId,amount,category,description,paymentMethod});
    console.log(newItem);

    return res.status(200).json(new ApiResponse(200,{newItem},'New Expense added Successfully'));
})

export const updateExpense = asyncHandler(async(req,res,next)=>
    {
        console.log('=========================')
        const expenseId = req.body._id;
        console.log(expenseId);
        if(!expenseId)
        {
            throw new ApiError(400,'Expense Id not found');
        }
        console.log('++++++++++++++++++')
        const {amount,category,description,paymentMethod} = req.body;
        console.log(amount,category,description,paymentMethod)
        const existingExpense = await Expense.findByIdAndUpdate(expenseId,{$set:{amount,category,description,paymentMethod}},{new:true});
        console.log(existingExpense);
        if(!expenseId)
        {
            throw new ApiError(500,'Expense not found');
        }
        return res.status(200).json(new ApiResponse(200,{"updateExpense":existingExpense},'Expense Updated Successfully'));
    })

export const deleteExpense = asyncHandler(async(req,res,next)=>{
    const expenseId = req.body._id;
    if(!expenseId)
    {
        throw new ApiError(400,'Expense Id not found');
    }
    await Expense.findByIdAndDelete(expenseId);
    return res.status(200).json(new ApiResponse(200,{},'Expense Deleted Successfully'));
})

export const getAllExpenses = asyncHandler(async(req,res,next)=>
    {
        const userId = req.user?._id;
        const {filter,from,to} = req.query;
        const query = { userId : new mongoose.Types.ObjectId(userId)};
        if(filter)
        {
            const today = new Date();

            switch(filter)
            {
                case "week":
                    {
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate()-7);
                        query.date = {$gte: weekAgo,$lte:today};
                        break;
                    }
                case "month":
                    {
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(today.getMonth()-1);
                        query.date = {$gte: monthAgo,$lte:today};
                        break;
                    }
                case "3month":
                    {
                        const threeMonthAgo = new Date(today);
                        threeMonthAgo.setMonth(today.getMonth()-3);
                        query.date = {$gte: threeMonthAgo,$lte:today};
                        break;
                    }
                case "custom":
                    {
                        if(from && to)
                        {
                            query.date = {$gte: new Date(from),$lte:new Date(to)};
                        }
                        break;
                    }
            }
        }

        const expenseList = await Expense.find(query).sort({date:-1})
        if(expenseList.length === 0)
        {
            throw new ApiError(400,'Expense List is not present')
        }
        return res.status(200).json(new ApiResponse(200,{expenseList:expenseList},'Expenses Retrieved Successfully'));
    })