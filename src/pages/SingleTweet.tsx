import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import PopularTweets from "../components/PopularTweets";
import { formatDistance } from "date-fns";
import { subDays } from "date-fns/esm";
import moment from 'moment'
import LikeTweet from "../components/LikeTweet";
import DeleteLike from "../components/DeleteLike";
import CreateComment from "../components/CreateComment";
import { ME_QUERY } from "./Profile";
import TweetReply from "../components/TweetReply";
import noProfile from "../styles/assets/noProfile.png"
import TopNameComponent from "../components/TopNameComponent";
import { useMobile } from "../context/MobileContext";
import { useOnClickOutside } from "../Hooks/useOnClickOutside";
import { TWEETS_QUERY } from "../components/AllTweets";

interface LikedTweets {
  id: number;
  tweet: {
    id: number;
  };
}

export const TWEET_QUERY = gql`
  query tweet($id: Int) {
    tweet(id: $id) {
      id
      content
      createdAt
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
      likes {
        id
      }
      comments {
        id
        content
        createdAt
        User {
          id
          name
          profile {
            id
            avatar
          }
        }
      }
    }
  }
`;

interface ParamType {
  id: string;
}
interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  User: {
    id: number;
    name: string;
    profile: {
      id: number;
      avatar: any;
    };
  };
}


