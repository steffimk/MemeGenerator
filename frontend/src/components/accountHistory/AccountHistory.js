import { GridList } from '@material-ui/core'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { authorizedFetch, MEMES_ENDPOINT, TEMPLATE_ENDPOINT } from '../../communication/requests'
import CustomAppBar from '../CustomAppBar/CustomAppBar'

export default class AccountHistory extends Component {

  constructor(props){
    super(props)
    this.state = {
      ownMemes: [],
      ownTemplates: [],
      isAuthenticated: true
    }
  }

  componentDidMount(){
    this.getOwnMemes()
    this.getOwnTemplates()
}

  getOwnMemes = () => {
    const username = localStorage.getItem('memeGen_username')
    const endpointWithQuery = `${MEMES_ENDPOINT}?username=${username}`
    authorizedFetch(endpointWithQuery, 'GET')
    .then(res => { 
      if(res.ok) return res.json
      else if(res.status === 401) this.setState({ isAuthenticated: false })
      return Promise.reject("API Responded with an error: "+res.status+" "+res.statusText)})
      .then( json =>
        this.setState({ ownMemes: json.data.memes })
      ).catch(e => console.log(e))
  }

  getOwnTemplates = () => {
    const username = localStorage.getItem('memeGen_username')
    const endpointWithQuery = `${TEMPLATE_ENDPOINT}?username=${username}`
    authorizedFetch(endpointWithQuery, 'GET')
    .then( res => { 
      if(res.ok) return res.json
      else if(res.status === 401) this.setState({ isAuthenticated: false })
      return Promise.reject(`API Responded with an error: ${res.status} ${res.statusText}`)})
    .then( json =>
      this.setState({ ownTemplates: json.data.templates })
    ).catch(e => console.log(e))
  }

  render() {
    // If not logged in: Redirect to login page
    if (!this.state.isAuthenticated) return <Redirect to='/login'/>

    return (
      <div>
        <CustomAppBar />
        <h3>Your memes: </h3>
        {/* <GridList>
          {renderedMemes}
        </GridList> */}
        <h3>Your drafts: </h3>
        {/* <GridList>
          {renderedTemplates}
        </GridList> */}
      </div>
    )
  }
}