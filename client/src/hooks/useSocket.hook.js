import React from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const chatEnter = () => {
    const socket = io();
    socket.on("connect", () => {
      socket.send("Hello");
    });
  };

  return { chatEnter };
};
