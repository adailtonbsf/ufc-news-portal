require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { Readable } = require('stream');

// Mock simple file buffer
const buffer = Buffer.from('Hello Google Drive OAuth2', 'utf-8');
const filename = `test-upload-oauth-${Date.now()}.txt`;
const mimeType = 'text/plain';

console.log('Testing OAuth2 upload to Drive...');

async function test() {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error('Missing OAuth credentials in .env.local');
        }

        console.log('Authenticating with OAuth2...');
        const auth = new google.auth.OAuth2(clientId, clientSecret);
        auth.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({ version: 'v3', auth });

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const media = {
            mimeType: mimeType,
            body: stream,
        };

        console.log('Uploading file...');
        const res = await drive.files.create({
            resource: {
                name: filename,
                parents: folderId ? [folderId] : []
            },
            media: media,
            fields: 'id, webViewLink'
        });

        console.log('Success! File ID:', res.data.id);
        console.log('Link:', res.data.webViewLink);

        // Also test making it public (as the app does)
        console.log('Setting permissions...');
        await drive.permissions.create({
            fileId: res.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        console.log('Permissions updated to Public.');

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
