# XIII State and the Context API

## Homework

Work on your final projects. They should consist of a simple full stack (front and back end) master / detail view that uses React for the front end and has a backend which can be done in Express with mLab or with a local JSON file. You can use Firebase if you wish however be sure to use the same version of re-base that we used in session 10 - unless you really know what you are doing.

## Reading

A [Redux crash course](https://www.youtube.com/watch?v=93p3LxR9xfM) on YouTube.

## Redux and React's Context API

![Image of Interface](/other/interface.png)

```html
App
  Nav
    UserAvatar (needs user prop)
  Body
    Sidebar
      Userstats
        UserAvatar (needs user prop)
    Content
```

This app has the user’s information displayed in two places: in the nav bar at the top-right, and in the sidebar next to the main content.

With pure React (just regular props), we need to store the user’s info high enough in the tree that it can be passed down to the components that need it. In this case, the keeper of user info has to be App.

Then, in order to get the user info down to the components that need it, App needs to pass it along to Nav and Body. They, in turn, need to pass it down again, to UserAvatar and Sidebar. Finally, Sidebar has to pass it down to UserStats:

`App > Nav > UserAvatar`

and

`App > Body > Sidebar > UserStats > UserAvatar`

cd into `context-test` and run `npm i` and `npm start.

```js
import React from 'react'

import Nav from './Nav'

class App extends React.Component {
  render () {
    return (
      <div className = "app">
      <Nav />
      </div>
    )
  }
}

export default App
```

```js
import React from 'react'

import UserAvatar from './UserAvatar'

function Nav() {
  return (
    <div className="nav">
      <UserAvatar />
    </div>
  )
}

export default Nav
```



There are 3 important pieces to the context API:

* The `React.createContext` function which creates the context
* The `Provider` (returned by `createContext`) which provides data
* The `Consumer` (also returned by `createContext`) which taps into the provider to extract the data

The Provider is very similar to React-Redux’s Provider. It accepts a value prop which can be an object containing your data and any actions you want to be able to perform on the data.

The Consumer works a bit like React-Redux’s connect function, tapping into the data and making it available to the component that uses it.



## Adding React

We are continuing with the project from [last class](https://github.com/front-end-intermediate/session-11#adding-react) before moving forward with the below.

```html
<script src='https://unpkg.com/react@16.3.0-alpha.1/umd/react.development.js'></script>
<script src='https://unpkg.com/react-dom@16.3.0-alpha.1/umd/react-dom.development.js'></script>
<script src='https://unpkg.com/babel-standalone@6.15.0/babel.min.js'></script>
```

Keeping the existing vanilla JS app, add the following to the html. Note the new script's type `text/babel` (so we can use JSX):

```html
<hr />
<div id="app"></div>
...
<script type="text/babel" src="js/react-babel.js"></script>
```

Create the new js file and implement the main App component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        React app
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

Add stubs for List, Weapons and Pirates components:

```js
function List (props) {
  return (
    <ul>
    <li>list</li>
    </ul>
  )
}

class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        Pirates
        <List />
      </React.Fragment>
    )
  }
}

class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        Weapons
        <List />
      </React.Fragment>
    )
  }
}
```

And render them via the main App:

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates />
        <Weapons />
      </React.Fragment>
    )
  }
}
```

## Adding Items

Recall the `addPirate` function in the `dom.js` script:

```js
function addPirate(){
  const input = document.getElementById('pirate')
  const name = input.value
  input.value = ''
  
  store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false,
  }))
}
```

We grabbed the value from the input and then called our store and dispatched `addPirateAction()` with the id, name and a default value for complete.

We will now implement this is the Pirates component using React.

Add a header, input field (using a ref) and a button:

```js
class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Then add the `addItem` function:

```js
class Pirates extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch()
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Note that we used `this.props.store` above.

Make the store available to App:

```js
ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)
```

Pass the store to the Pirate component via props:

```js
// make the store available to Pirates
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons />
      </React.Fragment>
    )
  }
}
```

Now that the Pirates component has access to store we can complete the addItem function:

```js
addItem = (e) => {
  e.preventDefault()
  const name = this.input.value
  this.input.value = ''
  this.props.store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false
  }))
}
```

You should now be able to add a pirate to state. 

Note that it shows up in the vanilla js (VJS) app. VJS is using the same store as our react app and we haven't implemented list in our React app yet. In effect, we have two apps which are sharing the same state.

## Dispatching Weapons

Pass store as props to the weapons component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons store ={this.props.store} />
      </React.Fragment>
    )
  }
}
```

Edit Weapons to add a header, an input field and button as well:

```js
class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Add the addItem function to Weapons:

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
      name
    }))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

You should now be able to add a weapon to state.

## Render the Lists

Grab the Pirates and the Weapons state and pass them to thier respective components:

```js
class App extends React.Component {
  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

Now the Pirates and Weapons component receive their respective states.

Pirates component:

```js
<List items={this.props.pirates}/>
```

Weapons component"

```js
<List items={this.props.weapons}/>
```

Inside the List component we want to take in the props and map through them to show them in the view. 

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

The list component isn't receiving any items.

This is because our App component isn't listening for changes to state. In our VJS app we used `store.subscribe()` to listen for updates to state:

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

We want to cause a re-render which would normally be done by using `setState()`. But we do not have any state inside the App component. 

We will use a component lifecycle method and `forceUpdate()`:

```js
class App extends React.Component {

