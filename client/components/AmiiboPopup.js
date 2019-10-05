import Button from '@enact/agate/Button';
import Heading from '@enact/agate/Heading';
import Image from '@enact/agate/Image';
import Popup from '@enact/agate/Popup';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './AmiiboPopup.module.less';

const AmiiboPopup = kind({
	name: 'AmiiboPopup',

	styles: {
		css,
		className: 'popup'
	},

	propTypes: {
		info: PropTypes.any
	},

	render: ({info = {}, ...rest}) => {
		return (
			<Popup closeButton {...rest} style={{textAlign: 'center', width:'10rem'}}>
				<Heading>
					{info.name}
				</Heading>
				<div>
					<Image className={css.image} src={info.image} sizing="fit"/>
				</div>
				<div>
					<Button>Write NFC</Button>
				</div>
			</Popup>
		)
	}
});

export default AmiiboPopup;
