import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/userApi";
import styled from "styled-components";
import theme from "../theme";

const Container = styled.div`
  max-width: 960px;
  margin: 30px auto;
  padding: 20px;
  background-color: ${theme.colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  input {
    width: 80%;
    max-width: 400px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid ${theme.colors.inputBorder};
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.dddColor};
  }

  tr:hover {
    background-color: ${theme.colors.f9f9f9Color};
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 15px;
      border: 1px solid ${theme.colors.inputBorder};
      border-radius: 8px;
      padding: 12px;
      background-color: ${theme.colors.cardBackground};
    }

    td {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: none;
      position: relative;
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
      color: ${theme.colors.textColor};
    }
  }
`;

const EditButton = styled.button`
  background-color: ${theme.colors.orangeColor};
  color: #000;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: ${theme.colors.darkorangeColor};
  }
`;

const DeleteButton = styled.button`
  background-color: ${theme.colors.primaryColor};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

function UserList({ token, refresh, onEdit }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id, token);
        fetchUsers();
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          alert("Unauthorized! Please login again.");
        }
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container>
      <h2 style={{ textAlign: "center", color: theme.colors.textColor }}>
        User List
      </h2>

      <SearchContainer>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      <StyledTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Username">{user.username}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Full Name">{user.full_name}</td>
              <td data-label="Actions">
                <EditButton onClick={() => onEdit(user.id)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(user.id)}>
                  Delete
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
}

export default UserList;
