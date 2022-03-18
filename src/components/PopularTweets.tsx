import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import noProfile from "../styles/assets/noProfile.png"


export const POPULAR_TWEETS = gql`
	query POPULAR_TWEETS {
		tweets {
			id
			createdAt
			content
			author {
				name
				id
				profile {
					id
					avatar
				}
			}
			likes {
				id
			}
		}
	}
`

interface Tweet {
	id: number
	createdAt: Date
	content: string
	author: {
		name: String
		id:number
		profile: {
			avatar: string
			id: number
		}
	}
	likes: {
		id: number
		length: number
	}
}

export default function PopularTweets() {
	const history = useHistory();
	const { loading, error, data } = useQuery(POPULAR_TWEETS)
	if (loading) return <p>Loading...</p>
	if (error) return <p>{error.message}</p>

	const getPopularTweets = data.tweets
		.map((tweet: Tweet) => tweet)
		.sort(function (a: Tweet, b: Tweet) {
			return b.likes.length - a.likes.length
		})
		.slice(0, 6)

	return (
		<div className="bg-trending">
			<h3 className="trending ps-3 pt-3 fw-bold fs-20">Trending</h3>
			{getPopularTweets.slice(0,5).map((tweet: Tweet) => (
				<div key={tweet.id} className="d-flex  py-3 px-2">
					<div className="col-md-2 pt-2 d-flex justify-content-center">
						<img
							className="rounded-circle img-fluid"
							alt="100x100"
							src={tweet.author.profile?.avatar ? tweet.author.profile?.avatar : noProfile}
							data-holder-rendered="true"
							style={{ width: "48px", height: "48px" }}
						/>
					</div>
					<div className="d-flex flex-column pt-2 w-100 ps-2">
						<div className="d-flex " style={{cursor:"default"}}>
							<div className="fw-bold" onClick={() => history.push(`/user/${tweet.author.id}`)}>{tweet.author.name}</div>
							<div className="text-secondary ms-2" onClick={() => history.push(`/user/${tweet.author.id}`)}>@{tweet.author.name}</div>
							
						</div>
						<Link to={`/tweet/${tweet.id}`} style={{ textDecoration: "none", color: "black" }}>
							<div className="">
								{tweet.content.substring(0,60)}
								{tweet.content.length > 60 ? "..." : ""}
							</div>
						</Link>
					</div>
				</div>
			))}
		</div>
	)
}
