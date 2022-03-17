import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import { useParams } from "react-router-dom"
import { ME_QUERY } from "../pages/Profile"
import { FOLLOWERS_QUERY } from "../pages/SingleUser"

const DELETE_FOLLOW_USER_QUERY = gql`
	mutation deleteFollow($id: Int!) {
		deleteFollow(id: $id) {
			id
		}
	}
`

interface Props {
	id: string
}

interface ParamType {
	id: any;
  }
  

export default function UnfollowUser({ id }: Props) {
	const { id:Followersid } = useParams<any>();

	const [ deleteFollow ] = useMutation(DELETE_FOLLOW_USER_QUERY, {
		refetchQueries: [ { query: ME_QUERY }, {query : FOLLOWERS_QUERY, variables: { followersId: parseInt(Followersid) } } ]
	})

	const handleUnFollow = async () => {
		await deleteFollow({
			variables: { id: parseInt(id) }
		})
	}

	return (
		<div>
			<button onClick={handleUnFollow} className="unfollow-button">
				Unfollow
			</button>
		</div>
	)
}
