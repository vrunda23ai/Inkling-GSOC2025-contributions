const APT_URL = 'http://localhost:3000/api/auth'

type signupdetails = {
    fullName: string | undefined,
    gender: string | undefined,
    username: string | undefined,
    password: string | undefined, 
    confirmPassword: string | undefined,
}

type logindetails = {
    username: string | undefined,
    password: string | undefined, 
}

async function httpSignup(signupdetails: signupdetails) {
    // const request = await fetch(`${APT_URL}/signup`);
    // const response = await request.json();
    // return response;
    try { 
        const request = await fetch(`${APT_URL}/signup`, {
            method: 'post',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupdetails),
        });
        const response = await request.json();
        response.ok = true;
        return response;
    }
    catch (err) {
        return { error : "Server Error", ok: false }
    }
}

async function httpLogin(logindetails: logindetails) {
    try { 
        const request = await fetch(`${APT_URL}/login`, {
            method: 'post',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logindetails),
        });
        const response = await request.json();
        response.ok = true;
        return response;
    }
    catch (err) {
        return { ok: false }
    }
}

async function httpLogout() {
    try { 
        const request = await fetch(`${APT_URL}/logout`, {
            credentials: "include",
        });
        const response = await request.json();
        response.ok = true;
        return response;
    }
    catch (err) {
        return { ok: false }
    }
}

export {
    httpSignup,
    httpLogin,
    httpLogout
};