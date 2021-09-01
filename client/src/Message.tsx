import React from "react";
import axios from "axios";
import styled from "styled-components";
import { getAuth, User } from "firebase/auth";

const Button = styled.button`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;
`;

export default function Message() {
  const [response, setResponse] = React.useState("No data yet...");
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const client = axios.create({
    baseURL: "http://localhost:3000",
  });

  const sendRequest = () => {
    if (getAuth().currentUser) {
      getAuth()
        .currentUser?.getIdToken(true)
        .then((idToken) => {
          client({
            method: "get",
            url: "/",
            headers: {
              AuthToken: idToken,
            },
          })
            .then((res) => {
              setResponse(res.data.message);
            })
            .catch((error) => {
              setResponse(JSON.stringify(error));
            });
        })
        .catch((error) => {
          setResponse("Error getting auth token");
        });
    } else {
      client({
        method: "get",
        url: "/",
      })
        .then((res) => {
          setResponse(res.data.message);
        })
        .catch((error) => {
          setResponse(JSON.stringify(error));
        });
    }
  };

  getAuth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  const requestButton = currentUser ? (
    <Button onClick={() => sendRequest()}>Send Request</Button>
  ) : (
    <></>
  );

  return (
    <div>
      <div>{response}</div>
      <div>{requestButton}</div>
    </div>
  );
}
