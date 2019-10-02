/* Ported from @enact/moonstone/VirtualList/VirtualList.js */

/**
 * Provides Agate-themed virtual list components and behaviors.
 *
 * @module agate/VirtualList
 * @exports VirtualGridList
 * @exports VirtualGridListNative
 * @exports VirtualList
 * @exports VirtualListBase
 * @exports VirtualListBaseNative
 * @exports VirtualListNative
 */

import kind from '@enact/core/kind';
import {gridListItemSizeShape, itemSizesShape} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';

import {ScrollableVirtualList, VirtualListBase, } from './VirtualListBase';

/**
 * A Agate-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof agate/VirtualList
 * @extends agate/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends agate/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the VirtualList; valid value is a number generally.
		 * For different item size, value is an object that has `minSize`
		 * and `size` as properties.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number|ui/VirtualList.itemSizesShape}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.oneOfType([PropTypes.number, itemSizesShape]).isRequired
	},

	render: ({itemSize, ...rest}) => {
		const props = itemSize && itemSize.minSize ?
			{
				itemSize: itemSize.minSize,
				itemSizes: itemSize.size
			} :
			{
				itemSize
			};

		return (<ScrollableVirtualList {...rest} {...props} />);
	}
});

/**
 * A Agate-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof agate/VirtualList
 * @extends agate/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: /** @lends agate/VirtualList.VirtualGridList.prototype */ {
		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridList
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {ui/VirtualList.gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired
	},

	render: (props) => (
		<ScrollableVirtualList {...props} />
	)
});

export default VirtualList;
export {
	VirtualGridList,
	VirtualList,
	VirtualListBase,
};
