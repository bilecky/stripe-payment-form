import './App.css'
import StripeForm from './Components/StripeForm'
import { stripePromise } from './stripe';
import { Elements,  } from '@stripe/react-stripe-js';

function App() {
	return (
		<>
          <Elements stripe={stripePromise}>

			<StripeForm />
      </Elements>
		</>
	)
}

export default App
