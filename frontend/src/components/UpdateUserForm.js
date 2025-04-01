import React, { useEffect, useState } from "react";
import { getUserById, updateUser } from "../api/userApi";
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

function UpdateUserForm({ userId, token, onUpdated, onCancel }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserById(userId, token);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setFullName(data.full_name || "");
      } catch (error) {
        console.error(error);
      }
    };
    loadUser();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userUpdate = {
      email,
      full_name: fullName,
    };

    if (password.trim()) {
      userUpdate.password = password;
    }

    try {
      await updateUser(userId, userUpdate, token);
      alert("User updated successfully!");
      onUpdated();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.detail) {
        alert("Error: " + error.response.data.detail);
      } else {
        alert("Error updating user.");
      }
    }
  };

  return (
    <FormContainer>
      <Title>Edit User (ID: {userId})</Title>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Username:</Label>
          <Input value={username} disabled />
        </FormGroup>

        <FormGroup>
          <Label>Email:</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Full Name:</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Password:</Label>
          <Input
            type="password"
            placeholder="Leave blank if no change"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button type="submit">Update</Button>
          <Button
            type="button"
            style={{ backgroundColor: "gray" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </StyledForm>
    </FormContainer>
  );
}

export default UpdateUserForm;
