import { useEffect, useRef, useState } from "react";

const NotFound = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [click, setClick] = useState(false);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.5;
    }
    console.log("video ref is ", videoRef.current);
  };

  useEffect(() => {
      setTimeout(() => {
          handleUnmute();
      }, 100);
  }, [click])

  return (
     <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        {click==true ? <video ref={videoRef} src="/videos/chalaja.mp4" autoPlay controls loop playsInline className="w-80 max-w-full mb-6" /> : <h4 className="font-bold">Please click the below button</h4>}
        <button
          onClick={(() => {
            setClick(true)
          })}
          className="bg-blue-500 text-white mt-2 mb-1 px-4 py-2 rounded hover:bg-blue-600 transition"
        >
        🔊 Tap to Play the video
      </button>
        <h1 className="text-3xl font-bold">Oops! Page Not Found</h1>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
    </div>
  )
}

export default NotFound