# XIII State and the Context API

## Homework

Final projects are due.

## Reading

A [Redux crash course](https://www.youtube.com/watch?v=93p3LxR9xfM) on YouTube.

## Redux and React's Context API

Review the Redux sample.

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

Create `App.js`:

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

And `Nav.js`:

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

Add state to `App.js`:

```js
import React from 'react'

import Nav from './Nav'

class App extends React.Component {

  state = {
    user: {
      avatar:
      "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
      name: "Daniel",
      followers: 1234,
      following: 123
    }
  };
  
  render () {
    return (
      <div className = "app">
      <Nav user={this.state.user} />
      </div>
    )
  }
}

export default App
```

And pass the user to `Nav.js`: `<Nav user={this.state.user} />`

Pass the user to `Nav` via props:

```js
import React from 'react'

import UserAvatar from './UserAvatar'

function Nav(props) {
  return (
    <div className="nav">
      <UserAvatar user={props.user} />
    </div>
  )
}

export default Nav
```

Consume the props in `UserAvatar`:

```js
import React from 'react';

const UserAvatar = (props) => (
  <div className="user-avatar">
    {props.user.name}
  </div>
);

export default UserAvatar
```

There are 3 important pieces to the context API:

* The `React.createContext()` function which creates the context
* The `Provider` (returned by `createContext`) which provides data
* The `Consumer` (also returned by `createContext`) which taps into the provider to extract the data

The Provider is very similar to React-Redux’s Provider. It accepts a value prop which can be an object containing your data and any actions you want to be able to perform on the data.

The Consumer works like React-Redux’s connect function, tapping into the data and making it available to the component that uses it.

Create a new `UserProvider.js` component with `rcc`:

```js
import React from "react"

const UserContext = React.createContext();

class UserProvider extends React.Component {

  state = {
    user: {
      avatar:
      "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
      name: "Daniel",
      followers: 1234,
      following: 123
    }
  };

render() {
    return (
        <UserContext.Provider value={this.state.user}>
          {this.props.children}
        </UserContext.Provider>
    );
  } 
}

export const UserConsumer = UserContext.Consumer

export default UserProvider
```

Import the UserProvider into `index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";

import App from './components/App'
import UserProvider from './components/UserProvider'

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>, document.querySelector("#root"));
```

Now App can just reference `<Nav />`:

```js
import React from "react"
import Nav from './Nav'

class App extends React.Component {

render() {
    return (
      <div className="app">
          <Nav />
      </div>
    );
  } 
}

export default App
```

And Nav no longer needs to kow about the user:

```js
import React from 'react'
import UserAvatar from './UserAvatar'

const Nav = () => (
  <div className="nav">
    <UserAvatar size="small" />
  </div>
);

export default Nav
```

However `UserAvatar` needs the icon:

```js
import React from 'react'

import { UserConsumer } from './UserProvider'

const UserAvatar = ({ size }) => (
  <UserConsumer>
    {user => (
      <img
        className={`user-avatar ${size || ""}`}
        alt="user avatar"
        src={user.avatar}
      />
    )}
  </UserConsumer>
);

export default UserAvatar
```

Redux’s connect function is a higher-order component. It wraps another component and passes props into it. The context Consumer, by contrast, expects the child component to be a function. It then calls that function at render time, passing in the value that it got from the Provider somewhere above it.

Add `<Body />` to App.

Userstats needs to know about the user.

`Userstats.js`:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

import { UserConsumer } from './UserProvider'

const UserStats = () => (
  <UserConsumer>
   { user => (
        <div className="user-stats">
        <div>
          <UserAvatar />
          {user.name}
        </div>
        <div className="stats">
          <div>{user.followers} Followers</div>
          <div>Following {user.following}</div>
        </div>
      </div>
   ) }
  </UserConsumer>
);

export default UserStats
```

## Asynchronous Data

Continuing with the files in `test-one`.

Delete the VJS UI from `index.html`:

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

### Removing Items

Optimistic - remove the item from local state before it gets removed from the db. This requires a fallback in the event of error.

Pirates:

```js
removeItem = (pirate) => {
  this.props.store.dispatch(removePirateAction(pirate.id))
  return API.deletePirate(pirate.id)
    .catch(() => {
      this.props.store.dispatch(addPirateAction(pirate))
      alert('An error occurred. Try again.')
    })
}
```

Weapons

```js
removeItem = (weapon) => {
  this.props.store.dispatch(removeWeaponAction(weapon.id))
    return API.deleteWeapon(weapon.id)
    .catch(() => {
      this.props.store.dispatch(addWeaponAction(weapon))
      alert('An error occurred. Try again.')
    })
}
```

### Toggle Pirates

Let's bring the same optimism to the toggle on Pirates.

```js
toggleItem = (id) => {
  this.props.store.dispatch(togglePirateAction(id))
  return API.savePirateToggle(id)
    .catch(() => {
      this.props.store.dispatch(togglePirateAction(id))
      alert('An error occurred. Try again.')
    })
}
```

## Adding Pirates and Weapons

Update AddItem for weapons:

```js
  addItem = (e) => {
    e.preventDefault()
    return API.saveWeapon(this.input.value)
      .then((weapon) => {
        this.props.store.dispatch(addWeaponAction(weapon))
        this.input.value = ''
    })
    .catch( () => alert('There was an error. Try again'))
  }
```

For Pirates:

```js
  addItem = (e) => {
    e.preventDefault()
    return API.savePirate(this.input.value)
      .then((pirate) => {
        this.props.store.dispatch(addPirateAction(pirate))
        this.input.value = ''
      })
    .catch(() => alert('There was an error, Try again'))
  }
```

Now we are simultaneously updating state and the database.

### Middleware

We are mixing UI and data logic. Our data fetching logic should be in the action creator, not in the components.

`handleDeletePirate`

`this.props.store.dispatch(handleDeletePirate(pirate))`

```js
  removeItem = (pirate) => {
    this.props.store.dispatch(handleDeletePirate(pirate))
  }
```

Create a new action in scripts.js:

```js
function handleDeletePirate(pirate) {
  // this.props.store.dispatch(removePirateAction(pirate.id))
  // return API.deletePirate(pirate.id)
  //   .catch(() => {
  //     this.props.store.dispatch(addPirateAction(pirate))
  //     alert('An error occurred. Try again.')
  //   })
}
```

If we return a function, passing in dispatch, we can manage all asynchronous code like so:

```js
function handleDeletePirate(pirate) {
  return (dispatch) => {
    dispatch(removePirateAction(pirate.id))
    return API.deletePirate(pirate.id)
      .catch(() => {
        dispatch(addPirateAction(pirate))
        alert('An error occurred. Try again.')
      })
  }
}
```

This is cleanly separating UI and data fetching code.

However we are now dispatching objects:

```js
  removeItem = (pirate) => {
    this.props.store.dispatch(handleDeletePirate(pirate))
  }
```

As well as functions.

This can be remediated via middleware.

In scripts:

```js
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch)
  }

  return next(action)
}
```

Add the middleware to the list:

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(thunk, checker, logger))
```

We can use the same technique for removing data logic for any of our async API calls:

`Weapons`:

```js
removeWeapon = (weapon) => {
  this.props.store.dispatch(handleDeleteWeapon(weapon))
}
```

Scripts:

```js
function handleDeleteWeapon(weapon) {
  return (dispatch) => {
    dispatch(removeWeaponAction(weapon.id))
    return API.deleteWeapon(weapon.id)
    .catch(() => {
      dispatch(addWeaponAction(weapon))
      alert('An error occurred. Try again.')
    })
  }
}
```

