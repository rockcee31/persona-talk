import React, { useState } from 'react'
// import img from "../assets/persona.png"
import { useContext } from 'react';
import { AppContext } from '../appContext';
import robotImg from '../assets/robot.png'
import axios from 'axios'
const Body = () => {
    const { setStarted,setPersona} = useContext(AppContext);
    const [name,setName] = useState("")
    const [description,setDescription] = useState('')
    const handleStart = async()=>{
         if (!name.trim()) return alert("Please enter a name.");
         try {
            const res = await axios.get("http://localhost:3000/persona", {
            name,
            about:description
      });
         console.log(res)
         } catch (error) {
            console.error(error)
         }
        setPersona({ name, description }); // Store persona globally
        setStarted(true);                  // Signal app to go to ChatUI
    }
    
    return (
        <div className='bg-gray-50'>
        

            <div className='w-full  '>
                <div className='flex flex-col items-center justify-end  pt-15'>
                    {/* <img src={img} className='h-20 w-20 mt-2'></img> */}
                    <h1 className='font-bold text-xl'>
                        <span className='text-3xl'>PerSonaTalk</span> – TALK TO FAMOUS PERSONAS</h1>
                    <div className='flex justify-center mx-5 '>
                    <p className='font-semibold text-lg text-center '>PersonaTalk is a Generative AI-powered web application that lets users converse with AI personas of famous people. By combining real-world data from Wikipedia and the powerful capabilities of OpenAI’s GPT model, PersonaTalk creates intelligent, context-aware, and engaging conversations with historical figures, celebrities, scientists, and more — all simulated as if you're chatting directly with them.</p>
                </div>


                </div>
                {/* <div className='justify center flex justify-center ml-20 max-w-3xl'>
                    <p className='font-semibold text-lg'>PersonaTalk is a Generative AI-powered web application that lets users converse with AI personas of famous people. By combining real-world data from Wikipedia and the powerful capabilities of OpenAI’s GPT model, PersonaTalk creates intelligent, context-aware, and engaging conversations with historical figures, celebrities, scientists, and more — all simulated as if you're chatting directly with them.</p>
                </div> */}
            </div>

            <div className='min-h-screen w-full   flex justify-around'>

                <div>
                    <img src={robotImg} className='h-md w-md'></img>
                </div>
            





            <div className='flex  items-center mb-50'>
                <div className="relative w-full h-fit max-w-xl  p-6 border border-gray-300 rounded-xl shadow-md bg-white">
                    <h1 className="text-2xl font-bold text-center mb-4 whitespace-nowrap">
                        CHAT WITH ANY FAMOUS PERSON 
                    </h1>

                    {/* You can later add input fields and chat area here */}
                    <div className='mt-5'>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Type Name of a person you want to chat with</legend>
                            <input type="text" className="input" placeholder="Type here" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} />

                        </fieldset>
                    </div>
                    <div className='mt-5'>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Tell Something about the person</legend>
                            <textarea className="textarea h-24" placeholder="He is a famous actor?(like this)"
                            value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>

                        </fieldset>
                    </div>

                    <button className="btn bg-[#FF9900] text-black border-[#e17d00] mt-6" onClick={handleStart}>
                        
                        GET STARTED
                    </button>
                </div>
            </div>

        </div>
        </div>
    );
};

export default Body;
