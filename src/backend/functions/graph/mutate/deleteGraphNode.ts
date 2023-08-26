import useSWR from 'swr';
import { fetcher } from '../../../driver/fetcher';
import { jsonToCypher_graphView } from '../../../driver/dataConversion';
import { GraphNodeData, NodeData } from '../../../../packages/graph/graphTypes';
import { Action } from '../../../../packages/graph/hooks/useHistoryState';

type deleteGraphNodeInput = {
	nodeId: string;
	graphViewId: string;
};

export const deleteGraphNode = async ({
	nodeId,
	graphViewId,
}: deleteGraphNodeInput) => {
	const body = `
        MATCH (n: Node {id: "${nodeId}"})-[r]-(g: GRAPH_VIEW {id: "${graphViewId}"})
        DELETE r
	`;

	const res = await fetch(`/api/general/nodes/mutate/graphView`, {
		method: 'POST',
		body: body,
	})
		.then((res) => {
			console.log('res ', res);
			return res.json();
		})
		.then((json) => {
			console.log('json: ', json);
			return json;
		});

	return res;
};
