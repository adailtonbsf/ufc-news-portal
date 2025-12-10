import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name.'],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug.'],
        unique: true,
    },
    color: {
        type: String,
        default: '#2563EB', // Default UFC Blue
    },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
