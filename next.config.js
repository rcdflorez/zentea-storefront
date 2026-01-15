const path = require('path');

// Obtener el dominio de WordPress de forma segura
let allowedImageWordPressDomain = 'zentea.com';
try {
	if ( process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ) {
		const url = new URL( process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL );
		allowedImageWordPressDomain = url.hostname;
	}
} catch ( error ) {
	console.warn( 'Error al parsear NEXT_PUBLIC_WORDPRESS_SITE_URL, usando dominio por defecto:', error.message );
}

module.exports = {
	trailingSlash: false,
	webpack: config => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300
		}
		
		return config
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	},
	/**
	 * We specify which domains are allowed to be optimized.
	 * This is needed to ensure that external urls can't be abused.
	 * @see https://nextjs.org/docs/basic-features/image-optimization#domains
	 */
	images: {
		domains: [ 
			allowedImageWordPressDomain, 
			'secure.gravatar.com',
			'www.zentea.com' // Por si acaso hay redirecciones
		],
		// Removido via.placeholder.com ya que no está accesible
		// Permitir imágenes sin optimización si hay problemas
		unoptimized: false,
		// Manejar errores de imágenes silenciosamente
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
}
