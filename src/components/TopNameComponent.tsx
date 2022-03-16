import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { useMobile } from '../context/MobileContext';
import noProfile from "../styles/assets/noProfile.png"
import LeftNav from './LeftNav';

interface Props {
    name: string
    tweets? : number
    avatar: string|undefined
    userName? :string
}




function TopNameComponent({ name, tweets , avatar , userName }: Props) {

    function closeNav(){
        setOpenNav(false)
    }
    const isMobile = useMobile()
    const history = useHistory();
    const [openNav , setOpenNav] = useState(false)
    return (
        <div className="d-flex py-2 w-100 ">
            {name == 'Home'  ? isMobile ? (
                <div className="col-1 me-2" onClick={()=>setOpenNav(true)}>
                    <img
                        className="img-fluid rounded-circle "
                        style={{ aspectRatio: "1" }}
                        alt="100x100"
                        src={avatar ? avatar : noProfile}
                        data-holder-rendered="true"
                    />
                </div>
            )  : null :
                <div className="col-2 d-flex align-items-center ps-4 " onClick={() => history.goBack()}>
                    <i className="fas fa-arrow-left fa-1x"></i>
                </div>
            }
            <div className="d-flex flex-column" style={{ lineHeight: "initial" }}>
                <div className="  fs-5 fw-bold"> {name}</div>
                {name == 'Home' || name == 'Tweet' ? null :
                    <div className="text-secondary" style={{ fontSize: "0.8rem" }}> {tweets} Tweets</div>
                }
            </div>
            <div className={ ` h-100 position-absolute ${openNav?"":"d-none"}` } style={{width:"85%", backgroundColor:"white" , left:"0"}}>
                <LeftNav name={userName} avatar={avatar} closeNav={closeNav}/>
            </div>
        </div>
    )
}

export default TopNameComponent
