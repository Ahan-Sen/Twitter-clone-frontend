import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"
import React, { useState } from "react"
import Modal from "react-modal"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { ME_QUERY } from "../pages/Profile"
import { customStyles, customStylesMobile } from "../styles/customStyles"
import { TWEETS_QUERY } from "./AllTweets"
import { formatDistance } from "date-fns";
import { subDays } from "date-fns/esm";
import { useHistory } from "react-router-dom"
import TweetReply from "../components/TweetReply"
import noProfile from  "../styles/assets/noProfile.png"
import { useMobile } from "../context/MobileContext"
const CREATE_COMMENT_MUTATION = gql`
	mutation createComment($content: String!, $id: Int!) {
		createComment(content: $content, id: $id) {
			id
		}
	}
`

interface CommentProps {
	content: string
}
interface Props {
	tweetAvatar : string | undefined
	tweet: string
	name: string
	avatar: string | undefined
	id: number
	autId: number
	createdAt: string
}

export default function CreateComment({ tweet, avatar, name, id, autId, createdAt , tweetAvatar }: Props) {
	const history = useHistory()
	const isMobile = useMobile()

	const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
		refetchQueries: [{ query: ME_QUERY }, { query: TWEETS_QUERY }]
	})

	const [modalIsOpen, setIsOpen] = useState(false)

	const { loading, error, data } = useQuery(ME_QUERY)

	if (loading) return <p>Loading...</p>
	if (error) return <p>{error.message}</p>

	const initialValues: CommentProps = {
		content: ""
	}

	const validationSchema = Yup.object({
		content: Yup.string()
			.required()
			.min(1, "Must be more than 1 character")
			.max(256, "Must be less than 257 characters")
	})

	const openModal = () => {
		setIsOpen(true)
	}

	const closeModal = () => {
		setIsOpen(false)
	}
	return (
		<div>
			<span onClick={openModal}>
				<i className="far fa-comment" aria-hidden="true" />
			</span>

			
			<Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal"
				style={!isMobile ? customStyles : customStylesMobile}>
				 <span className="exit" onClick={closeModal}>
                    <i className="fa fa-times mb-3 ps-3 pt-2" aria-hidden="true"></i>
                </span>
				<div className="d-flex  border-top ">
					<div className="col-md-2 m-1 mt-3 d-flex justify-content-center">
						<img
							className="rounded-circle img-fluid"
							alt="100x100"
							src={tweetAvatar? tweetAvatar : noProfile}
							data-holder-rendered="true"
							style={{ width: "48px", height: "48px" }}
						/>
					</div>
					<div className="d-flex flex-column pt-2 w-100">
						<div className="d-flex ">
							<div className="fw-bold" onClick={() => history.push(`/user/${autId}`)}>{name}</div>
							<div className="text-secondary ms-2" onClick={() => history.push(`/user/${autId}`)}>@static</div>
							<div className="mx-2 text-secondary"> . </div>
							<div className="text-secondary" style={{ fontSize: "15px" }}>
								{formatDistance(
									subDays(new Date(createdAt), 0),
									new Date()
								)}{" "}
								ago
							</div>
						</div>
						<Link to={`/tweet/${id}`} style={{ textDecoration: "none", color: "black" }}>
							<div className="">
								{tweet}
							</div>
						</Link>
					</div>
				</div>
				<div className="mt-5">
				<TweetReply id={id} avatar={avatar} closeModal={closeModal} btnType={"Reply"} text={"Tweet your reply..."}/>
				</div>
			</Modal>
				
		</div>
	)
}
