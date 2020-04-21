import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
import moment from 'moment'

class App extends Component {

  constructor() {
    super();
    this.state = {
      countryData: [],
      value: ""
    };
    this.displayDailyData = this.displayDailyData.bind(this);   
  }

  componentDidMount() {
    // Initialize the App Client
    this.client = Stitch.initializeDefaultAppClient("covid-map-eyhcg");
    // Get a MongoDB Service Client
    // This is used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "covid-map"
    );
       // Get a reference to the todo database
       this.db = mongodb.db("covidDB");
       this.displayDailyDataOnLoad();
     }
     
     // options
     displayDailyData() {
      const options = {
        limit : 10,
        sort: { cases: -1 } 
      };

       // query the remote DB and update the component state
       this.db
         .collection("dailyData")
         .find({}, options)
         .asArray()
         .then(countryData => {
           this.setState({countryData});
         });
         //this.showJson();
      }

      showJson(){
        console.log(this.state.countryData);
      }
      
     displayDailyDataOnLoad() {
       // Anonymously log in and display comments on load
       this.client.auth
         .loginWithCredential(new AnonymousCredential())
         .then(this.displayDailyData)
         .catch(console.error);
     }


  render() {
    return (
      <div align="center">
        <table>
          <tr>
          <th align="left">Country</th>
          <th align="left">Cases</th>
          <th align="left">Recovered</th>
          <th align="left">Deaths</th>
          <th align="left">Last update</th>
          <th align="left">Flag</th>
          </tr>

          {/* Map over the countries from state*/}
          
          {this.state.countryData.map(country => {
            return <tr>
              <td align="left">{country.country}</td>
              <td align="left">{country.cases}</td>
              <td align="left">{country.recovered}</td>
              <td align="left">{country.deaths}</td>
              <td align="left">{moment(country.updated).startOf('hour').fromNow()}</td>
              <td align="left"><img src={country.countryInfo.flag} border={2} height={50} width={75}></img></td>
            </tr>;
          })}

        </table>
      </div>
    );
  }
}

export default App;
