# CAIP Certificate Verification System - Setup Guide

## Project Structure

```
airk-certificate-verification/
├── pages/
│   ├── api/
│   │   └── verify-certificate.js    # API endpoint for certificate verification
│   ├── index.js                      # Home page
│   └── verify.js                     # Certificate verification page
├── package.json                      # Dependencies and scripts
├── next.config.js                    # Next.js configuration
├── .gitignore                        # Git ignore rules
├── README.md                         # Project documentation
└── SETUP.md                          # This file
```

## Quick Start - Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Test the Application
- **Home Page**: Navigate to http://localhost:3000
- - **Verify Certificate**: Go to http://localhost:3000/verify
  - - **Test with Sample Data**: Use one of these license numbers:
    -   - CAIP-2024-001 (John Smith)
        -   - CAIP-2024-002 (Jane Doe)
            -   - CAIP-2024-003 (Bob Johnson)
             
                - ## Deployment to Vercel
             
                - ### 1. Push Code to GitHub
                - Make sure your code is committed and pushed to the GitHub repository.
             
                - ### 2. Import Project to Vercel
                - 1. Go to https://vercel.com/dashboard
                  2. 2. Click "Add New" → "Project"
                     3. 3. Import your GitHub repository: `AiRK-LLC/airk-certificate-verification`
                        4. 4. Framework preset will auto-detect "Next.js"
                           5. 5. Click "Deploy"
                             
                              6. ### 3. Configure Environment Variables (if using Google Sheets authentication)
                              7. 1. After deployment, go to your project settings on Vercel
                                 2. 2. Go to "Environment Variables"
                                    3. 3. Add the following variables (if needed for production):
                                       4.    - `GOOGLE_SHEETS_ID`: Your Google Sheets ID (currently: `16tiB2mHHov5KeGc7-1-koGOelKBkBf9WNTVUR_6fH_w`)
                                             -    - `GOOGLE_SERVICE_ACCOUNT`: Your Google Service Account JSON (base64 encoded) - optional
                                              
                                                  - ### 4. View Live Application
                                                  - Your application will be live at: `https://airk-certificate-verification.vercel.app`
                                              
                                                  - ## API Endpoint
                                              
                                                  - ### POST /api/verify-certificate
                                              
                                                  - Verifies a certificate based on the license number.
                                              
                                                  - **Request:**
                                                  - ```json
                                                    {
                                                      "licenseNumber": "CAIP-2024-001"
                                                    }
                                                    ```

                                                    **Success Response (200):**
                                                    ```json
                                                    {
                                                      "participantName": "John Smith",
                                                      "licenseNumber": "CAIP-2024-001",
                                                      "programName": "Certified AI Practitioner",
                                                      "issuer": "AI Research Institute",
                                                      "dateIssued": "2024-01-15",
                                                      "validityStatus": "Valid"
                                                    }
                                                    ```

                                                    **Error Response (404):**
                                                    ```json
                                                    {
                                                      "error": "Certificate not found"
                                                    }
                                                    ```

                                                    ## Google Sheets Integration

                                                    The application reads certificate data from a Google Sheet. The current sheet ID is:
                                                    ```
                                                    16tiB2mHHov5KeGc7-1-koGOelKBkBf9WNTVUR_6fH_w
                                                    ```

                                                    ### Sheet Format
                                                    Column A: Participant Name
                                                    Column B: License Number
                                                    Column C: Program Name
                                                    Column D: Issuer
                                                    Column E: Date Issued
                                                    Column F: Validity Status

                                                    ### To Use Your Own Google Sheet

                                                    1. Create a new Google Sheet with the certificate data in the format above
                                                    2. 2. Copy the sheet ID from the URL (the long alphanumeric string)
                                                       3. 3. Set the environment variable: `GOOGLE_SHEETS_ID=your-sheet-id`
                                                         
                                                          4. ### Google Service Account Setup (Optional - for Production)
                                                         
                                                          5. For production, you should configure proper authentication:
                                                         
                                                          6. 1. Create a Google Cloud Project
                                                             2. 2. Create a Service Account with Sheets API access
                                                                3. 3. Download the JSON credentials
                                                                   4. 4. Encode it as base64
                                                                      5. 5. Set as `GOOGLE_SERVICE_ACCOUNT` environment variable
                                                                        
                                                                         6. ## Building for Production
                                                                        
                                                                         7. ### Build the Application
                                                                         8. ```bash
                                                                            npm run build
                                                                            ```

                                                                            ### Start Production Server
                                                                            ```bash
                                                                            npm run start
                                                                            ```

                                                                            ## Troubleshooting

                                                                            ### Port Already in Use
                                                                            If port 3000 is already in use:
                                                                            ```bash
                                                                            npm run dev -- -p 3001
                                                                            ```

                                                                            ### Module Not Found Errors
                                                                            Make sure all dependencies are installed:
                                                                            ```bash
                                                                            rm -rf node_modules package-lock.json
                                                                            npm install
                                                                            ```

                                                                            ### Google Sheets Connection Issues
                                                                            - The API will fall back to mock data if credentials are not configured
                                                                            - - Check that the GOOGLE_SHEETS_ID environment variable is correct
                                                                              - - Make sure your Google Sheet is shared appropriately
                                                                               
                                                                                - ## Features
                                                                               
                                                                                - ✅ Certificate verification by license number
                                                                                - ✅ Integration with Google Sheets for certificate data
                                                                                - ✅ Responsive UI design
                                                                                - ✅ Error handling and validation
                                                                                - ✅ Fast deployment to Vercel
                                                                                - ✅ Public-facing endpoint (no authentication required)
                                                                               
                                                                                - ## Support
                                                                               
                                                                                - For issues or questions, please contact the AiRK-LLC team.
