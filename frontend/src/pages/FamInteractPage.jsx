import { BookOpenText } from "lucide-react"
function FamInteractPage({currentPair, completeFamMission,setMode}){

    return(
        <section className="flex flex-col pt-24 px-4 gap-10 items-center justify-center font-tegomin min-h-dvh w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl">Family Mission Time!</h1>
            <p>Team up with your family to complete the mission! 🚌 👨‍👩‍👧‍👦</p>
            <div className="bg-white/80 p-4 sm:p-10 md:p-20 my-5 text-center text-2xl rounded-xl shadow-sm block">
                <p className="text-lg snLtext-xl md:text-2xl">{currentPair.famMission}</p>
            </div>
            <div className="flex gap-3">
                <button onClick={()=> setMode("learning")} aria-label="see the words again" className="flex gap-1">See the Words Again <BookOpenText/></button>
                <button onClick={completeFamMission} aria-label="hooray done" className="bg-amber-200 hover:bg-amber-300">Hooray! Done!</button>
            </div>
        </section>
    )
}

export default FamInteractPage