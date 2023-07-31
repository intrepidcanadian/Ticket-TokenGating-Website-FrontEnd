import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, { useEffect, useState } from "react";
import './Tickets.scss'

import axios from 'axios';

export default function Tickets() {
    const BASE_URL = "http://localhost:8000";

    const [connectedAddress, setAddress] = useState([]);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        // Fetch the list of tickets available
        axios.get(`${BASE_URL}/api/games/`)
            .then(response => {
                setTickets(response.data);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });




    }, []);

    
    
    return (
        <div>
            <Header />
            <div className="appbody">
                <div className='appbody__header'>
                    <h1 className='appbody__title'>
                        View Your Tickets
                    </h1>
                </div>
                <div className="appbody__content">
                    <div className="appbody__table">
                        <div className="appbody__table--piclabels">
                            <p className="appbody__table--labels"></p>
                        </div>
                        <p className="appbody__table--labels">Event</p>
                        <p className="appbody__table--labels">Location</p>
                        <p className="appbody__table--labels">Time Start</p>
                    </div>
                    {tickets.map(ticket => (
                        <div key={ticket.id}>
                            <div className="appbody__container">
                                <div className="appbody__imgcontainer">
                                    <img className="appbody__imgcontainer--image" src={ticket.image} alt={ticket.eventname} />
                                    <div className="appbody__imgcontainer--overlay">
                                        <p className="appbody__imgcontainer--textartist">{ticket.artist}</p>
                                        <p className="appbody__imgcontainer--text">{ticket.seat}</p>
                                    </div>
                                </div>
                                <p className="appbody__container--info">{ticket.eventname}</p>
                                <p className="appbody__container--info">{ticket.location}</p>
                                <p className="appbody__container--time">{new Date(ticket.eventtimestart).toLocaleString(undefined,{hour12:true})}</p>
                                {/* <p className="appbody__container--time">{new Date(ticket.eventtimeend).toLocaleString(undefined,{hour12:true})}</p> */}
                            </div>
                            <div className ="appbody__container--description">
                            <p className="appbody__container--descriptioninfo">{ticket.eventinformation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )

}
