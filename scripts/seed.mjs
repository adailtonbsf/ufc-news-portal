import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load directly from CWD (assuming we run from project root)
const result = dotenv.config({ path: '.env.local' });

if (result.error) {
    console.error('❌ Error loading .env.local:', result.error);
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log('--- Debug Info ---');
console.log('CWD:', process.cwd());
console.log('Env Result Parsed keys:', result.parsed ? Object.keys(result.parsed) : 'None');
console.log('MONGODB_URI found:', !!MONGODB_URI);
console.log('------------------');

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing. Please check .env.local format.');
    process.exit(1);
}

// Simple schema definition
const NewsSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    category: String,
    author: String,
    imageUrl: String,
    publishDate: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
});

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB!');

        console.log('Cleaning old data...');
        await News.deleteMany({});

        console.log('Inserting sample news...');
        await News.create([
            {
                title: 'Universidade inaugura novo laboratório de IA',
                subtitle: 'Espaço conta com equipamentos de última geração para pesquisas em Machine Learning.',
                content: 'A Universidade Federal do Ceará inaugurou nesta segunda-feira...',
                category: 'Pesquisa',
                author: 'Ascom UFC',
                imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
                likes: 120
            },
            {
                title: 'Inscrições abertas para bolsas de extensão',
                subtitle: 'Edital oferta 50 vagas para projetos em diversas áreas.',
                content: 'Estão abertas as inscrições para o programa de bolsas...',
                category: 'Editais',
                author: 'Pró-Reitoria',
                imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
                likes: 45
            }
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
