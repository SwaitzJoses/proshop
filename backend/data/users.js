import bcrypt from 'bcryptjs'

const users = [
    {
        name:'Admin User',
        email:'admin@example.com',
        password:bcrypt.hashSync('12345',10),
        isAdmin:true
    },
    {
        name:'Robert',
        email:'rob@example.com',
        password:bcrypt.hashSync('12345',10)
        
    },
    {
        name:'James',
        email:'james@example.com',
        password:bcrypt.hashSync('12345',10)
        
    },


]

export default users;