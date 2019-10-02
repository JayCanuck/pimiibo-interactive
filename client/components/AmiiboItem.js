import Image from '@enact/agate/Image';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {Cell, Column} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import css from './AmiiboItem.module.less';

const AmiiboItemBase = kind({
	name: 'AmiiboItem',

	styles: {
		css,
		className: 'amiibo'
	},

	propTypes: {
		imgSrc: PropTypes.string,
		head: PropTypes.string,
		tail: PropTypes.string
	},

	render: ({children, imgSrc, ...rest}) => {
		delete rest.head;
		delete rest.tail;
		return (
			<Column {...rest}>
				<Cell shrink>
					<Image className={css.image} src={imgSrc} sizing="fit" />
				</Cell>
				<Cell className={css.label} shrink>
					{children}
				</Cell>
			</Column>
		)
	}
});

const AmiiboItem = Spottable(AmiiboItemBase);

export default AmiiboItem;
