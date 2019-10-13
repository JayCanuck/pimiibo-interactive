import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import ri from '@enact/ui/resolution';
import {Cell, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AmiiboItem from '../components/AmiiboItem';
import AmiiboPopup from '../components/AmiiboPopup';
import Sidebar from '../components/Sidebar';
import {VirtualGridList} from '../components/VirtualList';
import {getSeries, getAmiibos} from '../service';

import css from './MainPanel.module.less';

const MainPanelBase = kind({
	name: 'MainPanel',

	propTypes: {
		series: PropTypes.array,
		active: PropTypes.string,
		amiibos: PropTypes.array,
		onClosePopup: PropTypes.func,
		onOpenAmiibo: PropTypes.func,
		popup: PropTypes.any
	},

	defaultProps: {
		series: [],
		amiibos: []
	},

	computed: {
		renderAmiibos: ({amiibos, onOpenAmiibo}) => (rest) => (
			<AmiiboItem
				key={'amiibo-' + rest.index}
				info={amiibos[rest.index]}
				onClick={onOpenAmiibo}
				{...rest}
			/>
		)
	},

	styles: {
		css,
		className: 'panel'
	},


	render: ({active, series, amiibos, renderAmiibos, popup, onClosePopup, ...props}) => {
		delete props.onOpenAmiibo;
		return (
			<Panel {...props}>
				<Row className={css.fill}>
					<Cell shrink>
						<Sidebar active={active} series={series} />
					</Cell>
					<Cell>
						<div className={css.fill}>
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
				<AmiiboPopup open={Boolean(popup)} info={popup} onClose={onClosePopup} />
			</Panel>
		)
	}
});

const MainPanelDecorator = ConsumerDecorator({
	handlers: {
		onOpenAmiibo: (ev, props, {update}) => {
			update(state => {
				state.popup = ev.value;
			});
		},
		onClosePopup: (ev, props, {update}) => {
			update(state => {
				state.popup = undefined;
			});
		},
	},
	mount: (props, {update}) => {
		const handler = () => {
			const hash = decodeURIComponent(window.location.hash.replace(/^#/, '')) || 'All Amiibos';
			update(state => {
				state.hash = hash;
				state.amiibos[hash] = [];
			});
			getAmiibos(hash)
				.then(res => {
					update(state => {
						state.amiibos[hash] = res;
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
				});
			})
			.catch(err => console.error(err));
		return () => {
			window.removeEventListener('hashchange', handler, false);
		}
	},
	mapStateToProps: ({series, amiibos, hash, popup}) => ({
		active: hash,
		series,
		amiibos: amiibos[hash],
		popup
	})
})

const MainPanel = MainPanelDecorator(MainPanelBase)

export default MainPanel;
