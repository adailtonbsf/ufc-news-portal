import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this news.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    subtitle: {
        type: String,
        required: [true, 'Please provide a subtitle.'],
        maxlength: [200, 'Subtitle cannot be more than 200 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide the content.'],
    },
    category: {
        type: String,
        required: [true, 'Please specify the category.'],
        enum: ['Eventos', 'Pesquisa', 'Extensão', 'Editais', 'Oportunidades', 'Geral'],
    },
    author: {
        type: String,
        default: 'Redação UFC',
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL.'],
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,
    },
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
