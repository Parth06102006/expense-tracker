import { Schema } from "mongoose";
import mongoose from "mongoose";

const expressTrackerSchema = new Schema
(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // Assuming you have a User model
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            enum: ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Other"], 
            required: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: 200
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Credit Card", "Debit Card", "UPI", "Other"],
            required: true
        },
    },{timestamps:true}
)

const Expense = mongoose.model('Expense',expressTrackerSchema);
export {Expense}

