
const NotFound = () => {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <img src={"https://media1.tenor.com/m/sWEY8anP4dwAAAAd/chala-ja-chala-ja-b-sd-k.gif"} alt="404 Not Found" className="w-96 max-w-full mb-6" />
        <h1 className="text-3xl font-bold">Oops! Page Not Found</h1>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
    </div>
  )
}

export default NotFound