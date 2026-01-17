import { useState } from 'react'

export default function Verify() {
    const [licenseNumber, setLicenseNumber] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)

        try {
                const response = await fetch('/api/verify-certificate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ licenseNumber }),
                })

          const data = await response.json()

          if (!response.ok) {
                    setError(data.error || 'Certificate not found')
                    return
          }

          setResult(data)
        } catch (err) {
                setError('Failed to verify certificate. Please try again.')
                console.error(err)
        } finally {
                setLoading(false)
        }
  }

  return (
        <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Verify CAIP Certificate</h1>
      <p>Enter your license number to verify your certificate:</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="licenseNumber" style={{ display: 'block', marginBottom: '5px' }}>
            License Number:
            </label>
          <input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g., CAIP-2024-001"
            required
            style={{
                            padding: '10px',
                            fontSize: '16px',
                            width: '100%',
                            boxSizing: 'border-box',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
            }}
          />
            </div>
        <button
          type="submit"
          disabled={loading}
          style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
{loading ? 'Verifying...' : 'Verify Certificate'}
</button>
  </form>

{error && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
  </div>
      )}

{result && (
          <div style={{ padding: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          <h2 style={{ marginTop: 0 }}>Certificate Verified ✓</h2>
          <div style={{ marginBottom: '10px' }}>
            <strong>Participant Name:</strong> {result.participantName}
  </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>License Number:</strong> {result.licenseNumber}
  </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Program:</strong> {result.programName}
  </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Issuer:</strong> {result.issuer}
  </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Date Issued:</strong> {result.dateIssued}
  </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Validity Status:</strong> {result.validityStatus}
  </div>
  </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Back to home
            </a>
        </div>
            </main>
  )
}
