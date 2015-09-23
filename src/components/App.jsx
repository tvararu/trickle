import React, { Component } from 'react'
import Firebase from 'firebase'

const ref = new Firebase('https://trickle.firebaseio.com')
const incomesRef = ref.child('incomes')
const expensesRef = ref.child('expenses')

const createTransaction = (amount, userId) => {
  return {
    userId,
    amount,
    createdAt: +new Date()
  }
}

export default class App extends Component {
  static displayName = 'App'
  state = {
    authData: ref.getAuth(),
    error: false,
    incomes: [],
    expenses: [],
    balance: 0
  }
  constructor (props) {
    super(props)
    ref.onAuth(this.authDataCallback)
    ref.on('value', (snapshot) => {
      if (!snapshot.val()) { return }
      const { incomes, expenses } = snapshot.val()
      const incomeArray = (incomes) ? Object.keys(incomes).map((key) => {
        const income = incomes[key]
        return Object.assign(income, { key })
      }) : []
      const expenseArray = (expenses) ? Object.keys(expenses).map((key) => {
        const expense = expenses[key]
        return Object.assign(expense, { key })
      }) : []
      const sum = (prev, curr) => prev + curr.amount
      const balance = (incomeArray.reduce(sum, 0) - expenseArray.reduce(sum, 0)).toFixed(2)
      this.setState({
        incomes: incomeArray,
        expenses: expenseArray,
        balance
      })
    })
  }
  authDataCallback = (authData) => {
    this.setState({ authData })
  }
  login = () => {
    ref.authWithOAuthPopup('google', (error) => {
      if (error) {
        this.setState({ error })
      }
    })
  }
  logout = () => {
    ref.unauth()
  }
  handleInputIncome = (e) => {
    const input = React.findDOMNode(this.refs.inputIncome)
    const val = Math.abs(parseFloat(input.value)).toFixed(2)
    if (e.keyCode === 13 && val) {
      incomesRef.push(createTransaction(val, this.state.authData.uid))
      input.value = ''
    }
  }
  handleInputExpense = (e) => {
    const input = React.findDOMNode(this.refs.inputExpense)
    const val = Math.abs(parseFloat(input.value)).toFixed(2)
    if (e.keyCode === 13 && val) {
      expensesRef.push(createTransaction(val, this.state.authData.uid))
      input.value = ''
    }
  }
  isLoggedIn = () => {
    return this.state.authData
  }
  renderLogin = () => {
    if (this.isLoggedIn()) {
      return <button onClick={ this.logout }>Logout</button>
    } else {
      return <button onClick={ this.login }>Login with Google</button>
    }
  }
  renderApp = () => {
    const { authData, incomes, expenses, balance } = this.state
    if (this.isLoggedIn()) {
      return <div>
        Hello { authData.google.displayName }.
        <div>
        </div>
        <h1>Available balance</h1>
        <div>{ balance }</div>
        <h1>Income</h1>
        <input type='number' ref='inputIncome' onKeyUp={ this.handleInputIncome } />
        <ul>
          { incomes.map(income => <li key={ income.key }>+{ income.amount }</li>) }
        </ul>
        <h1>Expenses</h1>
        <input type='number' ref='inputExpense' onKeyUp={ this.handleInputExpense } />
        <ul>
          { expenses.map(expense => <li key={ expense.key }>-{ expense.amount }</li>) }
        </ul>
      </div>
    } else {
      return null
    }
  }
  render () {
    return <div>
      { this.renderLogin() }
      { this.renderApp() }
    </div>
  }
}
