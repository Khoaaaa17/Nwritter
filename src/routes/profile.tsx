import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "./timeline";
import Tweet from "../components/tweet";
import { CancelButton, ConfirmButton, EditButtons, EditInput } from "../components/tweet-components";


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        width: 50px;
    }
`;

const AvatarImg = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    position: relative;
    font-size: 22px;
`;

const UsernameEditButton = styled.span`
    position: absolute;
    bottom: 15px;
    left: 60px;
    svg {
        width: 20px;
        color: rgba(255,255,255,0.5);
    }
    &:hover {
        cursor: pointer;
    }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.displayName); 

    if (!user) return;

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
    const fetchTweets = async () => {
        const tweetQuery = query(
          collection(db, "tweets"),
          where("userId", "==", user?.uid),
          orderBy("createdAt", "desc"),
          limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
    };
    useEffect(() => {
      fetchTweets();
  }, []);
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      setName(e.target.value);
    }
    const toggleEditUsername = () => {
      setEditMode(true);
    }
    const handleComfirmEdit = async() => {
      if (!user) return;
      await updateProfile(user,{
        displayName: name
      })
      window.location.reload();
    }
    const handleCancelEdit = () => {
      setEditMode(false);
      setName(user?.displayName);
    }

    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput
                onChange={onAvatarChange}
                id="avatar"
                type="file"
                accept="image/*"
            />
            <Name>
                {!editMode && (
                    <UsernameEditButton onClick={toggleEditUsername}>
                        <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </UsernameEditButton>
                )}
                {editMode ? (
                    <>
                        <EditInput
                            placeholder="Enter Name"
                            value={name ?? user?.displayName ?? ""}
                            onChange={onChange}
                        />
                        <EditButtons>
                            <ConfirmButton onClick={handleComfirmEdit}>Edit</ConfirmButton>
                            <CancelButton onClick={handleCancelEdit}>Cancel</CancelButton>
                        </EditButtons>
                    </>
                ) : (
                    user?.displayName || "Anonymous"
                )}
            </Name>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}
