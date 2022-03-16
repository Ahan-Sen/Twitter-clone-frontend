import { gql, useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import TwitterLogo from "../styles/assets/twitterLogo.png";
import TwitterLogoLogin from "../styles/assets/Twitter-login-logo.jpg";
import "../styles/login.css";
import { useMobile } from "../context/MobileContext";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}

function Login() {
  const history = useHistory();
  const isMobile = useMobile()
  const [login, { data }] = useMutation(LOGIN_MUTATION);

  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email Required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password Required"),
  });

  return (
    
      <div className="d-flex">
        {!isMobile?(
        <div className="col-md-7">
          <img src={TwitterLogoLogin} className="w-100 h-100"  />
        </div>
        ):<div></div>}
        <div className="col-12 col-md-5 mt-5">
          <img src={TwitterLogo} className="ms-4 mb-3" style={{width:"3rem"}} alt="twitter-logo"></img> 
          <h1 className="ps-4" style={{fontSize:"4rem",fontFamily:"inherit",fontWeight:"750"}}>Happening now</h1>
          <h1 className=" ps-4 mt-5" style={{fontSize:"2rem",fontFamily:"inherit",fontWeight:"750"}}>join Twitter today.</h1>
          <div className="mt-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const response = await login({
                variables: values,
              });
              localStorage.setItem("token", response.data.login.token);
              setSubmitting(false);
              history.push("/");
            }}
          >
            <Form>
              <Field name="email" type="text" placeholder="Email" autocomplete="off" className="m-3" />
              <ErrorMessage name="email" component={"div"} />

              <Field name="password" type="password" placeholder="Password" className="m-3" />
              <ErrorMessage name="password" component={"div"} />

              <button type="submit" className="tweet-button m-3">
                <span>Login</span>
              </button>
            </Form>
          </Formik>
          <div className="register mt-5">
            <h4 className="">Don't have an account?</h4>
            <Link to="/signup">Sign up</Link>
          </div>
          </div>
        </div>
        
      </div>
  );
}

export default Login;
