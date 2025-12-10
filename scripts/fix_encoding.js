const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    if (fs.existsSync(envPath)) {
        const buffer = fs.readFileSync(envPath);
        let content = buffer.toString('utf8');

        // Check for null bytes (common in UTF-16LE)
        if (content.indexOf('\0') !== -1 || buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log('⚠️ Detected UTF-16LE encoding. Converting to UTF-8...');
            content = buffer.toString('utf16le');
        }

        // Clean up content (remove BOM, trim)
        content = content.replace(/^\uFEFF/, '').trim();

        // Write back as standard UTF-8
        fs.writeFileSync(envPath, content, { encoding: 'utf8' });
        console.log('✅ File converted to UTF-8 successfully.');
        console.log('Preview:', content.substring(0, 50) + '...');
    } else {
        console.log('❌ .env.local not found.');
    }
} catch (e) {
    console.error('❌ Error fixing encoding:', e);
}
