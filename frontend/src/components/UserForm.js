import React, { useState } from "react";
import { createUser } from "../api/userApi";
import styled from "styled-components";
import theme from "../theme";

const FormContainer = styled.div`
  margin-top: 40px;
  padding: 24px;
  border-radius: 12px;
  background-color: ${theme.colors.cardBackground};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${theme.colors.textColor};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.label`
  width: 120px;
  font-weight: bold;
  margin-right: 10px;
  color: ${theme.colors.textColor};

  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 6px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.inputBorder};
  width: 100%;
`;

const Button = styled.button`
  background-color: ${theme.colors.primaryColor};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  width: 150px;
  margin: 20px auto 0;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

function UserForm({ token, onUserCreated }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username,
      email,
      full_name: fullName,
      password,
    };

    try {
      await createUser(newUser, token);
      alert("User created successfully!");
      setUsername("");
      setEmail("");
      setFullName("");
      setPassword("");
      onUserCreated();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.detail) {
        alert("Error: " + error.response.data.detail);
      } else {
        alert("Error creating user.");
      }
    }
  };

  return (
    <FormContainer>
      <Title>Create New User</Title>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Username:</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Please Enter Username"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email:</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Please Enter Email"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Full Name:</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Please Enter Name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please Enter Password"
            required
          />
        </FormGroup>

        <Button type="submit">Create</Button>
      </StyledForm>
    </FormContainer>
  );
}

export default UserForm;
