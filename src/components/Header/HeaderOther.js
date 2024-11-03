import React from 'react';
import bgImg from './../../assets/pic/bg-hero.jpg';
import { Link } from 'react-router-dom';


export default function HeaderOther(props) {
    const {title} = props
    
    return (
        <div className="container-xxxl py-5 bg-dark hero-header mb-5" style={{
            background: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)),url(${bgImg})`
        }}>
        <div className="container text-center my-5 pt-5 pb-4">
            <h1 className="display-3 text-white mb-3 animated slideInDown" style={{fontFamily: "Lato"}}>{title}</h1>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center text-uppercase" style={{fontFamily: "Lato"}}>
                    <li className="breadcrumb-item" ><Link to='/home'>Home</Link></li>
                    <li className="breadcrumb-item"><Link to='/menu'>Menu</Link></li>
                    <li className="breadcrumb-item text-white active" aria-current="page">{title}</li>
                </ol>
            </nav>
        </div>
    </div>
    )
}
