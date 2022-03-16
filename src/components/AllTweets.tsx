import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom"
import Tweet from "../components/Tweet";


export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    tweets {
      id
      createdAt
      content
      likes {
        id
      }
      comments {
        id
      }
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
    }
  }
`;

interface AllTweets {
	id: number;
	content: string;
	createdAt: Date;
	likes: [];
	comments: [];
	author: {
		id: number;
		name: string;
		profile: {
			avatar: string;
		};
	};
}

export default function AllTweets() {
	const { loading, error, data } = useQuery(TWEETS_QUERY);
	const history = useHistory()

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error.message}</p>;

	return (
		<div >
				<div>
				{data &&
					data.tweets &&
					data.tweets.map((tweet: AllTweets) => (
						<Tweet key={tweet.id} tweet={tweet} />
					)).reverse()}
					<p className="text-center py-3">
						<b>Yay! You have seen it all</b>
					</p>
				</div>
		</div>
	);
}
