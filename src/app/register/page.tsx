import React from "react";

function Register(){
    return(
        <div>
                    <div>LoginPage</div>
                    <form>
                        <label>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                         />
                        <label>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                        />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
        
    )
}
export default Register