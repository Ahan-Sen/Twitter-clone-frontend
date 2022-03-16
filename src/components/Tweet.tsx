import React from "react";
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

interface LikedTweets {
    id: number;
    tweet: {
        id: number;
    };
}

function Tweet({ tweet }: any) {
    const history = useHistory()

    const {
        loading: meLoading,
        error: meError,
        data: meData,
    } = useQuery(ME_QUERY);

    if (meLoading) return <p>Loading...</p>;
    if (meError) return <p>{meError.message}</p>;

    return (
        tweet?(

        <div  key={tweet.id}  className="d-flex border border-top-0 ">
            <div className="col-2 pt-2 d-flex justify-content-center">
                <img
                    className="rounded-circle img-fluid"
                    alt="100x100"
                    src={tweet && tweet.author.profile?.avatar ? tweet.author.profile.avatar : noProfile}
                    data-holder-rendered="true"
                    style={{ width: "48px", height: "48px" }}
                />
            </div>
            <div className="d-flex flex-column pt-2 w-100">
                <div className="d-flex ">
                    <div className="fw-bold" onClick={() => history.push(`/user/${tweet && tweet.author.id}`)}>{tweet && tweet.author.name}</div>
                    <div className="text-secondary ms-2" onClick={() => history.push(`/user/${tweet && tweet.author.id}`)}>@{tweet && tweet.author.name}</div>
                    <div className="mx-2 text-secondary"> . </div>
                    <div className="text-secondary" style={{ fontSize: "15px" }}>
                        {formatDistance(
                            subDays(new Date(tweet && tweet.createdAt), 0),
                            new Date()
                        )}{" "}
                        ago
                    </div>
                </div>
                <Link to={`/tweet/${tweet &&tweet.id}`} style={{ textDecoration: "none", color: "black" }}>
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
                                <LikeTweet id={tweet &&tweet.id} />
                                <div className="fs-13">
                                    {tweet &&tweet.likes.length}
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
        ):(<div>No tweets Available</div>)

    );
}

export default Tweet;
