/**
 * Internal Dependencies.
 */
import Products from '../src/components/products';
import { getProductsData } from '../src/utils/products';
import Layout from '../src/components/layout';

export default function Home({ headerFooter, products }) {
	const seo = {
		title: 'Next JS WooCommerce REST API',
		description: 'Next JS WooCommerce Theme',
		og_image: [],
		og_site_name: 'React WooCommerce Theme',
		robots: {
			index: 'index',
			follow: 'follow',
		},
	}
	return (
		<Layout headerFooter={ headerFooter || {} } seo={ seo }>
			<Products products={products}/>
		</Layout>
	)
}

export async function getStaticProps() {
	
	let products = [];
	
	// Manejar errores al obtener productos
	// Reducir a 12 productos iniciales para mejorar performance
	try {
		const productsResponse = await getProductsData( 12 );
		products = productsResponse?.data ?? [];
	} catch ( error ) {
		if ( process.env.NODE_ENV === 'development' ) {
			console.error( 'Error al obtener productos:', error.message );
		}
		// Continuar con valores por defecto
		products = [];
	}
	
	return {
		props: {
			headerFooter: {},
			products: Array.isArray( products ) ? products : []
		},
		
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
}
