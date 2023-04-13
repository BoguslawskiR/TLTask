import { UsersResponse, ViewUser } from "@/types/user";
import graphQlFetch from "@/utils/graphQlFetch";
import { Person } from "@mui/icons-material";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UsersList() {
  const router = useRouter();
  const [users, setUsers] = useState<ViewUser[]>([]);

  // TODO: Once it would be unsecured call move it to NextJS handling with getServerSideProps
  useEffect(() => {
    // TODO: Implement pagination with using endpoint to get total amount of 
    // users and keep state of page in separated useState to pass it to below query
    graphQlFetch<UsersResponse>(
      `query GetUsers {
        users(page: 1, pageSize: 10) {
          email
          firstName
          lastName
        }
      }`,
    ).then((response) => {
      setUsers(response.data.users);
    }).catch(e => {
      // TODO: Move 401 handling with some interceptor. Ideally with refreshing token after expiration time.
      router.replace('/login');
    });
  }, []);

  // TODO: Add loading state
  return <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
    {users.map((user) =>
      <ListItem key={user.email}>
        <ListItemAvatar>
          <Avatar>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.email} secondary={`${user.firstName} ${user.lastName}`} />
      </ListItem>
    )}
  </List>
};