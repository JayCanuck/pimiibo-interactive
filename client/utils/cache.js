const loadCachedValue = key => {
	const result = window.localStorage.getItem(key);
	if (result) {
		try {
			return JSON.parse(result);
		} catch (e) {
			// Do nothing on failure
		}
	}
}

export function applySeriesCache(state) {
	state.series = loadCachedValue('amiibo-series') || state.series;
	return state;
}

export function applyAmiiboCache(state, hash) {
	state.amiibos[hash] = loadCachedValue(`amiibo-${hash}`) || state.amiibos[hash];
}

export function saveSeriesCache(state) {
	window.localStorage.setItem('amiibo-series', JSON.stringify(state.series));
	return state;
}

export function applyAmiiboCache(state, hash) {
	window.localStorage.setItem(`amiibo-${hash}`, JSON.stringify(state.amiibos[hash]));
	return state;
}
