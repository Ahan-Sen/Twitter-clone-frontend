import React, { useState } from "react";
import { useHistory } from "react-router";
import noProfile from "../styles/assets/noProfile.png"
import Modal from "react-modal";
import { logoutModalStyles } from "../styles/LogoutModal";
import {Redirect} from "react-router-dom";

interface Props {
    name?: string
    avatar?: string
}

function LogoutButton({ name, avatar }: Props) {
    const history = useHistory()
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
      };
    
      const closeModal = () => {
        setIsOpen(false);
      };
    
      const handleLogout = () => {
        localStorage.removeItem("token");
        history.go(0);
      };
    

    return (
        <div className="d-flex justify-content-between p-2 ">
            <div className="d-flex">
                <div>
                    <img
                        className="rounded-circle img-fluid"
                        alt="100x100"
                        src={avatar ? avatar : noProfile}
                        data-holder-rendered="true"
                        style={{ width: "48px", height: "48px" }}
                    />
                </div>
                <div className="d-flex flex-column ms-3 user-select-none">
                    <div className="fw-bold">
                        {name}
                    </div>
                    <div className="fw-light user-select-none">
                        @{name}
                    </div>
                </div>
            </div>
            <div className="mt-3 d-flex user-select-none" onClick={openModal}>
                <div>&#8226;</div>
                <div>&#8226;</div>
                <div>&#8226;</div>
            </div>
            <div style={{ position: "absolute", bottom: 0 }}>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Modal"
                    style={logoutModalStyles}
                >
                    <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <p style={{ borderBottom: "1px solid black" }}>
                            Log out @{name}
                        </p>
                    </span>
                </Modal>
            </div>
        </div>
    );
}

export default LogoutButton;
