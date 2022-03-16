import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { ME_QUERY } from "../pages/Profile";
import { customStyles } from "../styles/customStyles";
import TweetReply from "./TweetReply";


const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($content: String) {
    createTweet(content: $content) {
      id
    }
  }
`;

interface TweetValues {
    content: string;
}

interface Props{
    avatar:string | undefined
}

export default function Tweet({avatar}:Props) {
    const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
        refetchQueries: [{ query: ME_QUERY }],
    });

    const [modalIsOpen, setIsOpen] = useState(false);

    const initialValues: TweetValues = {
        content: "",
    };

    const validationSchema = Yup.object({
        content: Yup.string()
            .required()
            .min(1, "Must be more than 1 character")
            .max(256, "Must be less than 257 characters"),
    });

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    return (
        <>
            <div className="">
                <button type="button" className="tweet-button" onClick={openModal}>Tweet</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={customStyles}
            >
                <span className="" onClick={closeModal}>
                    <i className="fa fa-times pb-3 pt-3 ps-3" aria-hidden="true"></i>
                </span>
                <div className="border-top pt-3">

                <TweetReply avatar={avatar} btnType={"Tweet"} text={"Whats happening..."} />
                </div>
            </Modal>
        </>
    );
}
