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
              var response = null;
              try{
                response = await signup({
                  variables: values,
                });
                
              } catch(error){
                let myContainer: HTMLDivElement | null = document.querySelector("#ifErrorSignup");
                if (myContainer instanceof HTMLDivElement) {
                  myContainer.innerHTML = `* ${error} `;
                }
                return;
              }
              localStorage.setItem("token", response && response.data.signup.token);
              setSubmitting(false);
              history.push("/");
            }}
          >
            <div className="mx-3">
            <Form>
              <label className="ms-4 fw-semi-bold">Email</label>
              <Field name="email" type="text" placeholder="Email" autocomplete="off" className=" mt-1  mx-3" />
              <ErrorMessage name="email" component={"div"} className="text-danger ms-4 mt-1 " />

              <label className="ms-4 mt-3 fw-semi-bold">Name</label>
              <Field name="name" autocomplete="off" type="text" placeholder="Name" className="mt-1  mx-3" />
              <ErrorMessage name="name" component={"div"} className="text-danger ms-4 mt-1 " />

              <label className="ms-4 mt-3 fw-semi-bold">Password</label>
              <Field name="password" type="password" placeholder="Password" className="mt-1 mx-3" />
              <ErrorMessage name="password" component={"div"} className="text-danger ms-4 mt-1" />

              <label className="ms-4 mt-3 fw-semi-bold">Confirm Password</label>
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="mt-1  mx-3"
              />
              <ErrorMessage name="confirmPassword" component={"div"} className="text-danger ms-4 mt-1" />
              <button type="submit" className="mt-2 tweet-button mt-4  mx-3">
                <span>Sign up</span>
              </button>
              <div id="ifErrorSignup" className="text-danger fs-20 ms-4 mt-1"></div>
            </Form>
            </div>
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
