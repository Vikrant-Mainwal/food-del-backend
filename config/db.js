import mongoose from "mongoose";


export const connectDb = async()=>{
    await mongoose.connect('mongodb+srv://Vikrant1301:43211234@cluster0.plix4kh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("DB connected"))
}