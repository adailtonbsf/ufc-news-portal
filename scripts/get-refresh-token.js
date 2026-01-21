const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

async function main() {
  console.log('DEBUG: Loaded Env Vars');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Found' : 'Missing');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Found' : 'Missing');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local');
    // Debug: print raw file content if possible (careful with secrets logs, but user sees local terminal)
    // Actually, let's not print secrets.
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI
  );

  // Generate the url that will be used for authorization
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Crucial for getting a refresh token
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent' // Force consent to ensure we get a refresh token
  });

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url.indexOf('/oauth2callback') > -1) {
        const qs = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
        const code = qs.get('code');

        res.end('Authentication successful! You can close this tab. Check your terminal.');
        server.close();

        console.log('✅ Authorization code received.');
        
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\n✨ REFRESH TOKEN RECEIVED! ✨\n');
        console.log(tokens.refresh_token);
        console.log('\n-----------------------------------\n');
        
        if (tokens.refresh_token) {
            console.log('Copy the Refresh Token above and add it to your .env.local as GOOGLE_REFRESH_TOKEN');
        } else {
            console.log('⚠️ No Refresh Token received. Did you already authorize this app? Go to https://myaccount.google.com/permissions and remove access for this app, then try again.');
        }

        process.exit(0);
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }).listen(PORT, () => {
    console.log(`\n👉 Open this URL in your browser to authorize:\n\n${authorizeUrl}\n`);
    console.log(`Waiting for callback on ${REDIRECT_URI}...`);
  });
}

main().catch(console.error);
