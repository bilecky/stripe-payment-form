import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const StripeForm: React.FC = () => {
	const [country, setCountry] = useState('Wybierz kraj')
	const [cardOwner, setCardOwner] = useState('Imię i Nazwisko')
	const [error, setError] = useState<string | null | undefined>(null)
	const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
	const stripe = useStripe()
	const elements = useElements()

	const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedCountry = event.target.value
		setCountry(selectedCountry)

      switch (selectedCountry) {
         case 'PL':
           setCardOwner('Jan Kowalski');
           break;
         case 'US':
           setCardOwner('John Doe');
           break;
         case 'Wybierz kraj':
           setCardOwner('Imie i Nazwisko');
           break;
         default:
           // przy rozwinieciu apki defaultowy placeholder
           break;
       }
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!stripe || !elements) {
			//jesli stripe sie nie zaladuje to konczymy akcje
			return
		}

		const cardElement = elements.getElement(CardElement)

		const { error } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement!,
			billing_details: {
				name: cardOwner,
			},
		})

		if (error) {
			setError(error.message)
		} else {
			setError(null)
			setPaymentStatus('Płatność testowa zakończona powodzeniem')
			// np paymentMethod.id na serwer przy dzialajacej apce
		}
	}

	return (
		<div className='flex items-center justify-center h-screen bg-gray-200  tracking-wide'>
			<form
				onSubmit={handleSubmit}
				className='w-[500px] h-[420px] max-w-xl p-8 bg-white rounded shadow-md'
			>
				<div className='mb-6'>
					<label htmlFor='country' className='block text-gray-700 text-lg font-bold mb-2'>
						Kraj:
					</label>
					<select
						id='country'
						value={country}
						onChange={handleCountryChange}
						className='w-full py-2 px-3 text-gray-700 border rounded  focus:outline-none focus:shadow-outline'
					>
						<option selected>Wybierz kraj</option>

						<option value='PL'>Polska</option>
						<option value='US'>USA</option>
					</select>
				</div>
				<div className='mb-6'>
					<label
						htmlFor='card-owner'
						className='block text-gray-700 text-lg font-bold mb-2'
					>
						Właściciel karty:
					</label>
					<input
						id='card-owner'
						type='text'
						onChange={event => setCardOwner(event.target.value)}
						value={cardOwner}
						className='w-full py-2 px-3 text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-6'>
					<label
						htmlFor='card-element'
						className='block text-gray-700 text-lg font-bold mb-2'
					>
						Dane karty:{' '}
					</label>
					<CardElement className='w-full py-2 px-3 text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' />
				</div>
				<button
					type='submit'
					disabled={!stripe}
					className='w-full py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
				>
					Zapłać
				</button>
				{error && <div className='mt-2 text-lg text-red-500'>{error}</div>}
				{paymentStatus && (
					<div className='mt-2 text-lg text-green-500'>{paymentStatus}</div>
				)}
			</form>
		</div>
	)
}

export default StripeForm
