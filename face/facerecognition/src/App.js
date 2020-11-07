import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Name from './components/Name/Name';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: '3f583350f95948069728c8270459577d'
 });


const par={
  particles: {
    value:30,
    density: {
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

const init={
  input:'',
  imageUrl:'',
  celebName:'',
  route:'SignIn',
  isSignedIn:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state=init;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  displayName=(name)=>{
    this.setState({celebName:name})
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.CELEBRITY_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayName(response.outputs[0].data.regions[0].data.concepts[0].name)
      })
      .catch(err => console.log(err));
  }

  onRouteChange=(route)=>{
    if(route === 'signout'){
      this.setState(init)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={par}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home'
          ? <div>
              <Logo />
              <Name celebName={this.state.celebName} />
              <Rank name={this.state.user.name}
                entries={this.state.user.entries}/>
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition imageUrl={this.state.imageUrl}/>
            </div>
          :(
            this.state.route==='SignIn'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
