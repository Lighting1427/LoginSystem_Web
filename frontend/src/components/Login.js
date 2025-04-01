import React, { useState } from "react";
import { login } from "../api/userApi";
import theme from "../theme";
import styled from "styled-components";

const LoginContainer = styled.div`
  background-color: ${theme.colors.background};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${theme.colors.textColor};
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.inputBorder};
  width: 100%;
`;

const Button = styled.button`
  background-color: ${theme.colors.primaryColor};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  width: 60%;
  font-size: 16px;
  cursor: pointer;
  margin: 0 auto;
  display: block;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  width: 90px;
  font-weight: bold;
  color: ${theme.colors.textColor};
`;

const StyledInput = styled(Input)`
  flex: 1;
`;

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      onLoginSuccess(data.access_token);
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login Page</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Username:</Label>
            <StyledInput
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password:</Label>
            <StyledInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <Button type="submit">Login</Button>
        </form>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
