import React, { useEffect, useState } from 'react';
import { NodeLink } from '../../packages/editor/Elements/Elements';
import { signOut, useSession } from 'next-auth/react';
import Divider from '../atoms/Divider';
import TextButton from '../molecules/TextButton';
import { Router, useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../backend/driver/fetcher';
import { useViewData } from '../context/ViewContext';
import { formatNodeConnectionstoMap } from '../../helpers/frontend/formatNodeConnectionstoMap.ts';

export const SideBar: React.FC = () => {
	const { data: session, status } = useSession();

	const nodeData = useViewData();

	// const { data, error, isLoading } = useSWR(
	// 	status === 'authenticated' && session?.user?.favouritesId
	// 		? '/api/general/user/favourites/' + session.user.favouritesId
	// 		: null,
	// 	fetcher
	// );

	const { data, error, isLoading } = useSWR(
		status === 'authenticated' && session?.user?.favouritesId
			? '/api/username/' + session.user.favouritesId
			: null,
		fetcher
	);

	const router = useRouter();

	useEffect(() => {
		console.log('data');
		console.log(data);
	}, [data]);

	if (status === 'authenticated' && session?.user) {
		const connectionMap = formatNodeConnectionstoMap(data[0]);

		return (
			<div className='bg-secondary_white  w-52 -translate-x-48 hover:translate-x-0 rounded-r-md border-r-[0.5px] border-y-[0.5px] p-6 border-lining transition-all z-50 opacity-0 hover:opacity-100 absolute left-0 ease-in-out justify-self-center self-center top-1/2 -translate-y-1/2 h-[80vh]'>
				<div>
					<div>Your Home Node</div>
					<NodeLink element={{ routeString: 'peepee' }}>
						{
							<div>
								{connectionMap[session.user?.homenodeId].title}{' '}
							</div>
						}
					</NodeLink>
					<div>Favourites</div>
					<NodeLink element={{ routeString: 'peepee' }}>
						{<div>Node Title 1 </div>}
					</NodeLink>
					<NodeLink element={{ routeString: 'peepee' }}>
						{<div>Node Title 2 </div>}
					</NodeLink>
					<NodeLink element={{ routeString: 'peepee' }}>
						{<div>Node Title 3 </div>}
					</NodeLink>
					<NodeLink element={{ routeString: 'peepee' }}>
						{<div>Node Title 4 </div>}
					</NodeLink>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-secondary_white  w-60 -translate-x-48 hover:translate-x-0 rounded-r-md border-r-[0.5px] border-y-[0.5px] p-6 border-lining transition-all z-50 opacity-0 hover:opacity-100 absolute left-0 ease-in-out justify-self-center self-center top-1/2 -translate-y-1/2 h-[80vh]'>
			<div>
				<div className='font-bold'>You're not logged in.</div>
				<div>Login to unlock favourites</div>
				<Divider />
				<TextButton
					text={'Login'}
					onClick={() => router.push('/auth/signin')}
				></TextButton>
			</div>
		</div>
	);
};