import {
	DirectionalConnectionTypes,
	getConnectionDirection,
	NodeDataType,
	convertToConnectionType,
	isTransitive,
} from '@/backend/schema';

export const createFilteredNode = async (
	nodeId: string,
	filters: {
		[key: string]: NodeDataType[];
	}
) => {
	let relationships = '';
	for (const key in filters) {
		if (filters[key].length > 0) {
			const connectionType = convertToConnectionType(
				key as DirectionalConnectionTypes
			);
			const direction = getConnectionDirection(
				key as DirectionalConnectionTypes
			);
			const leftArrow = direction === 'to' ? '<-' : '-';
			const rightArrow = direction === 'from' ? '->' : '-';

			filters[key].forEach((nodeData, index) => {
				relationships += `MERGE (m${index}:Node {id: "${nodeData.id}"})
				MERGE (n)${leftArrow}[:${connectionType}]${rightArrow}(m${index})\n`;
			});
		}
	}

	const body = `
    MERGE (n: Node {id: "${nodeId}"})
    SET n.icon = 'node', n.title = "Untitled"
    ${relationships}
    RETURN n
    `;

	const res = await fetch(`/api/general/nodes/mutate/createFilteredNode`, {
		method: 'POST',
		body: body,
	})
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			console.log(json);
			return json;
		});

	return res;
};