Incomes = new Mongo.Collection('incomes')
Expenses = new Mongo.Collection('expenses')

Meteor.publish('incomes', function () {
  return Incomes.find({ userId: this.userId })
})

Meteor.publish('expenses', function () {
  return Expenses.find({ userId: this.userId })
})
