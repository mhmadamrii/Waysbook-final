import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Chat from '../components/complain/chat'
import Contact from '../components/complain/contact'
import NavbarAdmin from '../components/navbar/navAuth'
import { UserContext } from '../context/userContext'
import {io} from 'socket.io-client'

let socket
export default function ComplainAdmin() {
    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])

    const [messages, setMessages] = useState([])

    const [state] = useContext(UserContext)

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        })

        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })

        loadContacts()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages]) 

    const loadContacts = () => {
        socket.emit("load customer contacts")
        socket.on("customer contacts", (data) => {
            let dataContacts = data.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length - 1].message : 'Click here to start message'
            }))
            
            setContacts(dataContacts)
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        
        socket.emit('load messages', data.id)
    }

    const loadMessages = () => {
        socket.on('messages', async (data) => {
            if(data.length > 0){
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)

                loadContacts()
            }else{
                setMessages([])
                loadContacts()
            }
        })
    }

    const onSendMessage = (e) => {
        if(e.key === "Enter"){
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
            <div className="backgroundImageFull" style={{border: '1px solid'}}>
                    <NavbarAdmin />
                <Container fluid style={{height: '89.5vh', paddingLeft:"100px", paddingRight:"100px" }}>
                <Row style={{display: 'flex'}}>
                    <Col md={3} style={{height: '89.5vh'}} className="px-3 overflow-auto">
                        <Contact style={{backgroundColor: "#dfdfdf", borderRadius: "5px"}}  dataContact={contacts} clickContact={onClickContact} contact={contact}/>
                    </Col>
                    <Col md={9} style={{height: '89.5vh', backgroundColor: "#dfdfdf", borderRadius: "5px", width: '50rem', overflow: 'hidden' }} className="px-3 overflow-auto">
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}  />
                    </Col>
                </Row>
            </Container>
            </div>
            </div>
        </>
    )
}