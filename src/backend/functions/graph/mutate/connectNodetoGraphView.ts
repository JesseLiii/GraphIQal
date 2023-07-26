export const connectNode_GV = async (username: string, nodeId: string) => {
	console.log('connectNode_GV');

	const res = await fetch(`/api/${username}/${nodeId}/graph/create`, {
		method: 'POST',
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
