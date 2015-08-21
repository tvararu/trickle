Meteor.subscribe('incomes')
Meteor.subscribe('expenses')

var Incomes = new Mongo.Collection('incomes')
var Expenses = new Mongo.Collection('expenses')

function isEnter (e) {
  return e.keyCode === 13
}

Template.main.helpers({
  incomes: function () { return Incomes.find() },
  expenses: function () { return Expenses.find() },
  balance: function () {
    var income = Incomes.find().fetch()
      .reduce(function (total, curr) {
        return total + curr.amount
      }, 0)
    var expenses = Expenses.find().fetch()
      .reduce(function (total, curr) {
        return total - curr.amount
      }, 0)
    return (income + expenses).toFixed(2)
  }
})

Template.main.events({
  'keypress #input-income': function (e) {
    if (isEnter(e)) {
      var amount = Math.abs(parseFloat(e.currentTarget.value))
      if (amount) {
        Incomes.insert({ userId: Meteor.user()._id, amount: amount })
      }
      e.currentTarget.value = ''
    }
  },
  'keypress #input-expense': function (e) {
    if (isEnter(e)) {
      var amount = Math.abs(parseFloat(e.currentTarget.value))
      if (amount) {
        Expenses.insert({ userId: Meteor.user()._id, amount: amount })
      }
      e.currentTarget.value = ''
    }
  }
})
