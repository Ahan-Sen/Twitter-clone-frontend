import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import LeftNav from "../components/LeftNav";
import PopularTweets from "../components/PopularTweets";
import UserProfile from "../components/UserProfile";
import { useMobile } from "../context/MobileContext";


export const ME_QUERY = gql`
  query me {
    me {
      name
      id
      Following {
        id
        name
        followId 
      }
      likedTweet {
        id
        tweet {
          id
        }
      }
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
        bio
        location
        website
        avatar
      }
    }
  }
`;

function Profile() {
  const isMobile = useMobile()
  const { loading, error, data } = useQuery(ME_QUERY);  


  if (loading) return <p>Loading...</p>;
  if (error) return <p>error {error.message}</p>;



  return (
    <>
      <div className="d-flex">
      {!isMobile ? (
          <div className="col-lg-3 ps-5 pe-5">
            <LeftNav name={data.me.name} avatar={data.me.profile?.avatar} />
          </div>
        ) : null}
        <div className="col-12 col-md-6  " style={{height:"100vh", overflowY:"auto"}}>
          <UserProfile data={data.me} />
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

export default Profile;
