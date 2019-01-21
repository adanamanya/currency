import React, { Component } from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import * as currencies from'./currencies.json';
import axios from 'axios';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Loader from 'react-loader-spinner';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import firebase from './firebase';
const db = firebase.firestore()
class App extends Component {
  state = {
    name: 'hehe',
    open: false,
    disabled:false,
    values:'1',
    currency: 'IDR - Indonesian Rupiah',
    result: 'result',
    fbasedata:[],
    convdata:[]
  };

  componentDidMount(){
    this.getfbaseData()
  }

  getfbaseData(){
    const dataref = db.collection("currencies");
    let fbasedataz = []
    dataref.get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        fbasedataz.push(doc.data())
        // console.log(doc.data())
      })
      this.setState({
        fbasedata:fbasedataz
      })
        this.getData();
      // console.log(this.state.fbasedata)
    })
    .catch((err) => {
    console.log('Error getting documents', err);
    });
  }

  //get currency data
  getData() {
    const currencydata = this.state.fbasedata
    currencydata.forEach(data => {
      const urls = 'https://api.exchangeratesapi.io/latest?base=USD&symbols='+data.value
      // console.log(urls)
      axios({
        method: 'get',
        url: urls
      })
      .then((response) => {
      const dataref = db.collection("currencies")
      // let values = this.state.values
      let crncy = response.data.rates[data.value]
      // console.log(crncy.toString().slice(0,9))
      // let results = crncy * values
      // console.log(crncy)
      const updateref = dataref.where("value", "==", data.value);   
      updateref.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.id
          // console.log(data)
          const newdataref = dataref.doc(data)
          newdataref.update({
            converted: crncy.toString().slice(0,9)
          })
        })
      })
      .catch((err) => {
      console.log('Error getting documents', err);
      });

      // console.log(data.value)
      })
      .catch((error) => {
      console.log(error);
      });
    });
  }
  updateData(){
    const value = this.state.currency.slice(0,3)
    const label = this.state.currency.slice(6)
    const ref = db.collection("currencies").doc()
    ref.set({
      value:value,
      label:label
    })
    .then(()=>{
      this.getfbaseData()
    })
    console.log(value)
    console.log(label)
    setTimeout(function(){
      window.location.reload()
    }, 5 * 1000)
  }

  deleteData(data){
    const dataref = db.collection("currencies")
    console.log(data)
    const deleteref = dataref.where("value", "==", data);   
    deleteref.get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.id
        const newdataref = dataref.doc(data)
        newdataref.delete()
      })
      setTimeout(function(){
        window.location.reload()
      }, 5 * 1000)
    })
    .catch((err) => {
    console.log('Error getting documents', err);
    });

  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div className="App">
        <AppBar color="default" position="static">
            <p className="title1">USD - United States Dollar</p>
            <Grid container spacing={16}>
            <Grid item xs={6}>
                  <h2 className="title2">
                    USD
                  </h2>
            </Grid>
            <Grid item xs={6}>
            <TextField
                type='number'
                required
                value={this.state.values}
                onChange={this.handleChange('values')}
                className="textinput"
              />        
            </Grid>
            </Grid>
        </AppBar>
        <div className="App-body">
        {this.state.fbasedata.map(data => (
              <Card className="card">
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {data.value} - {this.state.values*data.converted}
                        </Typography>
                        <Typography component="p">
                            {data.value} - {data.label}   
                        </Typography>
                      </CardContent>
                      </CardActionArea>
                      <CardActions>
                          <Grid container spacing={24}>
                              <Grid item xs={10}>
                              <Typography className="title3" component="p">
                                  1 USD = {data.converted} {data.label}
                              </Typography>
                              </Grid>
                              <Grid item xs={2}>
                              <IconButton  onClick={() => { 
                                  this.deleteData(data.value)
                                  this.handleClickOpen()
                                }}aria-label="Delete" className="deletbutton">
                                  <DeleteIcon/>
                              </IconButton>
                              </Grid>
                          </Grid>
                      </CardActions>
                </Card>
          ))}
          <TextField
          id="outlined-select-currency"
          select
          label="Select"
          disabled={this.state.disabled}
          value={this.state.currency}
          onChange={this.handleChange('currency')}
          helperText="Add more currency"
          margin="normal"
          variant="outlined"
          >
          {currencies.currencies.map(option => (
            <MenuItem key={option.value} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Dialog 
          open={this.state.open}
          onClose={this.handleClose} 
          aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">Please wait, We're crafting some magic for u.</DialogTitle>
        <div>
        <Loader 
	          type="Triangle"
	          color="#00BFFF"
	          height="100"	
            width="100"
	        /> 
        </div>
        </Dialog>  
        <Button variant="contained" color="secondary"
        onClick={() => { 
            this.setState({
              currency:''
            })
            this.updateData()
            this.handleClickOpen()
            console.log("picked "+ this.state.currency)
          }}
        >
        
        <Add/>
        Submit
        </Button>
      </div>
      </div>
    );
  }
}

export default App;
