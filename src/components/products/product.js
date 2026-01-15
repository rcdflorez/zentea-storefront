import Link from 'next/link';
import Image from '../image';
import { sanitize } from '../../utils/miscellaneous';
import AddToCart from '../cart/add-to-cart';
import { isEmpty } from 'lodash';
import ExternalLink from './external-link';

const Product = ( { product } ) => {
	
	if ( isEmpty( product ) ) {
		return null;
	}
	
	const img = product?.images?.[0] ?? {};
	const productType = product?.type ?? '';
	
	// Usar 'thumbnail' que viene de WooCommerce (ej: "/wp-content/uploads/2024/12/image-1-315x315.png")
	// Es más pequeño que 'src' (full size) y carga más rápido
	const imageUrl = img.thumbnail || img.thumb || img.src || img.url || img.source_url || '';
	
	return (
		<div className="mt-4 mb-8 px-3 w-full overflow-hidden sm:w-1/2 md:w-1/3 xl:w-1/4">
			<Link href={ `/product/${ product?.slug }`} >
				<a>
					<Image
						sourceUrl={ imageUrl }
						altText={ img?.alt ?? ''}
						title={ product?.name ?? '' }
						width="380"
						height="380"
					/>
					<h6 className="font-bold uppercase my-2 tracking-0.5px">{ product?.name ?? '' }</h6>
					<div className="mb-4" dangerouslySetInnerHTML={{ __html: sanitize( product?.price_html ?? '' ) }}/>
				</a>
			</Link>
			
			{ 'simple' === productType ? <AddToCart product={product}/> : null }
			{
				'external' === productType ?
					<ExternalLink
						url={ product?.external_url ?? '' }
						text={ product?.button_text ?? '' }
					/> : null
			}
		</div>
	)
}

export default Product;
