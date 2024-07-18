import React, { useState } from 'react';
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Button, List, ListItemButton, ListItemText,
  Divider, Slide, TextField, Checkbox, FormControlLabel,
  ListItem
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddPostDialog = ({ open, handleClose, fullScreen, user_id }: { open: boolean, handleClose: () => void, fullScreen: boolean, user_id: number }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentsAllowed, setCommentsAllowed] = useState(true);
  const [errors, setErrors] = useState<{ title?: string, content?: string }>({});

  const clearAll = () => {
    setTitle('');
    setContent('');
    setCommentsAllowed(true);
    setErrors({});
  }

  const handleCloseDialog = () => {
    clearAll();
    handleClose();
  }

  const validate = () => {
    const newErrors: { title?: string, content?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const newPost = {
      title,
      content,
      user_id, // Esto debería venir de tu estado global o contexto de autenticación
      comments_allowed: commentsAllowed,
    };

    // Aquí puedes manejar la lógica para guardar el nuevo post, como hacer una llamada a tu API
    await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    }).then(() => {
      // Emit the 'postusercreated' event
      const event = new CustomEvent('postusercreated', { detail: newPost });
      window.dispatchEvent(event);
    });
    console.log(newPost);
    handleCloseDialog();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add new post
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <List>
          <ListItem>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <TextField
              label="Content"
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
            />
          </ListItem>
          <Divider />
          <ListItemButton>
            <FormControlLabel
              control={
                <Checkbox
                  checked={commentsAllowed}
                  onChange={(e) => setCommentsAllowed(e.target.checked)}
                />
              }
              label="Allow Comments"
            />
          </ListItemButton>
        </List>
      </form>
    </Dialog>
  );
};

export default AddPostDialog;