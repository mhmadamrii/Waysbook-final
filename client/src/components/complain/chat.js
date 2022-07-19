import React from "react";

import default_profile from "../../assets/temp/blank-profile.png"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

export default function Chat({ contact, user, messages, sendMessage }) {
  return (
    <>
      {contact ? (
        <>
          <div id="chat-messages" style={{ height: "80vh" }} className="overflow-auto px-3 py-2">
          {messages.map((item, index) => (
              <div key={index}>
                <div style={{gap: '2rem', flexDirection:'column'}} className={`d-flex py-1 my-2 ${item.idSender === user.id ? "justify-content-end": "justify-content-start"}`}>
                  <div
                    className={ item.idSender === user.id ? "chat-me" : "chat-other"}
                  >
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: '6vh', backgroundColor:'#797979', padding: '0.3rem 0.5rem' }}>
            <input 
              placeholder="Send Message" 
              className="input-message px-4" 
              style={{borderRadius: '0.5rem'}}
              onKeyPress={sendMessage} />
          </div>
        </>
      ) : (
        <div
          style={{ height: "89.5vh" }}
          className="h4 d-flex justify-content-center align-items-center"
        >
          No Message
        </div>
      )}
    </>
  );
}