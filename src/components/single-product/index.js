/**
 * Internal Dependencies.
 */
import { useEffect } from 'react';
import AddToCart from '../cart/add-to-cart';
import ExternalLink from '../products/external-link';
import ProductGallery from './product-gallery';

const SingleProduct = ( { product } ) => {
	// Debug opcional en browser: set NEXT_PUBLIC_DEBUG_PRODUCT=true
	const debugProduct = process.env.NEXT_PUBLIC_DEBUG_PRODUCT === 'true';
	useEffect( () => {
		if ( ! debugProduct ) {
			return;
		}
		// Imprimir info solo cuando cambie el producto
		console.log( '=== PRODUCTO EN EL COMPONENTE ===' );
		console.log( 'Producto completo:', product );
		console.log( 'Claves del producto:', Object.keys( product || {} ) );
		console.log( 'Imágenes:', product?.images );
		if ( product?.images && product.images.length > 0 ) {
			console.log( 'Primera imagen completa:', product.images[0] );
			console.log( 'Campos de la primera imagen:', Object.keys( product.images[0] ) );
		}
		console.log( '================================' );
	}, [ debugProduct, product ] );
	
	// Asegurar que images sea un array
	const productImages = product?.images || [];
	
	return Object.keys( product ).length ? (
		<div className="single-product container mx-auto my-32 px-4 xl:px-0">
			<div className="grid md:grid-cols-2 gap-4">
				<div className="product-images">
					
					{ productImages.length ? (
						<ProductGallery items={ productImages }/>
					) : (
						<div className="w-full h-64 bg-gray-200 flex items-center justify-center">
							<span className="text-gray-500">No hay imagen disponible</span>
						</div>
					) }
				</div>
				<div className="product-info">
					<h4 className="products-main-title text-2xl uppercase">{ product.name }</h4>
					<div
						
						dangerouslySetInnerHTML={ {
							__html: product.description,
						} }
						className="product-description mb-5"
					/>
					<div
						
						dangerouslySetInnerHTML={ {
							__html: product?.price_html ?? '',
						} }
						className="product-price mb-5"
					/>
					{ 'simple' === product?.type ? <AddToCart product={ product }/> : null }
					{
						'external' === product?.type ?
							<ExternalLink
								url={ product?.external_url ?? '' }
								text={ product?.button_text ?? '' }
							/> : null
					}
				</div>
			</div>
		
		</div>
	) : null;
	
};

export default SingleProduct;
