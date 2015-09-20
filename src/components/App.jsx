import React from 'react'
import Firebase from 'firebase'

const ref = new Firebase('https://trickle.firebaseio.com')

export default React.createClass({
  displayName: 'App',
  getInitialState () {
    return {
      authData: ref.getAuth(),
      error: false
    }
  },
  componentDidMount () {
    ref.onAuth(this.authDataCallback)
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
    const { authData } = this.state
    if (this.isLoggedIn()) {
      return <div>Hello { authData.google.displayName }.</div>
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
