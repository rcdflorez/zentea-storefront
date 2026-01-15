/**
 * Internal Dependencies.
 */
import { getProductsData, getProductBySlug } from '../../src/utils/products';
import Layout from '../../src/components/layout';
import SingleProduct from '../../src/components/single-product';

/**
 * External Dependencies.
 */
import { useRouter } from 'next/router';

export default function Product( { headerFooter, product } ) {
	
	const router = useRouter();
	
	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if ( router.isFallback ) {
		return <div>Loading...</div>;
	}
	
	return (
		<Layout
			headerFooter={ headerFooter || {} }
			seo={ product?.yoast_head_json ?? {} }
			uri={ `/product/${ product?.slug ?? '' }` }
		>
			<SingleProduct product={ product }/>
		</Layout>
	);
}

export async function getStaticProps( { params } ) {
	
	const { slug } = params || {};
	let product = [];
	
	try {
		const productResponse = await getProductBySlug( slug );
		product = productResponse?.data ?? [];
		
		// Debug opcional: set DEBUG_PRODUCT=true para imprimir el objeto completo en consola del server
		if ( process.env.DEBUG_PRODUCT === 'true' ) {
			// Imprimir toda la información del producto disponible vía API
			console.log( '=== INFORMACIÓN COMPLETA DEL PRODUCTO VÍA API ===' );
			console.log( 'Respuesta completa de la API:', productResponse );
			console.log( 'Datos del producto:', product );
			if ( product.length > 0 ) {
				console.log( 'Primer producto (objeto completo):', product[0] );
				console.log( 'Estructura del producto:', Object.keys( product[0] ) );
				console.log( 'Imágenes del producto:', product[0].images );
				if ( product[0].images && product[0].images.length > 0 ) {
					console.log( 'Primera imagen (objeto completo):', product[0].images[0] );
					console.log( 'Campos disponibles en la imagen:', Object.keys( product[0].images[0] ) );
				}
			}
			console.log( '================================================' );
		}
	} catch ( error ) {
		if ( process.env.NODE_ENV === 'development' ) {
			console.error( 'Error al obtener producto:', error.message );
		}
	}
	
	return {
		props: {
			headerFooter: {},
			product: product.length ? product[ 0 ] : {},
		},
		revalidate: 1,
	};
}

export async function getStaticPaths() {
	const { data: products } = await getProductsData();
	
	// Expected Data Shape: [{ params: { slug: 'pendant' } }, { params: { slug: 'shirt' } }],
	const pathsData = [];
	
	products.length && products.map( ( product ) => {
		if ( product.slug ) {
			pathsData.push( { params: { slug: product.slug ?? '' } } );
		}
	} );
	
	return {
		paths: pathsData,
		fallback: true,
	};
}
