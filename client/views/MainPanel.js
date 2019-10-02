import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import ri from '@enact/ui/resolution';
import {Cell, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AmiiboItem from '../components/AmiiboItem';
import Sidebar from '../components/Sidebar';
import {VirtualGridList} from '../components/VirtualList';
import {getSeries, getAmiibos} from '../service';

// import css from './MainPanel.module.less';

const MainPanelBase = kind({
	name: 'MainPanel',

	propTypes: {
		series: PropTypes.array,
		active: PropTypes.string,
		amiibos: PropTypes.array
	},

	defaultProps: {
		series: [],
		amiibos: []
	},

	computed: {
		renderAmiibos: ({amiibos}) => (rest) => {
			const {name, image: imgSrc, head, tail} = amiibos[rest.index];
			return (
				<AmiiboItem key={'amiibo-' + rest.index} imgSrc={imgSrc} head={head} tail={tail} {...rest}>
					{name}
				</AmiiboItem>
			);
		}
	},

	render: ({active, series, amiibos, renderAmiibos, ...props}) => {
		return (
			<Panel {...props}>
				<Row style={{height:'100%'}}>
					<Cell shrink>
						<Sidebar active={active} series={series} />
					</Cell>
					<Cell>
						<div style={{height:'100%'}}>
							<VirtualGridList
								dataSize={amiibos.length}
								itemRenderer={renderAmiibos}
								itemSize={{
									minWidth: ri.scale(210),
									minHeight: ri.scale(210)
								}}
							/>
						</div>
					</Cell>
				</Row>
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
