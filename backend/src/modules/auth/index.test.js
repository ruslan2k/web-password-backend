import { login, decodeToken } from './index.js'

(async () => {
    const t = '***'
    
    var resp
    //resp = await signup(null, { email: 'user@example.com', password: '12345' });
    //console.log('resp', resp)

    //resp = await login(null, { email: 'user@example.com', password: '12345' });
    console.log('resp', resp)
    resp = decodeToken(t)
    console.log('resp', resp)
})();
