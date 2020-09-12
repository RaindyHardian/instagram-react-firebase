import React, {useState, useEffect} from 'react'

const getDimensions = ()=>{
  const {innerWidth, innerHeight} = window;
  return {
    innerWidth, innerHeight
  }
}
const GetViewport = () => {
  const [dimensions, setDimensions] = useState(getDimensions()) 
  useEffect(()=>{
    const handleResize = ()=>{
      setDimensions(getDimensions())
    }
    window.addEventListener('resize', handleResize)
    return ()=>{
      window.removeEventListener('resize', handleResize)
    }
  },[])
  return dimensions
}

export default GetViewport
