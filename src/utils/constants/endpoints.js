/**
 * IMPORTANT:
 * During CI/build (e.g. Vercel), env vars might not be configured yet.
 * Use a safe default so builds don't crash just because the base URL is undefined.
 */
const WORDPRESS_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://zentea.com';

export const HEADER_FOOTER_ENDPOINT = `${ WORDPRESS_BASE_URL }/wp-json/rae/v1/header-footer?header_location_id=hcms-menu-header&footer_location_id=hcms-menu-footer`;
export const GET_POSTS_ENDPOINT = `${ WORDPRESS_BASE_URL }/wp-json/rae/v1/posts`;
export const GET_POST_ENDPOINT = `${ WORDPRESS_BASE_URL }/wp-json/wp/v2/posts`;
export const GET_PAGES_ENDPOINT = `${ WORDPRESS_BASE_URL }/wp-json/wp/v2/pages`;
export const COMMENTS_ENDPOINT = `${ WORDPRESS_BASE_URL }/wp-json/wp/v2/comments`;

/**
 * Cart
 * @type {string}
 */
export const CART_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL }/wp-json/rae/v1/cart/items/`;

// Countries and States
export const WOOCOMMERCE_COUNTRIES_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL }/wp-json/rae/v1/wc/countries/`;
export const WOOCOMMERCE_STATES_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL }/wp-json/rae/v1/wc/states`;
