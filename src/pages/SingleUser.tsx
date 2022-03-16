import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import PopularTweets from "../components/PopularTweets";
import { ME_QUERY } from "./Profile";
import UserProfile from "../components/UserProfile";
import { useMobile } from "../context/MobileContext";

export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      name
      tweets {
	   id
      createdAt
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
      content
      likes {
        id
      }
      comments {
        id
      }
      }
      profile {
        id
        avatar
        bio
        website
      }
    }
  }
`;

interface ParamType {
  id: string;
}


function SingleUser() {
  const isMobile = useMobile()
  const history = useHistory();
  const { id } = useParams<ParamType>();

  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { id: parseInt(id) },
  });
  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (meLoading) return <p>Loading...</p>;
  if (meError) return <p>{meError.message}</p>;

  interface FollowerIds {
    followId: number;
    id: number;
  }

  const idOfFollowers = meData.me.Following.map(
    (follow: FollowerIds) => follow.followId
  );
  const follows = meData.me.Following.map((follow: FollowerIds) => follow);

  const getFollowId = follows.filter(
    (follow: any) => follow.followId === data.user.id
  );

  

  return (
    <>
      <div className="d-flex">
        {!isMobile ? (
          <div className="col-lg-3 ps-5 pe-5">
            <LeftNav name={meData.me.name} avatar={meData.me.profile?.avatar} />
          </div>
        ) : null}
        <div className="col-12 col-md-6 border-start border-end" style={{height:"100vh", overflowY:"auto"}}>

          <UserProfile 
          data={data.user} currentUser={meData.me} 
          FolloworUnfollow={idOfFollowers.includes(data.user.id) ? getFollowId[0].id : null  } />
        </div>
        {!isMobile ? (
          <div className="px-3 col-3 mt-5  ">
            <PopularTweets />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SingleUser;
