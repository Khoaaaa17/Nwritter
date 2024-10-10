import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";


export default function Login(){
    const navigate = useNavigate();
    const [loading,setLoading]= useState(false);
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name,value}} = e;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if( loading || email === "" || password === "") return;
        try{
            setLoading(!loading);
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/");
        }catch(e:any){
        if (e instanceof FirebaseError) {
            switch(e.code){ 
                case "auth/email-already-in-use":
                    setError("This email is already exists!");
                    break;
                case "auth/weak-password":
                    setError("Password must at least 6 characters!")
                    break;
                case "auth/invalid-login-credentials":
                    setError("Invalid Password!");
                    break;
                case "auth/too-many-requests":
                    setError("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.")
                    break;
                default:
                    setError(e.message);
            }
        } else {
            setError("An unexpected error occurred.");
        }
        } finally {
            setLoading(loading);
        }
        
        console.log(email,password);
    }
    return <Wrapper>
        <Title>Login 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/>
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/>
            <Input onChange={onChange} type="submit" value={loading ? "Loading..." : "Login!"}/>
        </Form>
        {error !== "" && <Error>{error}</Error>}
        <Switcher>
            Don't have an account? <Link to="/create-account">Create One &rarr;</Link>
        </Switcher>
    </Wrapper>
}