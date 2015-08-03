Incomes = new Mongo.Collection('incomes')
Expenses = new Mongo.Collection('expenses')

Incomes.allow({
  insert: function (userId, doc) {
    return userId === doc.userId
  }
})

Expenses.allow({
  insert: function (userId, doc) {
    return userId === doc.userId
  }
})

Meteor.publish('incomes', function () {
  return Incomes.find({ userId: this.userId })
})

Meteor.publish('expenses', function () {
  return Expenses.find({ userId: this.userId })
})
