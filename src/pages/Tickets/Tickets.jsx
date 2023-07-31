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
                    {tickets.map(ticket => (
                        <div key={ticket.id}>
                            <p>{ticket.eventname}</p>
                            <p>{ticket.artist}</p>
                            <p>{ticket.seat}</p>
                            <p>{ticket.location}</p>
                            <p>{ticket.eventtimestart}</p>
                            <p>{ticket.eventtimeend}</p>
                            <img src={ticket.image} alt={ticket.eventname} />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )

}
