import React, { useState } from 'react'
import { Box, TextField, ToggleButtonGroup, ToggleButton, Container } from '@mui/material';
import { DesktopWindowsOutlined, MenuBookOutlined } from '@mui/icons-material';

export const Header = (props) => {

	const { updateUsername } = props;

	const [userId, setUserId] = useState('');

	const [alignment, setAlignment] = React.useState('anime');

	const handleAlignment = (event, newAlignment) => {
		if (newAlignment !== null) {
			setAlignment(newAlignment);
		}
	};

	return (
		<Container>
			<Box display="flex" alignItems="center" justifyContent={"center"}>
				<Box sx={{ p: 2 }}>
					<TextField
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '20px'
							}
						}}
						label="Type a username"
						variant="outlined"
						onChange={e => setUserId(e.target.value)}
						onKeyDown={e => {
							if (e.key !== "Enter") return;
							updateUsername(e.target.value);
						}}
					/>
				</Box>
				<Box sx={{ p: 2 }}>
					<ToggleButtonGroup
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
					>
						<ToggleButton value="anime" aria-label="left aligned">
							<DesktopWindowsOutlined />
						</ToggleButton>
						<ToggleButton value="manga" aria-label="right aligned">
							<MenuBookOutlined />
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			</Box>
		</Container>
	)
}
