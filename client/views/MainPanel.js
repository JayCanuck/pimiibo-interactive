import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import {getSeries, getAmiibos} from '../service';

const MainPanelBase = kind({
	name: 'MainPanel',

	render: ({active, series, amiibos, ...props}) => {
		return (
			<Panel {...props}>
				<Button>Click Me</Button>
			</Panel>
		)
	}
});

const MainPanelDecorator = ConsumerDecorator({
	mount: (props, {update}) => {
		const handler = () => {
			const hash = decodeURIComponent(window.location.hash.replace(/^#/, '')) || 'All Amiibos';
			update(state => {
				state.hash = hash;
				console.log('HASH', hash);
				state.amiibos[hash] = [];
			});
			getAmiibos(hash)
				.then(res => {
					update(state => {
						state.amiibos[hash] = res;
						console.log('state.amiibos[' + hash + ']', res);
					});
				})
				.catch(err => console.error(err));
		};
		window.addEventListener('hashchange', handler, false);
		handler();
		getSeries()
			.then(res => {
				const seriesList = ['All Amiibos'].concat(res.map(o => o.name).sort());
				update(state => {
					state.series = seriesList;
					console.log('state.series', seriesList);
				});
			})
			.catch(err => console.error(err));
		return () => {
			window.removeEventListener('hashchange', handler, false);
		}
	},
	mapStateToProps: ({series, amiibos, hash}) => ({
		active: hash,
		series,
		amiibos: amiibos[hash]
	})
})

const MainPanel = MainPanelDecorator(MainPanelBase)

export default MainPanel;
