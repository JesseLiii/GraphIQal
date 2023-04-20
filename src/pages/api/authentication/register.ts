import type { NextApiRequest, NextApiResponse } from 'next';
import { write } from '../../../backend/driver/helpers';
// import { write } from '../../../src/backend/driver/helpers';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const params = req.query;

	const cypher = `
	MATCH (n)
	DETACH DELETE n
	`;

	// Add Hash for password
	// const cypher = `
	// CREATE (u:User {
	//   userId: randomUuid(),
	//   email: $email,
	//   password: $encrypted,
	//   username: $name
	// })
	// RETURN u
	// `;

	const result: any = await write(cypher as string, params);

	res.status(200).json({ ...result });
}