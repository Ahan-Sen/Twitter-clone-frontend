import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react'
import { TWEETS_QUERY } from '../components/AllTweets';
import { ME_QUERY } from '../pages/Profile';
import noProfile from  "../styles/assets/noProfile.png"
import * as Yup from "yup"

interface Props {
    avatar: string|undefined
    text?: string
    id?: number
    closeModal?: any
    btnType: string
}

interface InputProps {
    content: string
}

const validationSchema = Yup.object({
    content: Yup.string()
        .required( "* Must be more than 1 character")
        .min(1, ` * Must be more than 1 character`)
        .max(256, "* Must be less than 257 characters")
})

const CREATE_COMMENT_MUTATION = gql`
	mutation createComment($content: String!, $id: Int!) {
		createComment(content: $content, id: $id) {
			id
		}
	}
`
const CREATE_TWEET_MUTATION = gql`
	mutation createTweet($content: String) {
		createTweet(content: $content) {
			id
		}
	}
`

function TweetReply({ avatar, text, id, closeModal, btnType }: Props) {
    const initialValues: InputProps = {
        content: ""
    }

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        refetchQueries: [{ query: ME_QUERY }, { query: TWEETS_QUERY }]
    })

    const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
        refetchQueries: [{ query: TWEETS_QUERY }]
    })

    return (
        <>
            <div className="d-flex pb-3">
                <div>
                    <img
                        className="rounded-circle img-fluid me-3 ms-2"
                        alt="100x100"
                        src={avatar?avatar : noProfile}
                        data-holder-rendered="true"
                        style={{ width: "48px", height: "48px" }} />
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true)
                        {
                            btnType == "Reply" ? (
                                await createComment({
                                    variables: { ...values, id }
                                })
                            ) : (
                                await createTweet({
                                    variables: values
                                })
                            )
                        }

                        setSubmitting(false)
                        values.content = ""
                        closeModal()
                    }}
                >
                    <Form className="pt-1" style={{ width: "100%", fontSize: "20px" }}>
                        <Field name="content" className="border-0 w-100" type="text" as="textarea" placeholder={text} />
                        <ErrorMessage name="content" component={"div"} className="text-danger fs-13" />
                        <div className="d-flex flex-row-reverse me-3">
                            <button type="submit" className={`tweetreply-button`}>
                                <span>{btnType}</span>
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>

        </>
    )
}

export default TweetReply
