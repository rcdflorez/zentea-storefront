/**
 * External Dependencies.
 */
import { useRouter } from 'next/router';

/**
 * Internal Dependencies.
 */
import { handleRedirectsAndReturnData } from '../../../src/utils/slug';
import { getPosts } from '../../../src/utils/blog';
import Layout from '../../../src/components/layout';
import Posts from '../../../src/components/posts';
import Pagination from '../../../src/components/pagination';

const Page = ( { headerFooter, postsData } ) => {
	const router = useRouter();
	
	// Redirecting to /blog if we are on page 1
	const pageNo = router?.query?.pageNo ?? 1;
	
	if ( 'undefined' !== typeof window && '1' === pageNo ) {
		router.push( '/blog' );
	}
	
	const seo = {
		title: `Blog Page No ${pageNo}`,
		description: 'Blog Page',
		og_image: [],
		og_site_name: 'React WooCommerce Theme',
		robots: {
			index: 'index',
			follow: 'follow',
		},
	}
	
	return (
		<Layout headerFooter={ headerFooter || {} } seo={ seo }>
			<h1>Blog</h1>
			<Posts posts={ postsData?.posts_data ?? [] }/>
			<Pagination pagesCount={ postsData?.page_count ?? 0 } postName="blog"/>
		</Layout>
	);
};

export default Page;

export async function getStaticProps( { params } ) {
	// Note: pageNo data type is string
	const { pageNo } = params || {};
	
	const { data: postsData } = await getPosts( pageNo );
	
	const defaultProps = {
		props: {
			headerFooter: {},
			postsData: postsData || {},
		},
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
	
	return handleRedirectsAndReturnData( defaultProps, postsData, 'posts_data' );
}

export async function getStaticPaths() {
	const { data: postsData } = await getPosts();
	
	const pagesCount = postsData?.page_count ?? 0;
	const paths = new Array( pagesCount ).fill( '' ).map( ( _, index ) => ( {
		params: {
			pageNo: ( index + 1 ).toString(),
		},
	} ) );
	
	return {
		paths: [ ...paths ],
		fallback: false,
	};
}
