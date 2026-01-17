import { google } from 'googleapis'

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '16tiB2mHHov5KeGc7-1-koGOelKBkBf9WNTVUR_6fH_w'
const RANGE = process.env.GOOGLE_SHEETS_RANGE || 'Participants!A2:H100'

// Initialize Google Sheets API
async function getSheetData() {
          try {
                      // Parse and properly format the Google Service Account credentials
            // Handle both formats: "key\nvalue" and "key\\nvalue"
            let privateKey = process.env.GOOGLE_PRIVATE_KEY
                      if (!privateKey) {
                                    throw new Error('Missing GOOGLE_PRIVATE_KEY environment variable')
                      }

            // Replace escaped newlines with actual newlines
            privateKey = privateKey.replace(/\\n/g, '\n')

            const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

            if (!serviceAccountEmail) {
                          throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable')
            }

            // Create credentials object for googleapis
            const credentials = {
                          type: 'service_account',
                          project_id: process.env.GOOGLE_PROJECT_ID,
                          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                          private_key: privateKey,
                          client_email: serviceAccountEmail,
                          client_id: process.env.GOOGLE_CLIENT_ID,
                          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                          token_uri: 'https://oauth2.googleapis.com/token',
                          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                          client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
            }

            // Log diagnostic info (without sensitive data)
            console.log('Attempting to authenticate with service account:', serviceAccountEmail)
                      console.log('Project ID:', process.env.GOOGLE_PROJECT_ID)

            const auth = new google.auth.GoogleAuth({
                          credentials,
                          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            })

            const sheets = google.sheets({ version: 'v4', auth })

            const response = await sheets.spreadsheets.values.get({
                          spreadsheetId: SPREADSHEET_ID,
                          range: RANGE,
            })

            if (!response.data.values || response.data.values.length === 0) {
                          console.warn('No data returned from Google Sheets')
                          return []
            }

            return response.data.values
          } catch (error) {
                      console.error('Error fetching from Google Sheets:', error.message)
                      console.error('Error details:', error)
                      throw error
          }
}

export default async function handler(req, res) {
          // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
              return res.status(200).end()
  }

  if (req.method !== 'POST') {
              return res.status(405).json({ error: 'Method not allowed' })
  }

  const { licenseNumber } = req.body

  if (!licenseNumber || typeof licenseNumber !== 'string') {
              return res.status(400).json({ error: 'License number is required and must be a string' })
  }

  try {
              const data = await getSheetData()

            if (data.length === 0) {
                          return res.status(500).json({ error: 'Unable to fetch certificate data' })
            }

            // Find matching certificate (license number is in column C, index 2)
            const certificate = data.find((row) => {
                          return row[2] && row[2].trim() === licenseNumber.trim()
            })

            if (!certificate) {
                          return res.status(404).json({ error: 'Certificate not found' })
            }

            // Map data to response fields
            // Columns: A=Name, B=Email, C=License No., D=Certificate PDF, E=Password, F=Referrals, G=PasswordSent, H=DateCompleted
            const result = {
                          participantName: certificate[0] || 'N/A',
                          licenseNumber: certificate[2] || 'N/A',
                          email: certificate[1] || 'N/A',
                          certificatePDF: certificate[3] || 'N/A',
                          password: certificate[4] || 'N/A',
                          referralStatus: certificate[5] || 'N/A',
                          passwordSent: certificate[6] || 'N/A',
                          dateCompleted: certificate[7] || 'N/A',
            }

            return res.status(200).json(result)
  } catch (error) {
              console.error('API error:', error.message)

            if (error.message.includes('invalid_grant')) {
                          return res.status(500).json({
                                          error: 'Google authentication failed - service account credentials may be invalid or expired',
                                          details: 'Check that GOOGLE_PRIVATE_KEY is properly formatted and service account is active',
                          })
            }

            if (error.message.includes('SyntaxError') || error.message.includes('JSON')) {
                          return res.status(500).json({
                                          error: 'Invalid credentials format - please check GOOGLE_PRIVATE_KEY environment variable',
                          })
            }

            if (error.message.includes('credentials')) {
                          return res.status(500).json({
                                          error: 'Missing or invalid Google Service Account credentials',
                          })
            }

            return res.status(500).json({ error: 'Failed to verify certificate: ' + error.message })
  }
}
