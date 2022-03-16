import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMobile } from "../context/MobileContext";
import LogoutButton from "./LogoutButton";
import TweetButton from "./TweetButton";
import noProfile from "../styles/assets/noProfile.png"

interface Props {
    name?: string
    avatar?: string
    closeNav?: any
}


function LeftNav({ name, avatar, closeNav }: Props) {
    const history = useHistory()

    const isMobile = useMobile()

    const handleLogout = async () => {
        localStorage.removeItem("token");
        history.push("/login");
    };

    return (
        <div className='leftnav w-100 d-flex flex-column'>
            <div>
                {!isMobile ? (
                    <Link to="/">
                        <img
                            src="https://logos-world.net/wp-content/uploads/2020/04/Twitter-Logo.png"
                            alt="logo"
                            style={{ width: "40px" }}
                            className="mt-3 mb-3"
                        />
                    </Link>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between border-bottom pb-2">
                            <div className="p-23 fw-bold  ps-3 ">
                                Account Info
                            </div>
                            <div className="pe-3" >
                                <i className="fas fa-times" onClick={() => closeNav()}></i>
                            </div>
                        </div>
                        <div>
                            <div className=" py-3 ps-4">
                                <img
                                    className="rounded-circle img-fluid"
                                    alt="100x100"
                                    src={avatar ? avatar : noProfile}
                                    data-holder-rendered="true"
                                    style={{ width: "48px", height: "48px" }}
                                />
                            </div>
                            <div className="fw-bold fs-20 ps-4">
                                {name}
                            </div>
                            <div className=" fw-light fs-16 ps-4 pb-2">
                                @{name}
                            </div>
                            
                                <div className="ms-3 mt-3 mb-4 d-flex">
                                    <div className="d-flex">
                                        <div className="fw-bold me-2">256</div>
                                        <div className="text-secondary">Following</div>
                                    </div>
                                    <div className="d-flex ms-4">
                                        <div className="fw-bold me-2">13000</div>
                                        <div className="text-secondary">Followers</div>
                                    </div>

                            </div>
                        </div>
                    </div>
                )}
                <div className={`${isMobile ? "ps-3" : ""}`}>


                    <div className="onhover">
                        <Link to="/" className="text-decoration-none title-bg">
                            <div className="title d-flex align-items-center">
                                <i className="fa fa-home me-3" aria-hidden="true" />{" "}
                                <span >Home</span>
                            </div >
                        </Link>
                    </div>
                    <div className="onhover">
                        <Link to="/profile" className="text-decoration-none">
                            <div className="title d-flex align-items-center">
                                <i className="fa fa-user me-3" aria-hidden="true" />{" "}
                                <span >Profile</span>
                            </div >
                        </Link>
                    </div>
                    <div className="onhover">
                        <Link to="/" className="text-decoration-none">
                            <div className="title d-flex align-items-center" >
                                <i className="fa fa-envelope me-3" aria-hidden="true" />{" "}
                                <span >Messages</span>
                            </div >
                        </Link>
                    </div>
                    <div className="onhover">
                        <Link to="/" className="text-decoration-none">
                            <div className="title d-flex align-items-center" >
                                <i className="fa fa-bell me-3" aria-hidden="true" />{" "}
                                <span >Notifications</span>
                            </div >
                        </Link>
                    </div>
                    <div className="onhover">
                        <Link to="/" className="text-decoration-none">
                            <div className="title d-flex align-items-center" >
                                <i className="fa fa-ellipsis-h me-3" aria-hidden="true" />{" "}
                                <span >More</span>
                            </div >
                        </Link>
                    </div>
                </div>
                {!isMobile ? (
                    <div className={`mt-5 ${isMobile ? "ps-3" : ""}`}>
                        <TweetButton avatar={avatar} />
                    </div>
                ) : (
                    <div className="border-top">
                        <div className="fs-20 mt-4 ps-3" onClick={handleLogout}>Log out</div>
                    </div>
                )}

            </div>
            {!isMobile ? (
                <div className="mt-5 logout-button">
                    <LogoutButton name={name} avatar={avatar} />
                </div>
            ) : null}

        </div>
    );
}

export default LeftNav;
