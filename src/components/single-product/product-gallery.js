import ImageGallery from 'react-image-gallery';

/**
 * Normalize image URL to ensure it uses the correct protocol and domain
 * @param {string} url - The image URL to normalize
 * @return {string} - Normalized URL
 */
const normalizeImageUrl = ( url ) => {
	if ( ! url || typeof url !== 'string' ) {
		return url;
	}
	
	// Si la URL es relativa, convertirla a absoluta usando el dominio de WordPress
	if ( url.startsWith( '/' ) ) {
		const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://zentea.com';
		return `${ wpUrl }${ url }`;
	}
	
	// Si la URL ya es absoluta pero tiene un protocolo diferente, asegurar HTTPS
	if ( url.startsWith( 'http://' ) || url.startsWith( 'https://' ) ) {
		// Si es HTTP, convertir a HTTPS para zentea.com
		if ( url.includes( 'zentea.com' ) && url.startsWith( 'http://' ) ) {
			return url.replace( 'http://', 'https://' );
		}
		return url;
	}
	
	return url;
};

/**
 * Get the best image size URL from WooCommerce image object
 * Uses thumbnail size for better performance instead of full size
 * @param {Object} item - WooCommerce image object
 * @return {Object} - Object with original and thumbnail URLs
 */
const getImageUrls = ( item ) => {
	// WooCommerce API devuelve 'thumbnail' con URL relativa como "/wp-content/uploads/2024/12/image-1-315x315.png"
	// Usar 'thumbnail' para la imagen principal (ya es un tamaño optimizado)
	// Si no existe thumbnail, usar 'src' como fallback
	const originalUrl = item.thumbnail || item.thumb || item.src || item.url || item.source_url || '';
	
	// Para el thumbnail de la galería, usar el mismo campo
	const thumbnailUrl = item.thumbnail || item.thumb || originalUrl;
	
	return {
		original: normalizeImageUrl( originalUrl ),
		thumbnail: normalizeImageUrl( thumbnailUrl ),
	};
};

const ProductGallery = ( { items } ) => {
	if ( ! items || ! Array.isArray( items ) || items.length === 0 ) {
		return null;
	}
	
	// Construct Images with normalized URLs
	// Usar URLs originales - Next.js optimizará automáticamente
	const images = items
		.filter( ( item ) => item ) // Filtrar items nulos o undefined
		.map( ( item ) => getImageUrls( item ) )
		.filter( ( img ) => img.original ); // Filtrar imágenes sin URL válida
	
	if ( images.length === 0 ) {
		return null;
	}
	
	// Configurar react-image-gallery para manejar errores de carga
	return (
		<ImageGallery 
			items={images}
			onErrorImageURL="/placeholder-tea.jpg" // Fallback si la imagen falla
			lazyLoad={true} // Cargar imágenes de forma lazy
		/>
	);
};

export default ProductGallery;
