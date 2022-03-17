import React, { useRef, useState } from "react";
import CreateComment from "../components/CreateComment";
import DeleteLike from "../components/DeleteLike";
import LikeTweet from "../components/LikeTweet";
import { formatDistance } from "date-fns";
import { subDays } from "date-fns/esm";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../pages/Profile";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
import noProfile from "../styles/assets/noProfile.png"
import Modal from "react-modal";
import { logoutModalStyles } from "../styles/LogoutModal";
import { useOnClickOutside } from "../Hooks/useOnClickOutside";
import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { TWEETS_QUERY } from "./AllTweets"

interface LikedTweets {
    id: number;
    tweet: {
        id: number;
    };
}

function Tweet({ tweet }: any) {
    const history = useHistory()

    const DELETE_TWEET_MUTATION = gql`
	mutation deleteTweet($id: Int!) {
		deleteTweet(id: $id) {
			id
		}
	} 
`
    const [ deleteTweet ] = useMutation(DELETE_TWEET_MUTATION, {
        refetchQueries: [ { query: TWEETS_QUERY }, { query: ME_QUERY } ]
    })

    const handleDeleteTweet = async (id: any) => {
        await deleteTweet({
            variables: { id }
        })
    }

    const {
        loading: meLoading,
        error: meError,
        data: meData,
    } = useQuery(ME_QUERY);

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const ref:any = useRef();
    useOnClickOutside(ref, () => setIsOpen(false));

    if (meLoading) return <p>Loading...</p>;
    if (meError) return <p>{meError.message}</p>;


    return (
        tweet ? (

            <div key={tweet.id} className="d-flex border border-top-0 ">
                <div className="col-2 pt-2 d-flex justify-content-center">
                    <img
                        className="rounded-circle img-fluid"
                        alt="100x100"
                        src={tweet && tweet.author.profile?.avatar ? tweet.author.profile.avatar : noProfile}
                        data-holder-rendered="true"
                        style={{ width: "48px", height: "48px" }}
                    />
                </div>
                <div className="d-flex flex-column pt-2 w-100 ">
                    <div className="d-flex justify-content-between ">
                        <div className="d-flex ">
                            <div className="fw-bold" style={{cursor:"pointer"}} onClick={() => history.push(`/user/${tweet && tweet.author.id}`)}>{tweet && tweet.author.name}</div>
                            <div className="text-secondary ms-2" style={{cursor:"pointer"}} onClick={() => history.push(`/user/${tweet && tweet.author.id}`)}>@{tweet && tweet.author.name}</div>
                            <div className="mx-2 text-secondary"> . </div>
                            <div className="text-secondary"  style={{ fontSize: "15px" , cursor:"default"}}>
                                {formatDistance(
                                    subDays(new Date(tweet && tweet.createdAt), 0),
                                    new Date()
                                )}{" "}
                                ago
                            </div>
                        </div>
                        <div className="flex-start me-3 position-relative">
                        {tweet.author.id == meData.me.id ?(
                            <div className=" d-flex user-select-none" onClick={openModal}>
                                <div>&#8226;</div>
                                <div>&#8226;</div>
                                <div>&#8226;</div>
                            </div>) : (<div></div>)}
                            {modalIsOpen? (
                            <div ref={ref} className="shadow p-3 bg-body rounded " style={{position:"absolute" , top:"2px",right:"-7px"}}>
                                <div onClick={()=>handleDeleteTweet(tweet.id)} className="d-flex align-items-center " style={{width:"12rem",background:"white" , cursor:"pointer"}}>
                                    <i className="fas fa-trash-alt text-danger"></i>
                                    <div className="fs-17 fw-normal ms-2 text-danger ">Delete</div>
                                </div>
                            </div>
                            ):(<div></div>)}
                        </div>
                    </div>
                    <Link to={`/tweet/${tweet && tweet.id}`} style={{ textDecoration: "none", color: "black" }}>
                        <div className="">
                            {tweet && tweet.content}
                        </div>
                    </Link>
                    <div className="col-10 mt-3  mb-3 text-secondary">

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                {tweet && (

                                    <><CreateComment
                                        tweetAvatar={tweet.author.profile?.avatar}
                                        name={tweet.author.name}
                                        tweet={tweet.content}
                                        id={tweet.id}
                                        autId={tweet.author.id}
                                        createdAt={tweet.createdAt}
                                        avatar={meData.me.profile?.avatar} /><div className="ps-2 fs-13">
                                            {tweet.comments.length > 0 ? tweet.comments.length : null}
                                        </div></>
                                )}
                            </div>
                            <div className="d-flex">
                                <i className="fas fa-retweet"></i>
                                <div></div>
                            </div>
                            {meData.me && meData.me.likedTweet && meData.me.likedTweet.map((t: LikedTweets) => t.tweet.id).includes(tweet.id) ? (
                                <div className="d-flex align-items-center">
                                    <DeleteLike
                                        id={
                                            meData.me.likedTweet.filter(
                                                (like: LikedTweets) => like.tweet.id === tweet.id
                                            )[0].id
                                        }
                                    />
                                    <div className="fs-13">
                                        {tweet.likes.length}
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <LikeTweet id={tweet && tweet.id} />
                                    <div className="fs-13">
                                        {tweet && tweet.likes.length}
                                    </div>
                                </div>
                            )}
                            <div className="d-flex">
                                <i className="far fa-share-square"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        ) : (<div>No tweets Available</div>)

    );
}

export default Tweet;
