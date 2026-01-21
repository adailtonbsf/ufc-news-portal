import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Missing Google Drive OAuth credentials');
    }

    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials({ refresh_token: refreshToken });

    return google.drive({ version: 'v3', auth });
}

export async function uploadToDrive(fileBuffer, filename, mimeType) {
    const drive = getDriveClient();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    const fileMetadata = {
        name: filename,
        parents: folderId ? [folderId] : [],
    };

    const media = {
        mimeType: mimeType,
        body: stream,
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webContentLink, webViewLink',
        });

        const fileId = response.data.id;

        // Make the file public so it can be viewed directly
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Proxy URL - The only reliable way to bypass blocking
        // We return the local API path, passing the Drive ID
        const publicUrl = `/api/image-proxy?id=${fileId}`;

        return {
            fileId,
            publicUrl,
            webViewLink: response.data.webViewLink
        };

    } catch (error) {
        console.error('Google Drive Upload Error:', error);
        throw error;
    }
}
