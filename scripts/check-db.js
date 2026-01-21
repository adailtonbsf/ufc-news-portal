require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('No MONGODB_URI');
    process.exit(1);
}

const NewsSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    publishDate: Date
});

// Avoid OverwriteModelError
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function checkNews() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const latestNews = await News.findOne().sort({ publishDate: -1 });

        if (latestNews) {
            console.log('Latest News Image URL:', latestNews.imageUrl);
        } else {
            console.log('No news found');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkNews();
