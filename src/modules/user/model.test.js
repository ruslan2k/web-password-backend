import { User } from './model.js'

(async () => {
    //await User.create({ email: 'email', password: 'password' })
    const x = await User.login('email', 'password')
    console.log(x)
})()
