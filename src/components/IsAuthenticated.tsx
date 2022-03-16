import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";

const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`;

interface Props {
  children?: React.ReactNode;
}

function IsAuthenticated({ children }: Props) {
  

  var token  = localStorage.getItem("token")

  if (!token) {
    return <Redirect to={{ pathname: "/login" }} />;
  }
  return <>{children}</>;
}

export default IsAuthenticated;
