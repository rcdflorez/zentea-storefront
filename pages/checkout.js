import Layout from '../src/components/layout';
import { WOOCOMMERCE_COUNTRIES_ENDPOINT } from '../src/utils/constants/endpoints';
import axios from 'axios';
import CheckoutForm from '../src/components/checkout/checkout-form';

export default function Checkout({ headerFooter, countries }) {
	return (
		<Layout headerFooter={headerFooter || {}}>
			<h1>Checkout</h1>
			<CheckoutForm countriesData={countries}/>
		</Layout>
	);
}

export async function getStaticProps() {
	
	let countries = {};
	
	try {
		const countriesResponse = await axios.get( WOOCOMMERCE_COUNTRIES_ENDPOINT );
		countries = countriesResponse.data || {};
	} catch ( error ) {
		if ( process.env.NODE_ENV === 'development' ) {
			console.error( 'Error al obtener países:', error.message );
		}
	}

	return {
		props: {
			headerFooter: {},
			countries: countries || {}
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
