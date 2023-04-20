import Link from 'next/link';
import { useState } from 'react';
// import TextButton from '../src/components/molecules/TextButton';
// import { login, register } from '../src/backend/functions/authentication';
import { login, register } from '../backend/functions/authentication';
import TextButton from '../components/molecules/TextButton';

export default function Home() {
	const [email, setemail] = useState('icejes8@gmail.com');
	const [username, setusername] = useState('jesseliii');
	const [password, setpassword] = useState('password');

	return (
		<ul>
			<li>
				<Link href='/'>Home</Link>
			</li>
			<li>
				<Link href='/username/SplitPaneWrapper'>Document</Link>
			</li>
			<li>
				<Link href='/username/graph'>Blog Post</Link>
			</li>
			<div className='flex flex-col bg-blue-400 '>
				<input
					placeholder='email'
					value={email}
					onChange={(e) => setemail(e.target.value)}
				/>
				<input
					placeholder='username'
					value={username}
					onChange={(e) => setusername(e.target.value)}
				/>
				<input
					placeholder='password'
					value={password}
					onChange={(e) => setpassword(e.target.value)}
				/>
				<TextButton
					text={'Login'}
					onClick={() => login(email, username, password)}
				/>
				<TextButton
					text={'Create Account'}
					onClick={() => register(email, username, password)}
				/>
				<div>care</div>
				<TextButton
					text={'Delete ALL NODES'}
					// onClick={() => ()}
				/>
			</div>
		</ul>
	);
}