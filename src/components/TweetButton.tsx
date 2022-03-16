import gql from "graphql-tag";
import React, { useState } from "react";
import Modal from "react-modal";
import { customStyles } from "../styles/customStyles";
import TweetReply from "./TweetReply";


const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($content: String) {
    createTweet(content: $content) {
      id
    }
  }
`;



interface Props{
    avatar:string | undefined
}

export default function Tweet({avatar}:Props) {

    const [modalIsOpen, setIsOpen] = useState(false);

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

                <TweetReply avatar={avatar} btnType={"Tweet"} text={"Whats happening..."} closeModal={closeModal} />
                </div>
            </Modal>
        </>
    );
}
