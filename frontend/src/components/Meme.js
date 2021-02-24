import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { SINGLE_MEME_ENDPOINT } from '../communication/requests'

class Meme extends Component {

  constructor() {
    super()
    this.state = {
      image: undefined
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const ENDPOINT = `${SINGLE_MEME_ENDPOINT}/${id}`;
    fetch(ENDPOINT, {
      method: 'GET',
    }).then((response) => response.json())
    .then((json) => {
      console.log(json)
      if(json.success && json.data.image){
        this.setState({ image: json.data.image })
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.image && 
        <img src={this.state.image} alt='singleMeme'/>}
      </div>
    )
  }

}

export default withRouter(Meme);