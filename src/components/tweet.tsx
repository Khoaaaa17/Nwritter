import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ITweet } from "../routes/timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import dayjs from "dayjs";

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  margin-bottom: 5px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const EditInput = styled.textarea`
  margin: 10px 0px;
  background-color: black;
  color:white;
  font-size: 18px;
  padding: 10px;
  width: 100%;
  resize: none;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const MenuButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  margin-right: 15px;
  user-select: none;
  svg {
    width: 30px;
  }
  &:hover {
    cursor: pointer;
    opacity: 0.8;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 10px;
  z-index: 10;
`;

const DropdownButton = styled.button`
  background-color: white;
  border: none;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    opacity: 0.8;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  background-color: green;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(255,255,255,0.2);
  &:hover{
    cursor: pointer;
    opacity: 0.8;
    transform: scale(1.05);
  }
  &:active{
    transform: scale(0.95);
  }
`;

const CancelButton = styled.button`
background-color: tomato;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(255,255,255,0.2);
  &:hover{
    cursor: pointer;
    opacity: 0.8;
    transform: scale(1.05);
  }
  &:active{
    transform: scale(0.95);
  }
`;

const CreatedTime = styled.span`
  position: absolute; 
    bottom: 10px;
    right: 3%;        
    padding: 5px;
    color: rgba(128,128,128,0.7);
    font-size: 14px;
`

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  color: black;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }

  &.confirm {
    background-color: green;
    color: white;
  }

  &.cancel {
    background-color: tomato;
    color: white;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id, createdAt }: ITweet) {
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const onDelete = async () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    if (user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e: any) {
      console.error(e);
      console.log(e);
    }
  };

  const toggleMenu = () => {
    setMenu((curr) => !curr);
  };

  const handleEditTweet = () => {
    setEditMode(true);
    setMenu(false);
  };

  const handleConfirmEdit = async () => {
      if(editedTweet === "" || user?.uid !== userId) return;
      try {
        const newTime = dayjs().valueOf();
        await updateDoc(doc(db, "tweets", id), { tweet: editedTweet, createdAt: newTime });
        setEditMode(false);
      } catch (e:any ){
        console.error(e);
        console.log(e);
      }
  };

  const handleCancelEdit = () => {
    setEditedTweet(tweet); 
    setEditMode(false);
  };

  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = e.target;
    setEditedTweet(value);
  }

  const date = dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss');

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <>
      <Wrapper>
        <Column>
          <MenuButton onClick={toggleMenu}>
            <svg
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </MenuButton>
          {menu && (
            <DropdownMenu ref={menuRef}>
              <DropdownButton onClick={onDelete}>Delete Tweet</DropdownButton>
              <DropdownButton onClick={handleEditTweet}>Edit Tweet</DropdownButton>
              <DropdownButton>Edit Photo</DropdownButton>
            </DropdownMenu>
          )}
          <Username>{username}</Username>
          {editMode ? (
            <>
              <EditInput
                value={editedTweet}
                onChange={onChange}
                rows={5}
              />
              <EditButtons>
                <ConfirmButton onClick={handleConfirmEdit}>Confirm</ConfirmButton>
                <CancelButton onClick={handleCancelEdit}>Cancel</CancelButton>
              </EditButtons>
            </>
          ) : (
            <Payload>{tweet}</Payload>
          )}

          <CreatedTime>Created at {date}</CreatedTime>

        </Column>
        <Column>{photo && <Photo src={photo} />}</Column>
      </Wrapper>

      {showModal && (
        <ModalBackground>
          <ModalBox>
            <p>Are you sure you want to delete this tweet?</p>
            <ModalButton className="confirm" onClick={handleConfirmDelete}>
              Confirm
            </ModalButton>
            <ModalButton className="cancel" onClick={() => setShowModal(false)}>
              Cancel
            </ModalButton>
          </ModalBox>
        </ModalBackground>
      )}
    </>
  );
}
