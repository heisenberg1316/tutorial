import { Link } from "react-router-dom"

function App() {

  return (
    <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-between my-2 items-center border-b-gray-900  border-b-1 pb-5">
            <div>
               <h1 className="font-bold mx-2 sm:mx-5 text-md sm:text-xl lg:text-3xl">Medium</h1>
            </div>
            <nav className="flex gap-3 mx-2 sm:mx-5">
                <Link to="signin" className="font-medium text-sm rounded-xl px-3 py-1 sm:px-5 sm:py-2 sm:text-xl bg-gray-100 hover:bg-gray-300">Sign In</Link>
                <Link to="signup" className="font-medium text-sm rounded-xl px-3 py-1 sm:px-5 sm:py-2 sm:text-xl bg-gray-100 hover:bg-gray-300">Sign Up</Link>
            </nav>
        </div>
        {/* Hero */}
        <div className="flex flex-1 justify-center items-center ">
            <div className="flex flex-col max-w-[70%] gap-4 items-center justify-between text-center">
                <h1 className="text-4xl  sm:text-5xl font-bold">
                    Discover and Share Powerful Stories That Matter
                </h1>
                <p className="text-2xl font-light">
                    Your thoughts deserve a voice. Publish deep insights, explore diverse ideas, and connect with curious minds across the globe. Whether you're a seasoned writer or just getting started, our platform empowers you to tell your story with purpose and reach an engaged audience.
                </p>
                <div className="mt-2 flex flex-col gap-5 sm:flex-row font-mono">
                    <Link to="signin" className="font-medium text-sm border border-black rounded-lg px-3 py-2 sm:px-8 sm:py-3 sm:text-xl bg-white hover:bg-black hover:text-white">Get Started  {'\u2192'} </Link>
                    <Link to="signup" className="font-medium text-sm border border-black rounded-lg px-3 py-2 sm:px-8 sm:py-3 sm:text-xl bg-white hover:bg-black hover:text-white">Learn More</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App