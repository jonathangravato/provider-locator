import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';;

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    paddingBottom: '1.5rem',
    fontSize: '1.125rem;'
  }
}));

export default function SimpleList(props) {
  const classes = useStyles();
  const { miles, providerGroup, address, city, zipcode } = props
  return (
    <>
      <div className={classes.wrapper}>
        <span>{`miles: ${miles}`}</span>
        <span>{providerGroup}</span>
        <span>{address}</span>
        <span>{city}</span>
        <span>{zipcode}</span>
      </div>
    <Divider />
    </>
  )
}