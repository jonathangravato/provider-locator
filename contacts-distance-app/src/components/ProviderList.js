import React from 'react';
import { styled } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';

const ListWrapper = styled('div')({
  display: 'flex',
  paddingTop: '1rem',
  paddingBottom: '1.5rem',
  fontSize: '1.125rem;'
});

const getItemWidth = column => {
  switch( column ){
    case 'miles':
      return '10%'
    case 'provider':
      return '30%'
    case 'address':
      return '50%'
    case 'zip':
      return '10%'
    default:
      return 
  }
}

const ListItem = styled('div')(props => ({
  width: getItemWidth(props.column),
  display: 'flex',
  justifyContent: props.end === "true" ? 'center' : 'start'
}));

export default function SimpleList(props) {
  const { miles, providerGroup, address, city, zipcode } = props
  return (
    <>
      <ListWrapper>
        <ListItem column="miles">{`miles: ${miles}`}</ListItem>
        <ListItem column="provider">{providerGroup}</ListItem>
        <ListItem column="address">{`${address}, ${city}`}</ListItem>
        <ListItem column="zip" end="true">{zipcode}</ListItem>
      </ListWrapper>
      <Divider />
    </>
  )
}