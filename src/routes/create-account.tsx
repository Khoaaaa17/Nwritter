import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";


export default function CreateAccount(){
    const navigate = useNavigate();
    const [loading,setLoading]= useState(false);
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name,value}} = e;
        if(name === "name"){
            setName(value);
        }else if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if( loading || name === "" || email === "" || password === "") return;
        try{
            setLoading(!loading);
            const credentials = await createUserWithEmailAndPassword(auth, email,password);
            console.log(credentials.user);
            await updateProfile(credentials.user,{
                displayName: name,
            })
            navigate("/");
        }catch(e){
        if (e instanceof FirebaseError) {
            if (e.code === "auth/email-already-in-use") {
                setError("This email is already in use.");
            } else if(e.code === "auth/weak-password"){
                setError("Password should be at least 6 characters !");
            }else {
                setError(e.message);
            }
        } else {
            setError("An unexpected error occurred.");
        }
        } finally {
            setLoading(loading);
        }
        
        console.log(name,email,password);
    }
    return <Wrapper>
        <Title>Join 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required/>
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/>
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/>
            <Input onChange={onChange} type="submit" value={loading ? "Loading..." : "Create Account"}/>
        </Form>
        {error !== "" && <Error>{error}</Error>}
        <Switcher>
            Already have an account? <Link to="/login">Log In &rarr;</Link>
        </Switcher>
        <Switcher>
            <GithubButton/>
        </Switcher>
    </Wrapper>
}