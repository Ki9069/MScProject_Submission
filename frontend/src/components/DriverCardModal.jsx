import {useState} from "react";

function DriverCardModal({userInfo,setUserInfo,setOpenModal,USER_GROUP}){
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Store form input values for user registration
    const [formData, setFormData] = useState({name: userInfo.name ||"", age: userInfo.age ||"", interest: userInfo.interest ||""}); 

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
    const basePath = `${API_BASE}/api`;

    // Submit user registration data to the backend
    async function handleSubmit(e){
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

    try{
        // Send form data to user registration endpoint
        const response = await fetch(basePath+"/users",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.name,
                age: parseInt(formData.age,10),
                interest: formData.interest,
                userGroup: USER_GROUP
            }),
        });

    const data = await response.json()

    if (!response.ok){
        throw new Error(data.error || "Failed to register.");
    }

    const finalUserData = data.user || formData;
    setUserInfo(finalUserData);
    setOpenModal(false);
    } catch(error){
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

    return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
        {/* backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
            
        </div>
        {/* modal */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center relative z-10 w-full max-w-md md:max-w-xl bg-white shadow-2xl border border-sky-100 rounded-2xl p-6 gap-6">
                <h2 className="text-2xl md:text-3xl font-digital text-center">
                    Driver Registration
                </h2>
                <div className="w-full px-6 py-3 border-2 border-slate-200 flex flex-col gap-1.5 text-md text-slate-700">
                    <label htmlFor="name" className="font-digital">Name : </label>
                    <input type="text" id="name" placeholder="Your Name" className="bg-slate-100 p-0.5"
                        value={formData.name} onChange={(e) => setFormData({...formData,name:e.target.value})}/>
                    
                    <label htmlFor="age" className="font-digital">Age : </label>
                    <input type="text" id="age" placeholder="How old are you?" className="bg-slate-100 p-0.5"
                        value={formData.age} onChange={(e) => setFormData({...formData,age:e.target.value})}/>
                    
                    <label htmlFor="interest" className="font-digital">Interest :</label>
                    <input type="text" id="interest" placeholder="What do you like?" className="bg-slate-100 p-0.5"
                        value={formData.interest} onChange={(e) => setFormData({...formData,interest:e.target.value})}/>
                </div>
              

                <div className="flex gap-10 text-2xl font-digital ">
                    <button type="button" className=" bg-amber-100 p-5 rounded-xl hover:bg-amber-200 cursor-pointer shadow-sm" onClick={()=> setOpenModal(false)} aria-label="Cancel">Cancel</button>
                    <button type="submit" className=" bg-amber-200 p-5 rounded-xl hover:bg-amber-300 cursor-pointer shadow-sm" aria-label="Submit">Submit</button>
                </div>
            </form>
    </div>
    );
}

export default DriverCardModal