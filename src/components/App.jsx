import React from 'react'
import Firebase from 'firebase'

const ref = new Firebase('https://trickle.firebaseio.com')
const incomesRef = window.incomesRef = ref.child('incomes')

export default React.createClass({
  displayName: 'App',
  getInitialState () {
    return {
      authData: ref.getAuth(),
      error: false,
      incomes: []
    }
  },
  componentDidMount () {
    ref.onAuth(this.authDataCallback)
    ref.on('value', (snapshot) => {
      const incomes = Object.keys(snapshot.val().incomes).map((key) => {
        const income = snapshot.val().incomes[key]
        return Object.assign(income, { key })
      })
      this.setState({ incomes })
    })
  },
  authDataCallback (authData) {
    this.setState({ authData })
  },
  login () {
    ref.authWithOAuthPopup('google', (error) => {
      if (error) {
        this.setState({ error })
      }
    })
  },
  logout () {
    ref.unauth()
  },
  handleKeyUp (e) {
    const input = React.findDOMNode(this.refs.input)
    const val = Math.abs(parseFloat(input.value))
    if (e.keyCode === 13 && val) {
      incomesRef.push({
        userId: this.state.authData.uid,
        amount: val,
        createdAt: +new Date()
      })
      input.value = ''
    }
  },
  isLoggedIn () {
    return this.state.authData
  },
  renderLogin () {
    if (this.isLoggedIn()) {
      return <div onClick={ this.logout }>Logout</div>
    } else {
      return <div onClick={ this.login }>Login with Google</div>
    }
  },
  renderApp () {
    const { authData, incomes } = this.state
    if (this.isLoggedIn()) {
      return <div>
        Hello { authData.google.displayName }.
        <div>
          <input type='number' ref='input' onKeyUp={ this.handleKeyUp } />
        </div>
        <h1>Incomes</h1>
        <ul>
          { incomes.map(income => <li key={ income.key }>{ income.amount }</li>) }
        </ul>
      </div>
    } else {
      return null
    }
  },
  render () {
    return <div>
      { this.renderLogin() }
      { this.renderApp() }
    </div>
  }
})
