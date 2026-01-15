import Layout from '../src/components/layout';
import CartItemsContainer from '../src/components/cart/cart-items-container';

export default function Cart({ headerFooter }) {
	return (
		<Layout headerFooter={headerFooter || {}}>
			<h1 className="uppercase tracking-0.5px">Cart</h1>
			<CartItemsContainer/>
		</Layout>
	);
}

export async function getStaticProps() {
	
	return {
		props: {
			headerFooter: {},
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
