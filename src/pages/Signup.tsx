import { gql, useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import TwitterLogo from "../styles/assets/twitterLogo.png";
import "../styles/login.css";
import TwitterLogoLogin from "../styles/assets/Twitter-login-logo.jpg";
import { useMobile } from "../context/MobileContext";


const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

function Signup() {
  const history = useHistory();
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);
  const isMobile = useMobile()

  const initialValues: SignupValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email Required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password Required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
    name: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Name Required"),
  });

  return (
    <div className="d-flex" >
      {!isMobile ? (
        <div className="col-md-7">
          <img src={TwitterLogoLogin} className="w-100 h-100" />
        </div>
      ) : <div></div>}
      <div className="col-12 col-md-5 mt-5 ml-4">
        <img src={TwitterLogo} className="ms-4 mb-3" style={{ width: "3rem" }} alt="twitter-logo"></img>
        <h1 className="ps-4" style={{ fontSize: "4rem", fontFamily: "inherit", fontWeight: "750" }}>Happening now</h1>
        <h1 className=" ps-4 mt-5" style={{ fontSize: "2rem", fontFamily: "inherit", fontWeight: "750" }}>join Twitter today.</h1>
        <div className="mt-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const response = await signup({
                variables: values,
              });
              localStorage.setItem("token", response.data.signup.token);
              setSubmitting(false);
              history.push("/");
            }}
          >
            <Form>
              <Field name="email" type="text" placeholder="Email" autocomplete="off" className="m-3" />
              <ErrorMessage name="email" component={"div"} />
              <Field name="name" autocomplete="off" type="text" placeholder="Name" className="m-3" />
              <ErrorMessage name="name" component={"div"} />
              <Field name="password" type="password" placeholder="Password" className="m-3" />
              <ErrorMessage name="password" component={"div"} />
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="m-3"
              />
              <ErrorMessage name="confirmPassword" component={"div"} />
              <button type="submit" className="mt-2 tweet-button m-3">
                <span>Sign up</span>
              </button>
            </Form>
          </Formik>
          <div className="register mb-5">
            <h4 className="mt-3">Already have an account?</h4>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Signup;
