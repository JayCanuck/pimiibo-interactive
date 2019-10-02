import AgateDecorator from '@enact/agate/AgateDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import {Panels} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import compose from 'ramda/src/compose';
import React from 'react';

import MainPanel from '../views/MainPanel';

import css from './App.module.less';
import initialState from './initialState';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({series, ...props}) => (
		<div {...props}>
			<Panels noCloseButton>
				<MainPanel series={series}/>
			</Panels>
		</div>
	)
});

const AppDecorator = compose(
	AgateDecorator({overlay: true}),
	ProviderDecorator({
		state: initialState()
	})
);

export default AppDecorator(App);
