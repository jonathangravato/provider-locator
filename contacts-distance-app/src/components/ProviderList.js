import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';;

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

export default function SimpleList(props) {
  // const classes = useStyles();
  const { zipcode, providerGroup, address, city, index } = props
  console.log('index', index)
  return (
    <>
    <Divider />
    <ListItem key={zipcode + `${index}`}>
      <ListItemText primary={providerGroup} />
      <ListItemText>{address}</ListItemText>
      <ListItemText>{city}</ListItemText>
      <ListItemText>{zipcode}</ListItemText>
    </ListItem>
    </>
  )
}