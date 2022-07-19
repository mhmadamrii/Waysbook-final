// import hook
import React, { useState, useEffect, useContext } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


// import here
import Chat from '../components/complain/chat'
import Contact from '../components/complain/contact'
import NavbarUser from '../components/navbar/navAuth'

import { UserContext } from '../context/userContext'

// import socket.io-client 
import { io } from 'socket.io-client'

// initial variable outside socket
let socket
export default function ComplainUser() {
    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    // code here
    const [messages, setMessages] = useState([])

    // code here
    const [state] = useContext(UserContext)

    useEffect(() => {
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem("token")
            }
        })

        // code here
        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })

        // listen error sent from server
        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });
        loadContact()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages]) // code here

    const loadContact = () => {
        // emit event load admin contact
        socket.emit("load admin contact")
        // listen event to get admin contact
        socket.on("admin contact", (data) => {
            // manipulate data to add message property with the newest message
            // code here

            const dataContact = {
                ...data,
                message: messages.length > 0 ? messages[messages.length - 1].message : 'Click here to start message'
            }
            setContacts([dataContact])
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        // code here
        socket.emit('load messages', data.id)
    }

    // code here
    const loadMessages = () => {
        socket.on('messages', async (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
            } else {
                setMessages([])
                loadContact()
            }
        })
    }

    const onSendMessage = (e) => {
        if (e.key == "Enter") {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit('send message', data)
            e.target.value = ''
        }
    }

    return (
        <>
            <div>
                <div className="backgroundImageFull">
                    <NavbarUser />
                    <Container fluid style={{ height: '89.5vh', paddingLeft:"100px", paddingRight:"100px" }}>
                        <Row>
                            <Col md={3} style={{ height: '89.5vh' }} className="px-3 overflow-auto">
                                <Contact style={{backgroundColor: "#dfdfdf", borderRadius: "5px"}} dataContact={contacts} clickContact={onClickContact} contact={contact} />
                            </Col>
                            <Col md={9} style={{ height: '89.5vh', backgroundColor: "#dfdfdf", borderRadius: "5px" }} className="px-3 overflow-auto">
                                <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}