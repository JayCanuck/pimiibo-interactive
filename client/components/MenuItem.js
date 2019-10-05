import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React from 'react';

import css from './MenuItem.module.less';

const SpottableDiv = Spottable('div');

const AmiiboItem = kind({
	name: 'AmiiboItem',

	propTypes: {
		active: PropTypes.bool
	},

	defaultProps: {
		active: false
	},

	styles: {
		css,
		className: 'menuitem'
	},

	computed: {
		className: ({active, styler}) => styler.append({active})
	},

	handlers: {
		onClick: handle(
			forward('onClick'),
			(ev, {children}) => {
				window.location.hash = `#${encodeURIComponent(children)}`;
			}
		)
	},

	render: ({children, ...props}) => {
		delete props.active;
		return (
			<SpottableDiv {...props}>
				{children}
			</SpottableDiv>
		)
	}
});

export default AmiiboItem;
