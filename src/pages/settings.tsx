import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Box, Snackbar, Alert
} from '@mui/material';
import { useUser } from '@/context/UserContext'; // Asegúrate de importar el contexto correctamente
import BasicContainer from '@/components/BasicContainer';

const SettingsPage = () => {
  const { user, status } = useUser();
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string, username?: string }>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setUsername(user.username);
    }
  }, [user]);

  const validate = () => {
    const newErrors: { firstName?: string, username?: string } = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const updatedUser = {
      first_name: firstName,
      username: username,
      user_id: user?.user_id, // Asegúrate de que user tenga el user_id
    };

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(true);
    }
  };

  return (
    <BasicContainer titlePage='Settings'>
      <Typography variant="h4" gutterBottom mb={4}>Settings</Typography>
      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit">Save Changes</Button>
        </form>
      )}
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error">
          Error updating profile!
        </Alert>
      </Snackbar>
    </BasicContainer>
  );
};

export default SettingsPage;