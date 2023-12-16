import React, { useMemo } from 'react'
import { useState } from 'react';
import { Box, TextField, Grid } from '@mui/material';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Item from './Item';

export const RowContainer = (props) => {

  const { row, updateRow, mediaList, updateMedia} = props;

  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: row.id,
    data: {
      type: "Row",
      row,
    },
    disabled: editMode
  })

  const mediaIds = useMemo(() => {
    return mediaList.map(m => m.id)
  }, [mediaList]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return <Box
      ref={setNodeRef}
      style={style}
      sx={{ width: '100%', pt: 1, pb: 1, opacity: 60, border: 2, height: 140}}>
    </Box>
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ width: '100%', pt: 1, pb: 1, height: '100%', display: 'flex'}}>
      <Box 
        sx={{display: 'flex', alignItems: "center", justifyContent: "center", border: 2, cursor: 'grab', minWidth: 100, borderRadius: '16px'}}
        {...attributes} {...listeners}
        onClick={() => setEditMode(true)}
      >{!editMode && row.title}
        {editMode && 
        <TextField 
          value={row.title}
          onChange={e => updateRow(row.id, e.target.value)}
          autoFocus 
          onBlur={() => { setEditMode(false) }} 
          onKeyDown={e => { 
            if (e.key !== "Enter") return; 
            setEditMode(false)
          }}>
        </TextField>}
      </Box>
      <Box sx={{display: 'flex', flexWrap: 'wrap', flexGrow: 1}}>
        <SortableContext items={mediaIds}>
        {mediaList && mediaList.map((anime) => (
          <Grid container spacing={0.5} xs={2}>
          <Item 
            key={anime.id} 
            media={anime}
            updateMedia={updateMedia}
          >
          </Item>
          </Grid>
        ))}
        </SortableContext>
      </Box>
      <div>
        Footer
      </div>
    </Box>
  )
}

export default RowContainer;