const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($id: Int!) {
  deleteComment(id: $id) {
    id
  }
} 
`
const DELETE_TWEET_MUTATION = gql`
mutation deleteTweet($id: Int!) {
  deleteTweet(id: $id) {
    id
  }
} 
`

function SingleTweet() {

  const { id } = useParams<ParamType>();





  const isMobile = useMobile()
  const history = useHistory();

  const { loading, error, data } = useQuery(TWEET_QUERY, {
    variables: { id: parseInt(id) },
  });

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME_QUERY);



  const [modalIsOpen, setIsOpen] = useState(false);
  const [tweetModalIsOpen, setTweetIsOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Number | null>(null)

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


  const [deleteTweet] = useMutation(DELETE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: ME_QUERY }]

  })

  const handleDeleteTweet = async (id: any) => {
    await deleteTweet({
      variables: { id }
    })
    history.push("/")
  }

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }, { query: TWEET_QUERY, variables: { id: parseInt(id) } }]
  })

  const handleDeleteComment = async (commentid: any) => {

    await deleteComment({
      variables: { id: commentid }
    })

    closeModal()
  }

  const ref: any = useRef();
  const Tweetref: any = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));
  useOnClickOutside(Tweetref, () => setTweetIsOpen(false));



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (meLoading) return <p>Loading...</p>;
  if (meError) return <p>{meError.message}</p>;

  console.log(data);


  return (
    <>
      <div className="d-flex ">
        {!isMobile ? (
          <div className="col-lg-3 ps-5 pe-5">
            <LeftNav name={meData.me.name} avatar={meData.me.profile?.avatar} />
          </div>
        ) : null}
        <div className=" col-12 col-lg-6" style={{ height: "100vh", overflowY: "auto" }}>
          <div className="">
            <div className="border border-bottom-0 ps-3">
              <TopNameComponent name={"Tweet"} avatar={meData.me.profile?.avatar} />
            </div>
            <div className="border">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="pt-2 d-flex">
                    <img
                      className="rounded-circle img-fluid mx-3 me-5"
                      alt="100x100"
                      src={data?.tweet?.author?.profile?.avatar ? data.tweet.author.profile.avatar : noProfile}
                      data-holder-rendered="true"
                      style={{ width: "48px", height: "48px" }}
                    />
                  </div>
                  <div style={{cursor:"pointer"}} onClick={()=>history.push(`/user/${data.tweet.author.id}`)} className="d-flex flex-column pt-2 w-100 ps-2">
                    <div className="fw-bold fs-15">{data.tweet.author.name}</div>
                    <div className="text-secondary fs-15">@{data.tweet.author.name}</div>
                  </div>
                </div>
                <div className="flex-start me-3 position-relative">
                  {data.tweet.author.id == meData.me.id ? (
                    <div className=" d-flex user-select-none" onClick={() => setTweetIsOpen(true)}>
                      <div>&#8226;</div>
                      <div>&#8226;</div>
                      <div>&#8226;</div>
                    </div>) : (<div></div>)}
                  {tweetModalIsOpen ? (
                    <div ref={Tweetref} className="shadow p-3 bg-body rounded  " style={{ position: "absolute", top: "2px", right: "-7px" }}>
                      <div onClick={() => handleDeleteTweet(data.tweet.id)} className="d-flex align-items-center " style={{ width: "12rem", background: "white", cursor: "pointer" }}>
                        <i className="fas fa-trash-alt text-danger"></i>
                        <div className="fs-17 fw-normal ms-2 text-danger ">Delete</div>
                      </div>
                    </div>
                  ) : (<div></div>)}
                </div>

              </div>
              <div className="ms-3 mt-3 fs-23">
                {data.tweet.content}
              </div>
              <div className='fs-15 text-secondary ms-3 py-3'>
                {moment(data.tweet.createdAt).format('h:mm A . MMM DD, YYYY')}
              </div>
            </div>
          </div>
          <div className="border border-top-0">
            <div className=" py-3 ms-3">
              <div className="fs-15 d-flex">
                <div className="fw-bold">
                  {data.tweet.likes.length}
                </div>
                <div className="ms-2">Likes</div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2 px-5 border-bottom">
            <div className="d-flex align-items-center">
              <CreateComment
                tweetAvatar={data.tweet.author.profile?.avatar}
                name={data.tweet.author.name}
                tweet={data.tweet.content}
                id={data.tweet.id}
                autId={data.tweet.author.id}
                createdAt={data.tweet.createdAt}
                avatar={meData.me.profile?.avatar}
              />
              <div className="ps-2 fs-13">
                {data.tweet.comments.length > 0 ? data.tweet.comments.length : null}
              </div>
            </div>
            <div className="d-flex">
              <i className="fas fa-retweet"></i>
              <div></div>
            </div>
            {meData.me && meData.me.likedTweet && meData.me.likedTweet.map((t: LikedTweets) => t.tweet.id).includes(data.tweet.id) ? (
              <div className="d-flex align-items-center">
                <DeleteLike
                  id={
                    meData.me.likedTweet.filter(
                      (like: LikedTweets) => like.tweet.id === data.tweet.id
                    )[0].id
                  }
                />
                <div className="fs-13">
                  {data.tweet.likes.length}
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <LikeTweet id={data.tweet.id} />
                <div className="fs-13">
                  {data.tweet.likes.length}
                </div>
              </div>
            )}
            <div className="d-flex">
              <i className="far fa-share-square"></i>
            </div>
          </div>
          <div className="border-bottom py-3">
            <TweetReply avatar={meData.me.profile?.avatar} text={"Tweet Your Reply"} id={data.tweet.id} btnType={"Reply"} />
          </div>
          <div className="mb-3">
            {data.tweet.comments.length > 0 ? (data.tweet.comments.map((comment: CommentType) => (
              <div className="d-flex py-3 border border-top-0">
                <div className="col-md-2 pt-2 d-flex justify-content-center ps-2">
                  <img
                    className="rounded-circle img-fluid"
                    alt="100x100"
                    src={comment.User.profile?.avatar ? comment.User.profile.avatar : noProfile}
                    data-holder-rendered="true"
                    style={{ width: "48px", height: "48px" }}
                  />
                </div>
                <div className="d-flex flex-column pt-2 w-100">
                  <div className="d-flex justify-content-between">

                    <div style={{cursor:"default"}} className="d-flex ps-2 ">
                      <div onClick={()=>history.push(`/user/${comment.User.id}`)} className="fw-bold" >{comment.User.name}</div>
                      <div className="text-secondary ms-2">@{comment.User.name}</div>
                      <div className="mx-2 text-secondary"> . </div>
                      <div className="text-secondary" style={{ fontSize: "15px" }}>
                        {formatDistance(
                          subDays(new Date(comment.createdAt), 0),
                          new Date()
                        )}{" "}
                        ago
                      </div>
                    </div>
                    <div className="flex-start me-3 position-relative">
                      {comment.User.id == meData.me.id ? (
                        <div className=" d-flex user-select-none"
                          //  onClick={openModal}
                          onClick={() => { openModal(); setSelectedComment(comment.id); }}
                        >
                          <div>&#8226;</div>
                          <div>&#8226;</div>
                          <div>&#8226;</div>
                        </div>) : (<div></div>)}
                      {modalIsOpen && selectedComment == comment.id ? (

                        <div ref={ref} className="shadow p-3 bg-body rounded delete-modal" style={{ position: "absolute", top: "2px", right: "-7px" }}>
                          <div onClick={() => handleDeleteComment(comment.id)} className="d-flex align-items-center " style={{ width: "12rem", background: "white", cursor: "pointer" }}>
                            <i className="fas fa-trash-alt text-danger"></i>
                            <div className="fs-17 fw-normal ms-2 text-danger ">Delete</div>
                          </div>
                        </div>
                      ) : (<div></div>)}
                    </div>
                  </div>
                  <div className="pt-1 ps-2">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))) : (
              <div>
                <p className="text-center py-3">
                  <b>No Comments</b>
                </p>
              </div>)}
          </div>
        </div>
        {!isMobile ? (
          <div className="px-3 col-lg-3 mt-5  ">
            <PopularTweets />
          </div>
        ) : null}
      </div>
    </>

  )
}


export default SingleTweet;

