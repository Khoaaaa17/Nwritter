import { useState } from "react";
import styled from "styled-components";
import { ITweet } from "../routes/timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.5);
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

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

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

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);

  const onDelete = async () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false); // Close the modal
    if (user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          {user?.uid === userId && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
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