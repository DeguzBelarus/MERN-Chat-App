import { FC } from "react"
import "./Loader.scss"

const Loader: FC = () => {
    return (
        <div className="loader-container">
            <div className="loading-triangle"></div>
        </div>
    )
}

export default Loader