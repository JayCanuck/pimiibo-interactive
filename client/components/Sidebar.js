import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import {VirtualList} from '@enact/moonstone/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';

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
			<div {...props}>
				<VirtualList
					dataSize={series.length}
					horizontalScrollbar="hidden"
					itemRenderer={renderMenu}
					itemSize={ri.scale(20)}

				/>
			</div>
		)
	}
});

export default Sidebar;
