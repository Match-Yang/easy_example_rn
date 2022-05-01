import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Home from './Home.js'
import Welcome from './Welcome.js'

const Routes = () => (
   <Router>
      <Scene key = "root">
         <Scene key = "welcome" component = {Welcome} title = "Welcome" initial = {true} />
         <Scene key = "home" component = {Home} title = "Home" />
      </Scene>
   </Router>
)
export default Routes
