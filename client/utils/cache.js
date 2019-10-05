const EXPIRY_THRESHOLD = 1*24*60*60*1000; // 1 day in miliseconds

const loadCachedValue = key => {
	const result = window.localStorage.getItem(key);
	if (result) {
		try {
			const obj = JSON.parse(result);
			const timestamp = new Date().getTime();
			if (obj.timestamp && obj.value && (timestamp - obj.timestamp) < EXPIRY_THRESHOLD) {
				return obj.value;
			} else {
				window.localStorage.removeItem(key);
			}
		} catch (e) {
			window.localStorage.removeItem(key);
		}
	}
};
const storeCachedValue = (key, value) => {
	const timestamp = new Date().getTime();
	const obj = {timestamp, value};
	window.localStorage.setItem(key, JSON.stringify(obj));
};

export const getAmiiboCache = type => loadCachedValue(`amiibo-${type}`);
export const getSeriesCache = () => loadCachedValue('amiibo-series');
export const saveAmiiboCache = (type, amiibos) => storeCachedValue(`amiibo-${type}`, amiibos);
export const saveSeriesCache = (series) => storeCachedValue('amiibo-series', series);
