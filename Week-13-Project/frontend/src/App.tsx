import { Link } from "react-router-dom"

function App() {

  return (
    <div className="flex flex-col mt-5 sm:mt-0 min-h-[480px]">
        {/* Hero */}
        <div className="flex flex-1 justify-center items-center ">
            <div className="flex flex-col max-w-[70%] gap-4 items-center justify-between text-center">
                <h1 className="text-2xl  sm:text-4xl font-bold">
                    Discover and Share Powerful Stories That Matter
                </h1>
                <p className="text-xl font-light">
                    Your thoughts deserve a voice. Publish deep insights, explore diverse ideas, and connect with curious minds across the globe. Whether you're a seasoned writer or just getting started, our platform empowers you to tell your story with purpose and reach an engaged audience.
                </p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row font-mono items-center">
                    <Link to="signin" className="font-medium text-sm border border-black rounded-lg px-3 py-2 sm:px-4 sm:py-2 sm:text-lg bg-white hover:bg-black hover:text-white">Get Started  {'\u2192'} </Link>
                    <Link to="signup" className="font-medium text-sm border border-black rounded-lg px-3 py-2 sm:px-4 sm:py-2 sm:text-lg bg-white hover:bg-black hover:text-white">Learn More</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App