const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(checker, logger))

store.subscribe(() => {
  const { weapons, pirates } = store.getState()
})

function generateId() {
  return Date.now()
}

function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={() => props.toggle && props.toggle(item.id)}
          style={ {textDecoration: item.complete ? 'line-through' : 'none'} } >
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>✖︎</button>
        </li>
      ))}

    </ul>
  )
}

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
    return API.deletePirate(pirate.id)
      .catch(() => {
        this.props.store.dispatch(addPirateAction(pirate))
        alert('An error occurred. Try again.')
      })
  }

  toggleItem = (id) => {
    this.props.store.dispatch(togglePirateAction(id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirates</h1>
        <input
          type="text"
          placeholder="Add Pirate"
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
     return API.deleteWeapon(weapon.id)
      .catch(() => {
        this.props.store.dispatch(addWeaponAction(weapon))
        alert('An error occurred. Try again.')
      })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapons</h1>
        <input
          type="text"
          placeholder="Add Weapon"
          ref={ (input) => this.input = input }
        />
        <button onClick={this.addItem}>Add Weapon</button>
        <List
          items={this.props.weapons}
          remove={this.removeItem} />
      </React.Fragment>
    )
  }
}

class App extends React.Component {

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

  render(){
    const { store } = this.props
    const { pirates, weapons, loading } = store.getState()

    if (loading === true) {
      return <h3>Loading...</h3>
    }

    return(
      <React.Fragment>
        <Pirates store={this.props.store} pirates={pirates} />
        <Weapons store={this.props.store} weapons={weapons} />
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)