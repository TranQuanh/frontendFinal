import React, { useEffect, useState } from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/list`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem button component={Link} to={`/users/${user._id}`}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
