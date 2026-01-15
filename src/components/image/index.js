import Img from 'next/image';

import PropTypes from 'prop-types';
import cx from 'classnames';
import {DEFAULT_IMG_URL} from '../../utils/constants/images';

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
 * Image Component.
 * We don't need to add srcSet, as Next js will generate that.
 * @see https://nextjs.org/docs/api-reference/next/image#other-props
 * @see https://nextjs.org/docs/basic-features/image-optimization#device-sizes
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Image = ( props ) => {
	const {altText, title, width, height, sourceUrl, className, layout, objectFit, containerClassNames, showDefault, ...rest} = props;
	
	// Normalizar la URL de la imagen
	const normalizedUrl = sourceUrl ? normalizeImageUrl( sourceUrl ) : '';
	
	// Si no hay URL y no se debe mostrar default, retornar null
	if ( ! normalizedUrl && ! showDefault ) {
		return null;
	}
	
	// Si no hay URL pero showDefault es true, usar placeholder local
	const finalUrl = normalizedUrl || ( showDefault ? DEFAULT_IMG_URL : '' );
	
	// Si aún no hay URL válida, retornar null
	if ( ! finalUrl ) {
		return null;
	}
	
	/**
	 * If we use layout = fill then, width and height of the image cannot be used.
	 * and the image fills on the entire width and the height of its parent container.
	 * That's we need to wrap our image in a container and give it a height and width.
	 * Notice that in this case, the given height and width is being used for container and not img.
	 */
	if ( 'fill' === layout ) {
		const attributes = {
			alt: altText || title,
			src: finalUrl,
			layout: 'fill',
			className: cx( 'object-cover', className ),
			onError: ( e ) => {
				// Si la imagen falla, ocultarla silenciosamente
				e.target.style.display = 'none';
			},
			...rest
		};
		
		return (
			<div className={cx( 'relative', containerClassNames ) }>
				<Img {...attributes}/>
			</div>
		);
	} else {
		const attributes = {
			alt: altText || title,
			src: finalUrl,
			width: width || 'auto',
			height: height || 'auto',
			className,
			onError: ( e ) => {
				// Si la imagen falla, ocultarla silenciosamente
				e.target.style.display = 'none';
			},
			...rest
		};
		return <Img {...attributes} />;
	}
};

Image.propTypes = {
	altText: PropTypes.string,
	title: PropTypes.string,
	sourceUrl: PropTypes.string,
	layout: PropTypes.string,
	showDefault: PropTypes.bool,
	containerClassName: PropTypes.string,
	className: PropTypes.string
};

Image.defaultProps = {
	altText: '',
	title: '',
	sourceUrl: '',
	showDefault: true,
	containerClassNames: '',
	className: 'product__image',
};

export default Image;
