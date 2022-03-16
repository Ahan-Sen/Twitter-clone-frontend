import { useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { ME_QUERY } from "../pages/Profile";
import { customStyles, customStylesMobile } from "../styles/customStyles";
import noProfile from "../styles/assets/noProfile.png"
import { useMobile } from "../context/MobileContext";


const CREATE_PROFILE_MUTATION = gql`
  mutation createProfile(
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    createProfile(
      bio: $bio
      location: $location
      website: $website
      avatar: $avatar
    ) {
      id
    }
  }
`;

interface ProfileValues {
  bio: string;
  location: string;
  website: string;
  avatar: string;
}

function CreateProfile() {
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const isMobile = useMobile()

  const [modalIsOpon, setIsOpen] = useState(false);
  const inputFile: any = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const initialValues: ProfileValues = {
    bio: "",
    location: "",
    website: "",
    avatar: "",
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files ? files[0] : "null");
    data.append("upload_preset", "darwin");
    setImageLoading(true);

    const configValue : string | undefined  =process.env.REACT_APP_CLOUDINARY_ENDPOINT

    const res = await fetch(
      `${configValue}`,
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setImage(file.secure_url);
    setImageLoading(false);
  };


  return (
    <div>
      <button onClick={openModal} className="unfollow-button">
        Set Up Profile
      </button>
      <Modal
        isOpen={modalIsOpon}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={isMobile ? customStylesMobile : customStyles}
      >
        <span className="" onClick={closeModal}>
          <i className="fa fa-times pb-3 pt-3 ps-3" aria-hidden="true"></i>
        </span>
        <div className="border-top pt-3">
        <input
            type="file"
            name="file"
            placeholder="Upload an image"
            onChange={uploadImage}
            ref={inputFile}
            style={{ display: "none" }}
          />
          {imageLoading ? (
            <h3>Loading...</h3>
          ) : (
            <div className="d-flex align-items-center">
              <div className="col-7">
                {image ? (
                  <span onClick={() => inputFile.current.click()}>
                    <img
                      src={image}
                      className="m-3"
                      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                      alt="avatar"
                      onClick={() => inputFile.current.click()}
                    />
                  </span>
                ) : (
                  <img
                    src={noProfile}
                    className="m-3"
                    style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                    alt="avatar"
                    onClick={() => inputFile.current.click()}
                  />
                )}
              </div>
              <div className="col-5">
                <div className="d-flex align-items-center">
                  <button className="unfollow-button" onClick={() => inputFile.current.click()}>Select Avatar</button>
                </div>
              </div>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              await createProfile({
                variables: { ...values, avatar: image }
              });

              setSubmitting(false);
              setIsOpen(false);
            }}
          >
            <Form>
              <Field name="bio" type="text" placeholder="Bio" className="m-3" autocomplete="off" />
              <ErrorMessage name="bio" component={"div"} />
              <Field name="location" type="location" placeholder="Location" className="m-3" autocomplete="off" />
              <ErrorMessage name="location" component={"div"} />

              <button type="submit" className="tweet-button m-3">
                <span>Set Up Profile</span>
              </button>
            </Form>
          </Formik>
        </div>
      </Modal>
    </div>
  );
}





export default CreateProfile;
