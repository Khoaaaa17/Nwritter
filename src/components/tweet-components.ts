import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  margin-bottom: 5px;
`;

export const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

export const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

export const EditInput = styled.textarea`
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

export const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

export const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-right: 25px;
  margin-bottom: 5px;
`;

export const MenuButton = styled.span`
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

export const DropdownMenu = styled.div`
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

export const DropdownButton = styled.button`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.5);
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
  &:last-child{
    border: none;
  }
`;

export const EditButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const ConfirmButton = styled.button`
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

export const CancelButton = styled.button`
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

export const CreatedTime = styled.span`
  position: absolute; 
    bottom: 0px;
    right: 3%;        
    padding: 5px;
    color: rgba(128,128,128,0.7);
    font-size: 14px;
`

export const ModalBackground = styled.div`
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

export const ModalBox = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  color: black;
`;

export const ModalButton = styled.button`
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