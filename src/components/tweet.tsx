import { useEffect, useRef, useState } from "react";
import { ITweet } from "../routes/timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import dayjs from "dayjs";
import { CancelButton, Column, ConfirmButton, CreatedTime, DropdownButton, DropdownMenu, EditButtons, EditInput, MenuButton, ModalBackground, ModalBox, ModalButton, Payload, Photo, Username, Wrapper } from "./tweet-components";



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
