import React from 'react'
import App from 'components/App'

// Fastclick.
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

React.render(<App />, document.getElementById('root'))
