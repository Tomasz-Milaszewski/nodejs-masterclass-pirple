# Project

Second homework assignment for [Pirple's NodeJS master class](https://pirple.thinkific.com/courses/the-nodejs-master-class).

# How to run

* download the project and go to main directory
* run the app with `node index.js`
* default environment is `staging`, this can be changed to`production` with `NODE_ENV=production node index.js` 
* logs in console tell what ports app is listening to 
* requests can now be send e.g. with Postman
* press `Ctrl + C` to kill app

# Endpoints

## Users - `/localhost:3000/users`
### Create user
* method: POST
* payload example (all fields required):
```
{
  "firstName" : "John",
  "lastName" : "Smith",
  "email" : "johnyexample@yahoo.com",
  "password" : "examplepassword",
  "address" : "New York",
  "streetAddress" : "Central Road 111222"
}
```
### Read user data
* method: GET
* headers: `token`
* payload: email

### Update user
* method: PUT
* headers: `token`
* payload (email - required + at least one of the other fields e.g.):
```
{
  "email" : "johnyexample@yahoo.com",
  "streetAddress" : "updated adress"
}
```
### Delete user
* method: DELETE
* headers: `token`
* payload: email

## Tokens - `/localhost:3000/tokens`
### Log in (create token)
* method: POST
* payload: email, password (both required)

### Read token data
* method: GET
* query params: id (token id) 

### Update token (extend session)
* method: PUT
* payload id + extend(boolean)
```
{
  "id" : "123456789",
  "extend" : true
}
```
### Log out (delete token)
* method: DELETE
* query params: id (token id) 

## Menu - `/localhost:3000/menu`
### Get menu
* method: GET
* headers: `token`

## Carts - `/localhost:3000/cart`
### Create cart
* method: POST
* headers: `token`
* payload example (array of pizzas ;-): 
```
  [
      {
          "id":2,
          "amount":1
      },
      {
          "id":3,
          "amount":2
      }
  ]
```
### Read cart data
* method: GET
* headers: `token`

### Delete cart
* method: DELETE
* headers: `token`
* query params: cartId 

## Purchase - `/localhost:3000/purchase`
### Place a purchase order
* method: POST
* headers: `token` and `cartId` that exists








