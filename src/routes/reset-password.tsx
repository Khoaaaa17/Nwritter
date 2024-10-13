import { useState } from "react";
import { Error, Form, Note, Title, Wrapper, Success, Switcher } from "../components/auth-components";
import styled from "styled-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";

const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    font-size: 16px;
    &[type="submit"]{
        margin-top: 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        font-weight: 500;
        padding: 10px 6rem;
        border-radius: 50px;
        background-color: #1d9bf0;
        color: white;
        font-size: 16px; 
        transition: opacity 0.2s ease, transform 0.2s ease; 
        &:hover {
        cursor: pointer;
        opacity: 0.8; 
        transform: scale(1.05); 
        }
        &:active {
        transform: scale(0.98); 
        }
    }
`

export default function ResetPassword(){
    const [loading,setLoading] = useState(false);
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        if(name === "email"){
            setEmail(value);
        }
    }
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (loading || email === "") {
            setError("No user is currently logged in or email is not available.")
            return;
        }
        try {
            setLoading(!loading);
            await sendPasswordResetEmail(auth,email);
            setMessage(`Password reset email sent to ${email}. Please check your inbox.`)
        } catch(e:any){
            if (e instanceof FirebaseError) {
                switch(e.code){ 
                    case "auth/invalid-email":
                        setError("Invalid Email!");
                        break;
                    case "auth/user-not-found":
                        setError("User not found!")
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
        console.log(email);
    }
    return <Wrapper>
        <Title>Find your 𝕏 account</Title>
        <Note>Enter the email, phone number, or username associated with your account to change your password.</Note>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} type="email" name="email" value={email} placeholder="Email" required/>
            <Input onChange={onChange} type="submit" value={loading ? "Loading..." : "Sent"} />
        </Form>
        <Switcher>
            Don't want to change password? <Link to={"/login"}>Go Back &rarr;</Link>
        </Switcher>
        <Switcher>
            Don't have an account? <Link to={"/create-account"}>Create One &rarr;</Link>
        </Switcher>
        {message && <Success>{message}</Success>}
        {error&& <Error>{error}</Error>}
    </Wrapper>
}