
import react, { createContext, useEffect, useState } from "react";
import "./App.css";
import IsAuthenticated from "./components/IsAuthenticated";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SingleUser from "./pages/SingleUser";



import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setContext } from "apollo-link-context";
import Home from "./pages/Home";
import SingleTweet from "./pages/SingleTweet";
import { MobileProvider } from "./context/MobileContext";


const httpLink = new HttpLink({ uri: process.env.REACT_APP_URI });
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});


function App() {
  

  return (
    <ApolloProvider client={client}>
      <MobileProvider>
      <Router>
        <Switch>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <IsAuthenticated>
            <Route exact path="/user/:id">
              <SingleUser />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/tweet/:id">
              <SingleTweet />
            </Route>
            <Route exact path='/'>
              <Home/>
            </Route>
          </IsAuthenticated>
        </Switch>
      </Router>
      </MobileProvider>
    </ApolloProvider>
  );
}

export default App;
