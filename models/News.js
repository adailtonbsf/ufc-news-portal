import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Por favor, forneça um título para a notícia.'],
        maxlength: [100, 'O título não pode ter mais de 100 caracteres'],
    },
    subtitle: {
        type: String,
        required: [true, 'Por favor, forneça um subtítulo.'],
        maxlength: [200, 'O subtítulo não pode ter mais de 200 caracteres'],
    },
    content: {
        type: String,
        required: [true, 'Por favor, forneça o conteúdo.'],
    },
    category: {
        type: String,
        required: [true, 'Por favor, especifique a categoria.'],
        enum: ['Eventos', 'Pesquisa', 'Extensão', 'Editais', 'Oportunidades', 'Geral'],
    },
    author: {
        type: String,
        default: 'Redação UFC',
    },
    authorEmail: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        required: [true, 'Por favor, forneça a URL da imagem.'],
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    item_views: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft', // Default to draft for moderation
    },
    featured: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    likedBy: {
        type: [String], // Store user distinct identifiers (e.g. email)
        default: [],
    },
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
