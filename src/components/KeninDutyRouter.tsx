import React from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dashboard } from './Dashboard';
import { Sidebar } from './Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
  },
}));

export const KeninDutyRouter = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Sidebar />
        <main className={classes.main}>
          <Container className={classes.container}>
            <div className={classes.header}>
              <Typography variant="h3" component="h1" className={classes.title}>
                KeninDuty
              </Typography>
              <Typography variant="body1" className={classes.subtitle}>
                Intelligent Alert Management Platform
              </Typography>
            </div>
            <Dashboard />
          </Container>
        </main>
      </div>
    </div>
  );
};
