import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { styled } from '@material-ui/styles';
import { Paper, Grid, Button, TextField, CircularProgress } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { MEDICAL_PROVIDERS } from '../medical-providers';
import axios from 'axios';

const primary = blue[500]; // #F44336
const FIELD_VALUES = { origin: '', limit: 10 }
// const TEST_ADDRESS = '505 White St, Daytona Beach, FL 32114'

// const StyledTextField = styled(TextField)({
//   marginLeft: 8,
//   marginRight: 8,
//   marginBottom: 50,
//   width: 450,
//   'div:after': {
//     borderBottom: 'red'
//   }
// });

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '30%',
    margin: 'auto',
    marginTop: 200,
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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
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
  const [clickedSearch, setSearchFlag] = useState(false)
  const [isSearching, setSearchingFlag] = useState(false)

  useEffect(() => {
    // Function to fetch Github info of a user.
    const fetchGoogMapsInfo = async (url, provider) => {
      const googMapsInfo = await axios(url) // API call to get user info from Github.
      return {
        ...provider,
        miles: googMapsInfo.data.miles
      }
    }

    // Iterates all users and returns their Github info.
    const fetchProviderDistances = async (providers) => {
      const origin = 'Orlando, Fl'
      const requests = providers.map((provider) => {
        const url = `/api/map-data/${origin}/${provider.address}`
        return fetchGoogMapsInfo(url, provider) // Async function that fetches the user info.
          .then((a) => {
            return a // Returns the user info.
          })
      })
      return Promise.all(requests) // Waiting for all the requests to get resolved.
    }

    fetchProviderDistances(MEDICAL_PROVIDERS)
      .then(a => {
        if(a.length > 0){
          setProviders(a)
        }
      })
  }, [])

  const callGoogleApi = async (destination, limit) => {
    let isLessThanDistanceLimit = false;
    await axios.get(`/api/map-data/${fields.origin}/${destination}`)
      .then(response => {
        isLessThanDistanceLimit = response.data.miles < limit;
      })
      .catch(err => {
        console.log(err)                     //Axios entire error message
        // console.log(err.response.data.error) //Google API error message 
      })
    return isLessThanDistanceLimit;
  }

  const filterProvidersByDistance = () => {
    setFields(FIELD_VALUES)
    setSearchingFlag(true)
    MEDICAL_PROVIDERS.forEach(async (provider, index) => {
      const meetsLImit = await callGoogleApi(provider.address, 10)
      if (meetsLImit) {
        setProviders(state => [...state, provider])
      }
      if ((index + 1) === MEDICAL_PROVIDERS.length) {
        setSearchFlag(true)
        setSearchingFlag(false)
      }
    })
  }

  const renderProviders = providers => providers.map((provider, index) => (
    <div key={provider.zipcode + `${index}`}>
      <h5>{provider.providerGroup}</h5>
      <p>{provider.address}</p>
      <p>{provider.city}</p>
    </div>
  ))

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div>
              <h3>Providers Distance App</h3>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  className={classes.textField}
                  value={fields.origin}
                  onChange={event => setFields({ origin: event.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button className={classes.button} onClick={() => filterProvidersByDistance()}>Search</Button>
              </Grid>
              {/* { JSON.stringify(providers.length) } */}
              {
                clickedSearch ? providers.length > 0 ? renderProviders(providers) : <p>No Results Found</p> : null
              }
              {
                isSearching ? <CircularProgress className={classes.progress} /> : null
              }
              {
                providers.length > 0 ? renderProviders(providers.filter( pr => pr.miles < 10 )) : null
              }
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
