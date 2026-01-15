/**
 * Zen Events page (from WP Elementor page via custom REST endpoint).
 */

import axios from 'axios';
import Layout from '../src/components/layout';
import Image from '../src/components/image';

export default function EventsPage( { events } ) {
	const seo = {
		title: 'Classes & Events',
		description: 'ZenTea Classes & Events',
		og_image: [],
		og_site_name: 'ZenTea',
		robots: {
			index: 'index',
			follow: 'follow',
		},
	};

	return (
		<Layout headerFooter={ {} } seo={ seo } uri="/events">
			<div className="px-4 xl:px-0">
				<h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Classes &amp; Events</h1>

				{ ! events?.length ? (
					<p>No events available right now.</p>
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{ events.map( ( ev, idx ) => {
							const imgSrc = ev?.image?.src ?? '';
							return (
								<div
									key={ ev?.register_url || `${ ev?.title ?? 'event' }-${ idx }` }
									className="border border-gray-200 rounded-lg overflow-hidden bg-white"
								>
									{ imgSrc ? (
										<div className="w-full h-64 relative">
											<Image
												sourceUrl={ imgSrc }
												altText={ ev?.title ?? 'Event image' }
												title={ ev?.title ?? '' }
												layout="fill"
												containerClassNames="w-full h-64"
											/>
										</div>
									) : null }

									<div className="p-5">
										<h2 className="text-xl font-semibold mb-2">{ ev?.title ?? 'Untitled event' }</h2>
										{ ev?.description ? <p className="text-gray-700 mb-3">{ ev.description }</p> : null }

										<div className="text-sm text-gray-600 space-y-1 mb-4">
											{ ev?.date_time ? <p>{ ev.date_time }</p> : null }
											{ ev?.location ? <p>{ ev.location }</p> : null }
										</div>

										{ ev?.register_url ? (
											<a
												href={ ev.register_url }
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-700"
											>
												Click to Register
											</a>
										) : null }
									</div>
								</div>
							);
						} ) }
					</div>
				) }
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const wpBase = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://zentea.com';
	const url = `${ wpBase }/wp-json/zentea/v1/zen-events?limit=50&offset=0`;

	let events = [];
	try {
		const res = await axios.get( url, { timeout: 10000 } );
		events = res?.data?.events ?? [];
	} catch ( err ) {
		if ( process.env.NODE_ENV === 'development' ) {
			// eslint-disable-next-line no-console
			console.warn( 'Failed to fetch zen-events:', err?.message || err );
		}
		events = [];
	}

	return {
		props: {
			events,
		},
		// Refresh periodically (ISR). Not instant, but keeps it updated.
		revalidate: 60,
	};
}

