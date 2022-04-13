import React, { FC } from "react";

import "./MessageBox.scss"

interface Props {
   message: string
}

export const MessageBox: FC<Props> = ({ message }) => {
   return <div className="message-box"><span>{message}</span></div>
}
