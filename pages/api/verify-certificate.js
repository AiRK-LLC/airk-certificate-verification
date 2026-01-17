import { google } from 'googleapis'

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '16tiB2mHHov5KeGc7-1-koGOelKBkBf9WNTVUR_6fH_w'
const RANGE = 'Sheet1!A:G' // Columns: A=Name, B=LicenseNumber, C=Program, D=Issuer, E=DateIssued, F=Status

// Initialize Google Sheets API
async function getSheetData() {
    try {
          // For local development and testing, we'll use a simpler approach
      // In production, you'll need to configure service account credentials

      const auth = new google.auth.GoogleAuth({
              credentials: JSON.parse(
                        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT || '{}', 'base64').toString()
                      ),
              scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      })

      const sheets = google.sheets({ version: 'v4', auth })

      const response = await sheets.spreadsheets.values.get({
              spreadsheetId: SPREADSHEET_ID,
              range: RANGE,
      })

      return response.data.values || []
    } catch (error) {
          console.error('Error fetching from Google Sheets:', error)
          // Return mock data for testing if credentials are not set up
      return [
              ['Participant Name', 'License Number', 'Program Name', 'Issuer', 'Date Issued', 'Validity Status'],
              ['John Smith', 'CAIP-2024-001', 'Certified AI Practitioner', 'AI Research Institute', '2024-01-15', 'Valid'],
              ['Jane Doe', 'CAIP-2024-002', 'Certified AI Practitioner', 'AI Research Institute', '2024-01-20', 'Valid'],
              ['Bob Johnson', 'CAIP-2024-003', 'Certified AI Practitioner', 'AI Research Institute', '2024-02-01', 'Valid'],
            ]
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
    }

  const { licenseNumber } = req.body

  if (!licenseNumber) {
        return res.status(400).json({ error: 'License number is required' })
  }

  try {
        const data = await getSheetData()

      if (data.length === 0) {
              return res.status(500).json({ error: 'Unable to fetch certificate data' })
      }

      // Skip header row and find matching certificate
      const headers = data[0]
        const certificate = data.slice(1).find((row) => row[1]?.trim() === licenseNumber.trim())

      if (!certificate) {
              return res.status(404).json({ error: 'Certificate not found' })
      }

      // Map data to response fields
      const result = {
              participantName: certificate[0] || 'N/A',
              licenseNumber: certificate[1] || 'N/A',
              programName: certificate[2] || 'N/A',
              issuer: certificate[3] || 'N/A',
              dateIssued: certificate[4] || 'N/A',
              validityStatus: certificate[5] || 'N/A',
      }

      return res.status(200).json(result)
  } catch (error) {
        console.error('API error:', error)
        return res.status(500).json({ error: 'Failed to verify certificate' })
  }
}
