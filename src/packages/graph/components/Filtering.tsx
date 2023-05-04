/**
 * Pill menu for filtering the nodes that are "in view"
 */

import React, { useContext } from 'react';
import { PillMenu } from '../../../components/molecules/PillMenu';
import { ItemProps } from '../../../components/organisms/Dropdown';
import { getNodeTags } from '../../../helpers/backend/getHelpers';
import GraphViewContext, {
	GraphViewContextInterface,
} from '../context/GraphViewContext';
import { Tag } from '../../../components/molecules/Tag';
import TextButton from '../../../components/molecules/TextButton';
import { createNode } from '@udecode/plate';
import { saveGraphView } from '../../../backend/functions/graph/saveGraphView';

type FilteringProps = {
	xCategory: string;
	yCategory: string;
	getDropdownItemsX: () => ItemProps[];
	getDropdownItemsY: () => ItemProps[];
	getDropdownItems: () => ItemProps[];
};
export const Filtering: React.FC<FilteringProps> = ({
	xCategory,
	yCategory,
	getDropdownItems,
	getDropdownItemsX,
	getDropdownItemsY,
}) => {
	const {
		nodeInView,
		nodesVisual,
		nodesDisplayed,
		userId,
		graphViewId,
		nodeId,
	} = useContext(GraphViewContext) as GraphViewContextInterface;

	const tags = getNodeTags(nodeInView, nodesDisplayed);

	return (
		<div className=' relative ml-3 mt-3 flex flex-row gap-x-3 mb-3 w-full'>
			<TextButton
				text='Save Graph'
				onClick={() => {
					console.log('hmm');
					saveGraphView({
						userId,
						graphViewId,
						nodeId,
						graphViewData: nodesVisual,
						nodeData: nodesDisplayed,
					});
				}}
			></TextButton>
			<TextButton
				text='Create Node'
				onClick={() => {
					console.log('hmm');
				}}
			></TextButton>
			<PillMenu
				label='In View: '
				value={nodeInView}
				dropdownItems={getDropdownItems()}
			/>
			<PillMenu
				label='X-Axis: '
				value={xCategory}
				dropdownItems={getDropdownItemsX()}
			/>
			<PillMenu
				label='Y-Axis: '
				value={yCategory}
				dropdownItems={getDropdownItemsY()}
			/>
			<div className='flex flex-row justify-items-stretch gap-x-2'>
				{Object.keys(tags).map((tag: string, i: number) => {
					return <Tag tag={tag} id={i} />;
				})}
			</div>
		</div>
	);
};
