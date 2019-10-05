import {
	getAmiiboCache,
	getSeriesCache,
	saveAmiiboCache,
	saveSeriesCache
} from '../utils/cache';

const BASE_URL = 'https://www.amiiboapi.com/api';
const ALL_AMIIBOS = 'All Amiibos';

const amiiboSort = (a, b) => {
	if (a.amiiboSeries < b.amiiboSeries){
		return -1;
	} else if (a.amiiboSeries > b.amiiboSeries){
		return 1;
	} else if(a.type > b.type) {
		return -1;
	} else if(a.type < b.type) {
		return 1;
	} else {
		return 0;
	}
};

const updateFormat = res => res.amiibo.map(({head, tail, ...a}) => (
	Object.assign(a, {keyID: head + tail})
));

const storeCache = (fn, res, ...args) => {
	fn(...args, res);
	return res;
};

export function getSeries() {
	const cache = getSeriesCache();
	if (cache) return Promise.resolve(cache);

	return window.fetch(`${BASE_URL}/amiiboseries`)
		.then(res => res.json())
		.then(res => res.amiibo)
		.then(res => storeCache(saveSeriesCache, res))
}

export function getAmiibos(series = ALL_AMIIBOS) {
	const cache = getAmiiboCache(series);
	if (cache) return Promise.resolve(cache);

	if(series !== ALL_AMIIBOS) {
		console.log(`Fetching ${BASE_URL}/amiibo/?amiiboSeries=${encodeURIComponent(series)}`);
		return window.fetch(`${BASE_URL}/amiibo/?amiiboSeries=${encodeURIComponent(series)}`)
			.then(res => res.json())
			.then(res => updateFormat(res))
			.then(res => res.amiibo.sort(amiiboSort))
			.then(res => storeCache(saveAmiiboCache, res, series))
	} else {
		console.log(`Fetching ${BASE_URL}/amiibo/`);
		return window.fetch(`${BASE_URL}/amiibo/`)
			.then(res => res.json())
			.then(res => updateFormat(res))
			.then(res => res.amiibo.sort(amiiboSort))
			.then(res => storeCache(saveAmiiboCache, res, ALL_AMIIBOS))
	}
}
