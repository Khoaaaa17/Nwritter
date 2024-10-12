import styled from "styled-components";

export const Wrapper = styled.div`
    height: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;
`;

export const Title = styled.h1`
    font-size: 42px;

`;

export const Form = styled.form`
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    font-size: 16px;
    &[type="submit"]{
        cursor: pointer;
        background-color: #1d9bf0;
        color: white;
        &:hover{
            opacity: 0.9;
        }
    }

`;

export const Error = styled.span`
    font-weight:600;
    color: crimson;
`;

export const Success = styled.span`
    font-weight: 600;
    color: green;
`

export const Switcher = styled.span`
    margin-top: 10px;
    margin-bottom:30px;
    a {
        color: #1d9bf0;

    }
`;

export const ForgotPassword = styled.span` 
border: 1px solid rgba(255, 255, 255, 0.3);
font-weight: 500;
padding: 10px 9rem;
border-radius: 50px;
background-color: black;
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
`;

export const Note = styled.p`
    font-size: 14px; 
    font-weight: 400; 
    color: rgba(255, 255, 255, 0.6); 
    margin-top: 8px;
    text-align: center; 
    line-height: 1.5; 
`;