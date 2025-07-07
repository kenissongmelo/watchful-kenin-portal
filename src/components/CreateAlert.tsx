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

export const CreateAlert = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Create New Alert
          </Typography>
          <Typography variant="body1" color="textSecondary">
            This feature is coming soon. You will be able to create new monitoring alerts here.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
