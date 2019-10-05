import kind from '@enact/core/kind';
import Image from '@enact/agate/Image';
import {Column, Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {VirtualList} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';

import logo from '../assets/logo.svg';

import MenuItem from './MenuItem';
import css from './Sidebar.module.less';

const Sidebar = kind({
	name: 'Sidebar',

	propTypes: {
		series: PropTypes.array,
		active: PropTypes.string
	},

	defaultProps: {
		series: []
	},

	styles: {
		css,
		className: 'sidebar'
	},

	computed: {
		renderMenu: ({series, active}) => (rest) => {
			const name = series[rest.index];
			return (
				<MenuItem key={'menu-' + rest.index} active={name===active} {...rest}>
					{series[rest.index]}
				</MenuItem>
			);
		},
	},

	render: ({series, renderMenu, ...props}) => {
		delete props.active;
		delete props.activateSeries;
		return (
			<Column {...props}>
				<Cell shrink>
					<Image src={logo} className={css.logo} sizing="fit" />
				</Cell>
				<Cell>
					<VirtualList
						dataSize={series.length}
						itemRenderer={renderMenu}
						itemSize={ri.scale(20)}
					/>
				</Cell>
			</Column>
		)
	}
});

export default Sidebar;
