import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const WebSocketService = ({ setValue, connetTo }) => {
  const [stompClient, setStompClient] = useState();
  const [connected, setConnected] = useState(false);
  const connect = () => {
    let sock = new SockJS("http://localhost:8000/api/anh/ws");
    let stemp = Stomp.over(sock);
    setStompClient(stemp);
    stemp.connect({}, onConnect, onErrol);
  };

  const onErrol = (e) => {
    console.log(e);
  };
  const onConnect = () => {
    setConnected(true);
  };
  const onMessageReceived = (msg) => {
    console.log("Trạng thái mới", msg);
    if (msg.body) {
      console.log("Trạng thái mới", msg.body);
      setValue(JSON.parse(msg.body));
    }
  };
  useEffect(() => {
    if (connected && stompClient?.connected) {
      const subscription = stompClient.subscribe(
        "/topic/" + connetTo,
        onMessageReceived
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [connected, stompClient, connetTo]);
  useEffect(() => {
    return () => connect();
  }, [Math.random]);
};

export default WebSocketService;
