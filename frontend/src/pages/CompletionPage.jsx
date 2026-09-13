function CompletionPage({userInfo, setCurrentPage}){
    
    return (
        <div className="flex flex-col font-digital justify-center items-center gap-1.5">
            <img src="/images/busparade.png" alt="four people riding on a bus parade celebrating victory"></img>
            <h1 className="text-2xl">Congratulation! </h1>
            <p className="outline md:text-7xl bg-linear-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent drop-shadow-lg text-xl font-tegomin mb-4">
                    Well done, {userInfo.name}!</p>
            <p className="text-lg text-slate-700 mb-6 block font-tegomin">
                    You've completed all stations in 字遊廣東話! </p>
            <button 
                className="border-0 border-red-700 hover:border-5 bg-amber-200 hover:bg-amber-100 text-lg px-8 py-4 rounded-lg"
                onClick={() => setCurrentPage("homePage")}
                aria-label="Return to home page">
                Return to Home
            </button>

        </div>
    )
}
export default CompletionPage