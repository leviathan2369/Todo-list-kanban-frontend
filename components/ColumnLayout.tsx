import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useDispatch } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { StoreDispatch } from '../redux/store/index';
import { IColumnLayoutProps } from '../types';


const ColumnLayout: React.FC<IColumnLayoutProps> = ({
  labelText,
  addHandler,
  removeHandler,
  completedHandler,
  selectorState,
  droppableId,
  updateTextShowed,
}) => {
  const [isError, setIsError] = useState({
    isShow: false,
    text: '',
  });
    const [titleText,setTitle]=useState('');
  const [textDescription, setTextDescription] = useState('');
  const dispatch = useDispatch<StoreDispatch>();

  const handleOnChangetitle = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {  
      setTitle(value);
      setIsError({
          isShow: value.length > 5,
          text:
          value.length >  5
            ? 'Error the input cannot be more than >5'
            : '',
        });
        
  };
    
  const handleOnChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTextDescription(value);

    setIsError({
      isShow: value.length > 200,
      text:
        value.length > 200
          ? 'Error the input cannot be more than >200'
          : '',
    });
  };

  const handleOnBlur = () => {
    setIsError({ ...isError, isShow: false });
  };

  const handleOnClick = () => {
    if (!isError.isShow) {
      dispatch(addHandler(textDescription));
      setTextDescription('');
    }
  };
  
  const handleInputKeyDown = ({
    target,
    key,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      if (
        (target as HTMLInputElement).value.length > 0 &&
        (target as HTMLInputElement).value.length <= 200
      ) {
        handleOnClick();
      } else {
        setIsError({
          isShow: true,
          text: 'The input value cannot be empty',
        });
      }
    }
  };

  return (
      <Box borderRadius={1} width='100%' sx={{ boxShadow: 2, p: 3 }}>
          <Box>
              <TextField value={titleText} onChange={handleOnChangetitle} />
            </Box>
      <TextField
        fullWidth
        label={labelText}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onKeyDown={handleInputKeyDown}
        value={textDescription}
        variant='outlined'
        size='small'
      />

      <Collapse in={isError.isShow}>
        <Alert severity='error' sx={{ my: 1 }}>
          {isError.text}
        </Alert>
      </Collapse>

      <Box width='100%' display='flex' justifyContent='center'>
        <Button
          size='medium'
          sx={{ my: 1, maxWidth: 200 }}
          variant='outlined'
          color='primary'
          fullWidth
          onClick={handleOnClick}
          onKeyDown={({ key }) => key === 'Enter' && handleOnClick()}
          disabled={
            textDescription.length > 200 || textDescription.length === 0
          }
        >
          Add Item
        </Button>
      </Box>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <List
            sx={{
              minHeight: '300px',
              li: {
                flexDirection: 'column',
              },
              '& .MuiListItemText-root': {
                width: '100%',
              },
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {selectorState.map(
              (
                { id, text, isFinished, createdAt, updatedAt, isTextShowed },
                index: number
              ) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <ListItem
                      sx={{
                        transition: '.3s ease background-color',
                        color: snapshot.isDragging ? '#fff' : '#000',
                        bgcolor: snapshot.isDragging ? '#000' : '#fff',
                        position: 'relative',
                        border: '1px solid #989898',
                        my: 1,
                        borderRadius: '3px',
                        '& .MuiTypography-root': {
                          display: 'flex',
                          alignItems: 'center',
                        },
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListItemText
                        sx={{
                          textDecoration: isFinished ? 'line-through' : 'none',
                          wordBreak: 'break-word',
                        }}
                      >
                        <IconButton
                          sx={{ p: 1, mr: 1 }}
                          onClick={() =>
                            dispatch(
                              updateTextShowed({
                                id,
                                isTextShowed: !isTextShowed,
                              })
                            )
                          }
                        >
                          
                        </IconButton>

                        <Box
                          component='span'
                          width='100%'
                          position='absolute'
                          top='0'
                          fontSize='.7rem'
                        >
                          {updatedAt ? 'Updated' : 'Created'} at:{' '}
                          {updatedAt || createdAt}
                        </Box>

                        <Box component='span' width='100%'>
                          {text}
                        </Box>

                        <Box display='flex' component='span'>
                          <IconButton
                            onClick={() => dispatch(removeHandler(id))}
                          >
                            <DeleteIcon
                              sx={{
                                color: snapshot.isDragging ? '#fff' : '#000',
                              }}
                            />
                          </IconButton>
                          <Checkbox
                            edge='end'
                            value={isFinished}
                            checked={isFinished}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={() =>
                              dispatch(
                                completedHandler({
                                  isFinished: !isFinished,
                                  id,
                                  updatedAt: new Date().toLocaleString(),
                                })
                              )
                            }
                          />
                        </Box>
                      </ListItemText>
                    </ListItem>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Box>
  );
};

export default ColumnLayout;