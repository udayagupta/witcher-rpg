import { useState } from "react"

const HoverInfo = ({children, infoToShow}) => {
    const [isHovered, setIsHovered] = useState(false);

  return (
    <div onMouseDown={() => setIsHovered(prev => !prev)} className="relative ">
        {isHovered && <p className="absolute p-2 rounded-md bg-slate-900 border border-orange-500 top-[40px] left-[-180px] max-w-[400px]">{infoToShow}</p>}
        {children}
    </div>
  )
}

export default HoverInfo