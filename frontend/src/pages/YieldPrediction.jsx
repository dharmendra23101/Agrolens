import YieldForm from '../components/YieldForm'
import Translatable from '../components/Translatable'

function YieldPrediction() {
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
      }}>
        <Translatable>Crop Yield Prediction</Translatable>
      </h1>
      <YieldForm />
    </div>
  )
}

export default YieldPrediction
