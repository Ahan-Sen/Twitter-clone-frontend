import { useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import gql from "graphql-tag"
import React from "react"
import * as Yup from "yup"
import { TWEETS_QUERY } from "./AllTweets"
 
const CREATE_TWEET_MUTATION = gql`
	mutation createTweet($content: String) {
		createTweet(content: $content) {
			id
		}
	}
`

interface TweetValues {
	content: string
}

export default function HomPageTweet() {
	const [ createTweet ] = useMutation(CREATE_TWEET_MUTATION, {
		refetchQueries: [ { query: TWEETS_QUERY } ]
	})

	const initialValues: TweetValues = {
		content: ""
	}

	const validationSchema = Yup.object({
		content: Yup.string()
			.required("* Must be more than 1 character")
			.min(1, "* Must be more than 1 character")
			.max(256, "* Must be less than 257 characters")
	})

	return (
		<div className="home-page-tweet">
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					setSubmitting(true)
					await createTweet({
						variables: values
					})

					setSubmitting(false)
					resetForm()
				}}
			>
				<Form>
					<Field name="content" type="text" as="textarea" placeholder="What's happening..." />
					<ErrorMessage name="content" component={"div"} className="text-danger fs-13" />

					<button type="submit" className="home-tweet-button" >
						<span>Tweet</span>
					</button>
				</Form>
			</Formik>
			<div className="footer" />
		</div>
	)
}
