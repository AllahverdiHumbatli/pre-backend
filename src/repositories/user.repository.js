
const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 22 }
]
export const totalRequests = {
    totalRequests: 0,
    routes: {
        hello: 0,
        users: 0,
        about: 0
}
}

export  function getAllUsers(){
    return users;
}
export  function getUserById(id){
   const user=  users.find(user => user.id === Number(id))
    if(!user){
        console.log("No user with id "+Number(id))
        return null;
    }
    return user;

}