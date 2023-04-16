import { create, getRandomKey } from './model.js'

(async () => {
    const { salt, iv, ciphertext } = await create('a')
    
    console.log({ salt, iv, ciphertext })
    const x = await getRandomKey('a', salt, ciphertext)

    console.log('x', x)
})()
