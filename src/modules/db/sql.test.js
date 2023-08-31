import { init } from "./sql.js"

async function main() {
    const connection = await init();
    console.log(connection)
}

main()
