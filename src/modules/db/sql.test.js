import { init } from "./sql.js"
import { Model as User } from "../user/model.js"
import { Model as Password } from "../password/model.js"

async function main() {
    const connection = await init();
    console.log(connection)

    const user = await User.create("6", "1")
    console.log('user', user)

    const password = await Password.create(Buffer.from('abc'), 'pass', user)
    console.log('password', password)
}

main()
