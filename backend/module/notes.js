import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Correct way to define ObjectId
        ref: 'User', // User model ka reference
        required: true
    }
}, 
{ 
    timestamps: true // createdAt aur updatedAt fields automatically add karne ke liye
});

// Schema ko Model mein compile karke export karein
const Note =  mongoose.model("Note", noteSchema);

export default Note;