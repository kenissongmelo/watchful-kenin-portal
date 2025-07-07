import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export const ProvidersConfig = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Provider Configuration
          </Typography>
          <Typography variant="body1" color="textSecondary">
            This feature is coming soon. You will be able to configure monitoring providers here.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
