import { Button, Container } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import React from 'react'
import { createPortal } from 'react-dom';
import RowContainer from './RowContainer';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import fetchData from '../functions/fetchData';
import Item from './Item';


const MainContent = (props) => {

	const { username } = props;
	
	const [rows, setRows] = useState([
		{
			id: 1,
			title: 'S'
		},
		{
			id: 2,
			title: 'A'
		},
		{
			id: 3,
			title: 'B'
		},
		{
			id: 4,
			title: 'C'
		},
		{
			id: 5,
			title: 'All Anime'
		}
	])
	
	const rowsId = useMemo(() => rows.map((r) => r.id),
		[rows]);

	const [activeRow, setActiveRow] = useState(null);

	const [activeItem, setActiveItem] = useState(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 100
			}
		})
	)

	useEffect(() => {
		async function getMediaList() {
			const mediaList = await fetchData(username, 1)
			setAnime(mediaList);
		}

		if(username) {
			getMediaList();
		}

	}, [username])

	const [anime, setAnime] = useState([]);

	return (
		<Container>
			<DndContext 
				sensors={sensors} 
				onDragStart={onDragStart} 
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>
				<SortableContext items={rowsId}>
					{rows.map((row) => (
						<RowContainer 
							key={row.id}
							row={row}
							updateRow={updateRow}
							updateMedia={updateMedia}
							mediaList={anime.filter(a => a.rowId === row.id)}
						>
						</RowContainer>
					))}
				</SortableContext>
				{createPortal(<DragOverlay>
					{activeRow && 
					<RowContainer 
						row={activeRow}
						updateMedia={updateMedia}
						mediaList={anime.filter(a => a.rowId === activeRow.id)}
					>
					</RowContainer>}
					{activeItem && 
					<Item
						media={activeItem}
					></Item>}
				</DragOverlay>, document.body)}
			</DndContext>
			<Button onClick={createNewRow}>
				Add Row
			</Button>
		</Container>
	)

	function createNewRow() {
		const rowToAdd = {
			id: generateId(),
			title: `Row ${rows.length + 1}`
		}
		setRows([...rows, rowToAdd])
	}

	function onDragStart(event) {
		if (event.active.data.current?.type === 'Row') {
			setActiveRow(event.active.data.current.row);
			return;
		}
		if (event.active.data.current?.type === 'Media') {
			setActiveItem(event.active.data.current.media);
			return;
		}

	}

	function onDragEnd(event) {
		setActiveRow(null);
		setActiveItem(null);
		const { active, over } = event;
		if (!over) return;
		const activeRowId = active.id;
		const overRowId = over.id;
		if (activeRowId === overRowId) return;
		setRows(rows => {
			const activeRowIndex = rows.findIndex(r => r.id === activeRowId)
			const overRowIndex = rows.findIndex(r => r.id === overRowId)

			return arrayMove(rows, activeRowIndex, overRowIndex)
		})
	}

	function onDragOver(event) {
		const { active, over } = event;
		if (!over) return;
		const activeRowId = active.id;
		const overRowId = over.id;
		if (activeRowId === overRowId) return;

		const isActiveAItem = active.data.current?.type === 'Media';
		const isOverAItem = over.data.current?.type === 'Media';
		if(isActiveAItem && isOverAItem) {
			setAnime(a => {
				const activeItemIndex = a.findIndex(r => r.id === activeRowId)
				const overItemIndex = a.findIndex(r => r.id === overRowId)

				a[activeItemIndex].rowId = a[overItemIndex].rowId
				return arrayMove(a, activeItemIndex, overItemIndex)
			})
		}

		const isOverARow = over.data.current?.type === 'Row'

		if(isActiveAItem && isOverARow) {
			console.log(over.data.current)
			setAnime(a => {
				const activeItemIndex = a.findIndex(r => r.id === activeRowId)

				a[activeItemIndex].rowId = overRowId
				return arrayMove(a, activeItemIndex, activeItemIndex)
			})
		}
	}

	function updateRow(id, title) {
		const newRows = rows.map(r => {
			if (r.id !== id) return r;
			return {...r, title};
		});
		setRows(newRows);
	}

	function updateMedia(id, content) {
		const newMedia = rows.map((m) => {
			if(m.id !== id) return m;
			return {...m, content}
		})
		setAnime(newMedia);
	}
}

function generateId() {
	return Math.floor(Math.random() * 1000000001)
}

export default MainContent