import React from 'react'
import { Link } from 'react-router-dom'
import heroImg from './../../assets/pic/apetz01.jpg'
import bgImg from './../../assets/pic/bg-hero.jpg'

export default function HeaderHero() {
    return (
        <header>
            <div className="container-xxxl py-2 bg-dark hero-header mb-5" style={{
                background: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)),url(${bgImg})`
            }}>
                <div className="container my-5 py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 text-center text-lg-start">
                            <h1 className="display-3 text-white animated slideInLeft">Enjoy Our<br />Lethal Meal</h1>
                            <p className="text-white animated slideInLeft mb-4 pb-2">Savor the best of culinary delights crafted by our expert chefs.
                                Indulge in a variety of flavors and dishes that will tantalize your taste buds.
                                Experience dining like never before in a warm and welcoming atmosphere.</p>
                            <Link to='/booking' className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft">Book a Table</Link>
                        </div>
                        <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                            <img className="img-fluid" src={heroImg} alt="" style={{maxHeight: 400}}/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
