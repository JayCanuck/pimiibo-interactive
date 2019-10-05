import Image from '@enact/agate/Image';
import {adaptEvent, forward} from '@enact/core/handle';
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
		info: PropTypes.any,
		onOpenAmiibo: PropTypes.func
	},

	handlers: {
		onClick: adaptEvent(
			(ev, {info}) => Object.assign(ev, {value: info}),
			forward('onClick')
		)
	},

	render: ({info, ...rest}) => {
		return (
			<Column {...rest}>
				<Cell shrink>
					<Image className={css.image} src={info.image} sizing="fit"/>
				</Cell>
				<Cell className={css.label} shrink>
					{info.name}
				</Cell>
			</Column>
		)
	}
});

const AmiiboItem = Spottable(AmiiboItemBase);

export default AmiiboItem;
