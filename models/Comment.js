import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
        required: true,
    },
    userId: {
        type: String, // Storing email or unique ID from localStorage/Auth
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: [true, 'O comentário não pode estar vazio.'],
        maxlength: [500, 'O comentário não pode ter mais de 500 caracteres.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
