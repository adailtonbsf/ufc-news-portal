require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('No MONGODB_URI in .env.local');
    process.exit(1);
}

const NewsSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    publishDate: Date
});

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function migrateImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB...');

        // Find items with Drive URLs (old or lh3)
        const newsItems = await News.find({
            imageUrl: { $regex: 'google' }
        });
        console.log(`Found ${newsItems.length} items with Google URLs.`);

        let updatedCount = 0;

        for (const item of newsItems) {
            let fileId = null;

            // Extract File ID from various known formats
            if (item.imageUrl.includes('id=')) {
                // ...uc?export=view&id=FILE_ID
                // .../api/image-proxy?id=FILE_ID
                fileId = item.imageUrl.split('id=')[1].split('&')[0];
            } else if (item.imageUrl.includes('/d/')) {
                // .../d/FILE_ID
                fileId = item.imageUrl.split('/d/')[1].split('/')[0];
            }

            if (fileId) {
                // Convert to Proxy URL
                const newUrl = `/api/image-proxy?id=${fileId}`;

                // Only update if it's different
                if (item.imageUrl !== newUrl) {
                    console.log(`Migrating: ${item.title}`);
                    console.log(`  Old: ${item.imageUrl}`);
                    console.log(`  New: ${newUrl}`);

                    item.imageUrl = newUrl;
                    await item.save();
                    updatedCount++;
                }
            }
        }

        console.log('-----------------------------------');
        console.log(`Migration complete. Updated ${updatedCount} news items.`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

migrateImages();
