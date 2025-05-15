import RecommendationForm from '../components/RecommendationForm'

function CropRecommendation() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <h1 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#2f855a',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>Crop Recommendation</h1>
      <RecommendationForm />
    </div>
  )
}

export default CropRecommendation