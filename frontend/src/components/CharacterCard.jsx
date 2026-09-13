function CharacterCard ({character}){
    if (!character) return null;

    return(
        <div  className="flex md:flex-col bg-white rounded-2xl shadow-md p-5 gap-0.5 w-fit max-w-sm">
            <div className="w-full aspect-square flex flex-col items-center justify-center overflow-hidden mb-4">
                <img src={character.img_path} alt={character.alt_text} className="object-contain w-4/5 h-4/5"/>
                <p className="font-tegomin text-2xl md:hidden">{character.chinese}</p>
            </div>
            <div className="flex flex-col gap-5 font-tegomin text-2xl sm:text-xl">
                <p><strong className="font-bold text-slate-500 uppercase">Jyutping (pronunciation):</strong> {character.jyutping}</p>
                <p><strong className="font-bold text-slate-500 uppercase">Number of strokes:</strong> {character.stroke_num}</p>
                <p><strong className="font-bold text-slate-500 uppercase">Radical:</strong> {character.radical}</p>
                <p><strong className="font-bold text-slate-500 uppercase">Vocabulary:</strong> {character.word_ex}</p>
                </div>
        </div>
    )
}

export default CharacterCard