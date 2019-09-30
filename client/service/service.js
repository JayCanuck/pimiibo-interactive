const BASE_URL = 'https://www.amiiboapi.com/api';

export function getSeries() {
	return window.fetch(`${BASE_URL}/amiiboseries`)
		.then(res => res.json())
		.then(res => res.amiibo);
}

export function getAmiibos(series) {
	if(series && series !== 'All Amiibos') {
		return window.fetch(`${BASE_URL}/amiibo/?amiiboSeries=${encodeURIComponent(series)}`)
			.then(res => res.json())
			.then(res => res.amiibo);
	} else {
		return window.fetch(`${BASE_URL}/amiibo/`)
			.then(res => res.json())
			.then(res => res.amiibo.sort((a, b) => {
				if (a.amiiboSeries < b.amiiboSeries){
					return -1;
				}
				if (a.amiiboSeries > b.amiiboSeries){
					return 1;
				}
				return 0;
			}));
	}
}
