import React from 'react'
import { Box, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Item = (props) => {

	const { media, updateMedia } = props;

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: media.id,
		data: {
			type: "Media",
			media,
		}
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform)
	}

	if (isDragging) {
		return (
			<Box
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				sx={{ display: 'flex', alignItems: "center", justifyContent: "center", opacity: 60, border: 2, cursor: 'grab', width: 100, borderRadius: '16px' }}>
			</Box>
		)
	}

	return (
		<Box
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onChange={e => updateMedia(media.id, e.target.value)}
			autoFocus
			sx={{ display: 'flex', alignItems: "center", justifyContent: "center", border: 2, cursor: 'grab', width: 100, borderRadius: '16px' }}
		>
			<Box>
				<Tooltip title={media.media.title.romaji}>
					<img
						style={{ maxWidth: '100%', alignItems: "center", justifyContent: "center", borderRadius: '16px' }}
						srcSet={media.media.coverImage.large}
						src={media.media.coverImage.large}
						alt={media.media.title.romaji}
					>
					</img>
				</Tooltip>
			</Box>
		</Box>
	)
}

export default Item