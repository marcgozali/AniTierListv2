import './App.css';
import { Header } from './components/Header';
import MainContent from './components/MainContent';
import React, { useState } from 'react';

function App() {
	const [username, setUsername] = useState(null);

	function updateUsername(user) {
		if(updateUsername) {
			setUsername(user);
		}
		return;
	}

	return (
		<div className="App">
			<header className="App-header">
				<Header updateUsername={updateUsername}></Header>
				<MainContent username={username}></MainContent>
			</header>
		</div>
	);
}

export default App;
