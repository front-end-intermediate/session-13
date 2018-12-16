import React from "react"
import Nav from './Nav'
import Body from './Body'

class App extends React.Component {

render() {
    return (
      <div className="app">
          <Nav />
          <Body />
      </div>
    );
  } 
}

export default App