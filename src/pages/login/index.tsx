import {
  Typography,
  TextField,
  Box,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import graphQlFetch from '@/utils/graphQlFetch';
import { useRouter } from 'next/router';
import { LoginResponse } from '@/types/login';
import { setAuth } from '@/utils/auth';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const methods = useForm<FormValues>({
    // yupResolver works incorrect below node v19 with typings
    resolver: yupResolver(schema) as any,
  });

  const handleSubmit = async (values: FormValues) => {
    graphQlFetch<LoginResponse>(`mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
       token
      }
    }`,
      values
    ).then((response) => {
      setAuth(response.data.login.token);
      router.push('/users');
    }).catch((e) => {
      // TODO: Implement server errors handling and displaying on screen
      alert(e.message);
    });
  };

  // TODO: Add loading state once request has been submitted
  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={methods.handleSubmit(handleSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!methods.formState.errors.email}
                helperText={methods.formState.errors.email?.message}
                {...methods.register('email')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!methods.formState.errors.password}
                helperText={methods.formState.errors.password?.message}
                {...methods.register('password')}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
