import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, TextField, CircularProgress } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import axios from 'axios';
import List from '@material-ui/core/List';
import ProviderList from './ProviderList';
import { MEDICAL_PROVIDERS } from '../medical-providers';

const primary = blue[500]; // #F44336
const FIELD_VALUES = { origin: '', limit: 10 }
const ERROR_VALUES = { originError: false, originText: '', limitError: false, limitText: '', noProviders: false }

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '30%',
    margin: 'auto',
    marginTop: 150,
    '& label.Mui-focused': {
      color: primary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: primary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: primary,
      },
    },
  },
  listWrapper: {
    display: 'flex',
    marginTop: 5
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  addressField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: 20,
    width: 450
  },
  limitField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: 50,
    width: 450
  },
  MuiInput: {
    underline: {
      after: primary
    }
  },
  button: {
    color: '#fff',
    backgroundColor: primary
  },
  progress: {
    margin: theme.spacing(2),
  },
}));

export default function ProviderSearch() {
  const classes = useStyles();
  const [providers, setProviders] = useState([])
  const [fields, setFields] = useState(FIELD_VALUES)
  const [errors, setErrors] = useState(ERROR_VALUES)
  const [isSearching, setSearchingFlag] = useState(false)

  // Function to fetch Github info of a user.
  const fetchGoogMapsInfo = async (url, provider) => {
    const googMapsInfo = await axios(url) // API call to get user info from Github.
    return {
      ...provider,
      miles: googMapsInfo.data.miles
    }
  }

  // Iterates all users and returns their Github info.
  const fetchProviderDistances = async () => {
    const requests = MEDICAL_PROVIDERS.map((provider) => {
      const url = `/api/map-data/${fields.origin}/${provider.address}`
      return fetchGoogMapsInfo(url, provider) // Async function that fetches the user info.
        .then((a) => {
          return a // Returns the user info.
        })
    })
    return Promise.all(requests) // Waiting for all the requests to get resolved.
  }

  const filterProvidersByDistance = () => {
    setErrors(ERROR_VALUES)
    setProviders([])
    if (fields.origin.length > 5 && fields.limit > 0) {
      setFields(FIELD_VALUES)
      setSearchingFlag(true)
      fetchProviderDistances()
        .then(prs => {
          if (prs.length > 0) {
            setProviders(prs)
            setSearchingFlag(false)
          }
        })
    } else if (fields.origin.length < 5) {
      setErrors(errors => ({ ...errors, originError: true, originText: 'Enter 5 or more characters' }))
    } else if (fields.limit === 0 || fields.limit === '') {
      setErrors(errors => ({ ...errors, limitError: true, limitText: 'Enter at least 1 mile distance' }))
    }
  }

  const renderProviders = () => {
    const filteredProviders = providers.filter(pr => pr.miles < fields.limit)
    if (filteredProviders.length > 0) {
      return (
        <List>
          {filteredProviders.map((provider, index) => <ProviderList key={provider.zipcode + `${index}`} {...provider} />)}
        </List>
      )
    } else if (filteredProviders.length === 0) {
      setErrors({ ...errors, noProviders: true })
    }
  }

  const changeHandler = ev => {
    const { name, value } = ev.target
    setFields({ ...fields, [name]: name === 'limit' && value.length > 0 ? Number(value) : value })
  }

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div>
                <h3>Providers Distance App</h3>
                <Grid item xs={12}>
                  <TextField
                    name="origin"
                    label="Address"
                    error={errors.originError}
                    helperText={errors.originText}
                    className={classes.addressField}
                    value={fields.origin}
                    onChange={changeHandler}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="limit"
                    label="Mile Limit"
                    error={errors.limitError}
                    helperText={errors.limitText}
                    className={classes.limitField}
                    value={fields.limit}
                    onChange={changeHandler}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button className={classes.button} onClick={() => filterProvidersByDistance()}>Search</Button>
                </Grid>
                {/* { JSON.stringify(providers.length) } */}
                {
                  isSearching ? <CircularProgress className={classes.progress} /> : null
                }
                {
                  errors.noProviders ? <p>No Results Found</p> : null
                }
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
      { providers.length > 0 && !errors.noProviders ?
        <div className={classes.listWrapper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div>
                  {
                    renderProviders()
                  }
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
        : null
      }
    </>
  );
}