  componentDidMount () {
    const { store } = this.props
    store.subscribe( () => this.forceUpdate())
  }

  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

`forceUpdate()` triggers React's render() method. It is a bit of a hack at the moment but we will get rid of it soon. The alternative would be to add state to the App component but since we are going to implement state outside the react app we will live with it for now.

## Remove Items

Add remove item to the react slice.

The List component should take another prop - remove: `<button onClick={ () => props.remove(item)}>✖︎</button>`.

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>✖︎</button>
        </li>
      ))}
    </ul>
  )
}
```

We passed in the item that should be removed. Now we need to create `removeItem()` inside the Pirates and Weapons components as well as pass it to the List component:

```js
removeItem = (weapon) => {
  this.props.store.dispatch(removePirateAction(weapon.id))
}
```

```js
<List
items={this.props.pirates}
remove={this.removeItem}
/>
```

As follows:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input 
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

And in the Weapons component.

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
      name
    }))
  }

  removeItem = (weapon) => {
    this.props.store.dispatch(removeWeaponAction(weapon.id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
          <List
          items={this.props.weapons}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

## Toggle

Add the toggle functionality that marks a Pirate as spotted.

The action in `scripts.js` is `togglePirate`. Add a method to the Pirate component:

```js
toggleItem = (id) => {
  this.props.store.dispatch(togglePirateAction(id))
}
```

And pass it as a prop to the List component:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
  }

  toggleItem = (id) => {
    this.props.store.dispatch(togglePirateAction(id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          toggle={this.toggleItem}
          />
      </React.Fragment>
    )
  }
}
```

And call it in the List component:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle(item.id)}>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Because weapons don't use toggle we need to test for the function before we call it:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle && props.toggle(item.id)}>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Now we can add styling:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle && props.toggle(item.id)}
          style={ {textDecoration: item.complete ? 'line-through' : 'none'} }>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

## Asynchronous Data

Delete the VJS UI

```html
<!-- <div>
  <h1>Pirate List</h1>
  <input id='pirate' type='text' placeholder="Add Pirate">
  <button id='pirateBtn'>Add Pirate</button>
  <ul id='pirates'></ul>
</div>

<div>
  <h1>Weapon List</h1>
  <input id='weapon' type='text' placeholder="Add Weapon">
  <button id='weaponBtn'>Add Weapon</button>
  <ul id='weapons'></ul>
</div> -->
```

Disconnect from `dom.js`.

```html
<!-- <script type='text/javascript' src="js/dom.js"></script> -->
```

And add some of the script in `dom.js` to our `react-babel.js` script:

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}), Redux.applyMiddleware(checker, logger))

store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  // document.getElementById('pirates').innerHTML = ''
  // document.getElementById('weapons').innerHTML = ''

  // pirates.forEach(addPirateToDom)
  // weapons.forEach(addWeaponToDom)
})

function generateId() {
  return Date.now()
}
```

Examine and add a script for a mock api.

```html
<script src="http://daniel.deverell.com/index.js"></script>
```

Its offers an IIFE. Try examining it in the console.

```js
> API
```

And a 'fail' function (once every five times). Default values via fetch pirates and fetch weapons.

`App`:

```js
  componentDidMount () {

    const { store } = this.props

    Promise.all([
      API.fetchPirates(),
      API.fetchWeapons()
    ]).then( ([pirates, weapons]) => {
      console.log('pirates', pirates)
      console.log('weapons', weapons)
    })
    
    store.subscribe( () => this.forceUpdate())
  }
```

Instead of logging we want to add the tiems to our Redux store. But we do not have an appropriate action creator for multiple items.

In `scripts.js`:

```js
const RECEIVE_DATA = 'RECEIVE_DATA'
...
function receiveDataAction( pirates, weapons) {
  return {
    type: RECEIVE_DATA,
    pirates,
    weapons
  }
}
...
function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : 
    return state.concat([action.pirate])
    case REMOVE_PIRATE :
    return state.filter((pirate) => pirate.id !== action.id)
    case TOGGLE_PIRATE :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    case RECEIVE_DATA:
      return action.pirates
    default :
    return state
  }
}
...
function weapons (state = [], action) {
  switch(action.type) {
    case ADD_WEAPON :
    return state.concat([action.weapon])
    case REMOVE_WEAPON :
      return state.filter((weapon) => weapon.id !== action.id)
    case RECEIVE_DATA:
      return action.weapons
    default :
    return state
  }
}
```

Now we can run our action using `store.dispatch`:

```js
componentDidMount () {
  const { store } = this.props

  Promise.all([
    API.fetchPirates(),
    API.fetchWeapons()
  ]).then( ([pirates, weapons]) => {
    store.dispatch(receiveDataAction(pirates, weapons))
    })
  
  store.subscribe( () => this.forceUpdate())
}
```

### Loading...

We will use the Redux store for the state.

Place a new piece of state inside the Redux store using a new reducer function.

In `scripts.js`:

```js
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}
```

Add the reducer to our reducers list:

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(checker, logger))
```

And finally, add an if statement that checks for loading to the render function of App:

```js
class App extends React.Component {
...
  render(){
    const { store } = this.props
    const { pirates, weapons, loading } = store.getState()

    if (loading === true) {
      return <h3>Loading...</h3>
    }

...
}
```



