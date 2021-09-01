import React from "react";
import logo from "./logo-logomark.svg";
import "./App.css";
import Message from "./Message";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import styled from "styled-components";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWhR_uZ3O9SQkvOFr8HpODsMAs0OunuVE",
  authDomain: "test-web-6676c.firebaseapp.com",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const Button = styled.button`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;
`;

function App() {
  const [authStatus, setAuthStatus] = React.useState("No auth status");

  const signInWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        setAuthStatus("Authorized");
        // ...
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        GoogleAuthProvider.credentialFromError(error);
        console.log(error);
        setAuthStatus(JSON.stringify(error));
        // ...
      });
  };

  const signIn = () => {
    const auth = getAuth();
    signInWithCredential(
      auth,
      EmailAuthProvider.credential("dummy@example.com", "pass123!")
    )
      .then(() => {
        setAuthStatus("Authorized");
      })
      .catch((err) => {
        console.log(err);
        setAuthStatus(JSON.stringify(err));
      });
  };

  const signOut = () => {
    getAuth()
      .signOut()
      .then(() => {
        setAuthStatus("Unauthorized");
      })
      .catch((err) => {
        console.log(err);
        setAuthStatus(JSON.stringify(err));
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Message />
        <p>{authStatus}</p>
        <Button onClick={() => signIn()}>Sign in</Button>
        <Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
        <Button onClick={() => signOut()}>Sign out</Button>
      </header>
    </div>
  );
}

export default App;
