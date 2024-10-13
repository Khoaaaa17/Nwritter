import { addDoc, collection, updateDoc } from "firebase/firestore"
import { useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import { EmailAuthCredential } from "firebase/auth/cordova"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const Form = styled.form`
    display:flex;
    flex-direction: column;
    gap: 10px;

`

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize:none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    &::placeholder{
        font-size:16px;
    }
    &:focus{
        outline:none;
        border-color: #1d9bf0;
    }

` 

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`

const AttachFileInput = styled.input`
    display: none;
`

const SubmitButton = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`

export default function PostTweetForm(){
    const [loading,setLoading] = useState(false);
    const [tweet,setTweet] = useState("");
    const [file,setFile] = useState<File | null>(null);
    const LIMIT_SIZE = 1 * 1024 * 1024;
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = e.target;
        setTweet(value);
    } 
    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1 && files[0].size < LIMIT_SIZE){
            setFile(files[0]);
        }
    }
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const user = auth.currentUser;
        if(!user || loading || tweet === "" || tweet.length > 180) return;
        try {
            const doc = await addDoc(collection(db,"tweets"),{
                tweet,
                email: user.email,
                username: user.displayName || "Anonymous",
                createdAt: Date.now(),
                userId: user.uid
            });
            if(file){
                const locationRef = ref(storage,`tweets/${user.uid}-${user.displayName}/${doc.id}`);
                const result = await uploadBytes(locationRef,file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc,{
                    photo: url
                })
                setTweet("");
                setFile(null);
            }
        } catch (e:any) {
            console.error(e);
            console.log(e);
        }finally{
            setLoading(false)
        }
    }
    
    return <Form onSubmit={onSubmit}>
        <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening ?" required/>
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} id="file" accept="image/*" type="file"/>
        <SubmitButton type="submit" value={loading ?  "Posting..." : "Post Tweet"}/>
    </Form>
}