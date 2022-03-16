
import { gql, useQuery } from "@apollo/client"
import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import AllTweets from "../components/AllTweets"
import PopularTweets from "../components/PopularTweets"
import LeftNav from "../components/LeftNav"
import TopNameComponent from "../components/TopNameComponent"
import TweetReply from "../components/TweetReply"
import { useMobile } from "../context/MobileContext"


export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      profile {
        id
        bio
        location
        website
        avatar
      }
    }
  }
`

function Home() {
  const isMobile = useMobile()
  const history = useHistory()

  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      <div className="d-flex" >
        {!isMobile ? (
          <div className="col-lg-3 ps-5 pe-5">
            <LeftNav name={data.me.name} avatar={data.me.profile?.avatar} />
          </div>
        ) : null}
        <div className="col-12 col-lg-6" style={{height:"100vh", overflowY:"auto"}}>
          <div className="border ps-3">
            <TopNameComponent name={"Home"} userName={data.me.name} avatar={data.me.profile?.avatar} />
          </div>
          <div className="pt-3 border-start border-bottom border-end">
            <TweetReply avatar={data.me.profile?.avatar} id={data.me.id} text={"Whats happening..."} btnType={"Tweet"} />
          </div>
          <AllTweets />
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

export default Home
