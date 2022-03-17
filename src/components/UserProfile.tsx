import React from 'react'
import TopNameComponent from './TopNameComponent'
import Tweet from './Tweet'
import noProfile from "../styles/assets/noProfile.png"
import UnfollowUser from '../components/UnfollowUser';
import FollowUser from '../components/FollowUser';
import CreateProfile from '../components/CreateProfile';
import UpdateProfile from '../components/UpdateProfile';

interface FollowerIds {
    followId: number;
    id: number;
}

function UserProfile({ data, currentUser, FolloworUnfollow }: any) {

    return (
        <div>
            <div >
                <div className="border" >
                    <TopNameComponent name={data.name} tweets={data.tweets.length} avatar={data.profile?.avatar} />
                </div>
                <div className="border border-bottom">
                    <div className="ratio ratio-21x9 profile-photo" style={{ background: "#55abee" }} >
                    </div>
                    <div className='position-relative'>
                        <div className="" style={{ width: "22%" }}>
                            <img
                                className="img-fluid rounded-circle img-profile"
                                style={{ aspectRatio: "1" }}
                                alt="100x100"
                                src={data.profile?.avatar ? data.profile.avatar : noProfile}
                                data-holder-rendered="true"
                            />
                        </div>
                        <div className='follow-unfollow-button' >
                            {currentUser && currentUser.id != data.id ? (
                                FolloworUnfollow ? (
                                    <UnfollowUser id={FolloworUnfollow} />
                                ) : (
                                    <FollowUser
                                        id={data.id}
                                        name={data.name}
                                        avatar={data.profile?.avatar}
                                    />
                                )
                            ) : (
                                data.profile ? (
                                    <UpdateProfile profile={{
                                        id: data.id,
                                        bio: data.profile?.bio,
                                        location: data.profile?.location,
                                        website: data.profile?.website,
                                        avatar: data.profile?.avatar
                                    }} />
                                )
                                    : (
                                        <CreateProfile />
                                    )
                            )}
                        </div>


                    </div>
                    <div className="d-flex flex-column ms-3" style={{ lineHeight: "initial" }}>
                        <div className="fs-4 fw-bold"> {data.name}</div>
                        <div className="text-secondary" style={{ fontSize: "13px" }}> @{data.name}</div>
                    </div>
                    <div className="ms-3 mt-3" style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
                        <p>{data.profile?.bio}</p>
                    </div>
                    <div className="ms-3 mt-3 d-flex">
                        <div className="d-flex">
                            <div className="fw-bold me-2">256</div>
                            <div className="text-secondary">Following</div>
                        </div>
                        <div className="d-flex ms-4">
                            <div className="fw-bold me-2">13000</div>
                            <div className="text-secondary">Followers</div>
                        </div>
                    </div>
                    <div className="fw-bold ps-5 pt-2 mt-4 underline-blue">
                        Tweets
                    </div>


                </div>
                <div className='mb-4'>

                    {data &&
                        data.tweets &&
                        data.tweets.length > 0 ? (
                        data.tweets.map((tweet: any) => (
                            <Tweet key={tweet.id} tweet={tweet} />
                        ))) : (
                        <div>
                            <p className="text-center py-3">
                                <b>Yay! You have seen it all</b>
                            </p>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default UserProfile
