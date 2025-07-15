interface User {
    id : string,
    name : string,
    age : number,
    email : string,
    password : string,
}

type customFields = Pick<User, "name" | "age" | "email">
type optionalFields = Partial<customFields>

function updateUser(values : optionalFields){

}

updateUser({name: "mukul", email: "hello@gmail.com"})