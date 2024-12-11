"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { Download, Headphones, Pause } from "lucide-react"
import FamilyButton from "../ui/FamilyButton"

export function ResumeActions() {
     return (
          <div className="fixed bottom-4 right-4 z-[100]">
               <FamilyButton>
                    <ResumeActionsToggle />
               </FamilyButton>
          </div>
     )
}

const tabs = [
     { id: 0, label: "Download" },
     // { id: 1, label: "Listen" },
]

export function ResumeActionsToggle() {
     const [activeTab, setActiveTab] = useState(0)
     const [direction, setDirection] = useState(0)
     const [isAnimating, setIsAnimating] = useState(false)
     const [isPlaying, setIsPlaying] = useState(false)
     const [audioError, setAudioError] = useState(false)
     const [ref, bounds] = useMeasure()
     const audioRef = useRef(null)

     // Replace this with your Google Drive file ID
     const RESUME_PDF_ID = '1FimRSZAam0oH6vgMEQYvs0R5XbOpsHdA'
     // Google Drive direct download link
     const PDF_URL = `https://drive.google.com/uc?export=download&id=${RESUME_PDF_ID}`

     // Function to handle PDF download from Google Drive
     const handleDownload = () => {
          try {
               window.open(PDF_URL, '_blank');
          } catch (error) {
               console.error("Error in download handler:", error)
               alert("Sorry, there was an error downloading the resume. Please try again later.")
          }
     }

     // For audio playback using TTS (Text-to-Speech)
     const handleAudioPlayback = () => {
          if (!window.speechSynthesis) {
               alert("Sorry, your browser doesn't support text-to-speech functionality.")
               return
          }

          try {
               if (!audioRef.current) {
                    // Initialize speech synthesis
                    const utterance = new SpeechSynthesisUtterance(RESUME_TEXT)
                    // Customize voice settings
                    utterance.rate = 1.0  // Speed of speech
                    utterance.pitch = 1.0 // Pitch of voice
                    utterance.volume = 1.0 // Volume
                    
                    // Try to set a natural-sounding voice
                    const voices = window.speechSynthesis.getVoices()
                    const englishVoice = voices.find(voice => 
                         voice.lang.startsWith('en') && voice.name.includes('Natural')
                    ) || voices.find(voice => 
                         voice.lang.startsWith('en')
                    )
                    
                    if (englishVoice) {
                         utterance.voice = englishVoice
                    }

                    // Add event listeners
                    utterance.onend = () => {
                         setIsPlaying(false)
                    }
                    utterance.onerror = () => {
                         setIsPlaying(false)
                         setAudioError(true)
                         alert("Sorry, there was an error with the text-to-speech playback.")
                    }

                    audioRef.current = utterance
               }

               if (isPlaying) {
                    window.speechSynthesis.cancel()
                    setIsPlaying(false)
               } else {
                    window.speechSynthesis.speak(audioRef.current)
                    setIsPlaying(true)
               }
          } catch (error) {
               console.error("Error in audio handler:", error)
               setAudioError(true)
               alert("Sorry, there was an error with the audio playback. Please try again later.")
          }
     }

     // Cleanup speech synthesis on component unmount
     useEffect(() => {
          return () => {
               if (window.speechSynthesis) {
                    window.speechSynthesis.cancel()
               }
          }
     }, [])

     // Replace this with your resume text content
     const RESUME_TEXT = `
          Hello, and welcome to my portfolio. My name is Durgesh, a passionate Full-Stack Developer based in Nashik, Maharashtra. You can reach me at 9607541611 or by email at thoqb123456@gmail.com. Feel free to explore my work further on my website, www.durgeshbacchhav.vercel.app.

I have over one year of experience in both front-end and back-end development, specializing in creating scalable, high-quality web applications. My expertise lies in the MERN stack—MongoDB, Express, React, and Node.js—along with Next.js for optimized front-end development. My work focuses on writing clean, maintainable code, implementing secure authentication systems, and optimizing database performance. I’m passionate about delivering user-friendly, responsive applications with a strong emphasis on UI and UX design.

I hold a Master of Computer Science from Bhonsala Military College, Nashik, where I graduated with a CGPA of 7.1 out of 10 in June 2024.
Prior to that, I earned my Bachelor of Computer Science degree from KAANMS College, Satana, in June 2022, achieving a CGPA of 7.5 out of 10.

As a Full-Stack Developer at Sinss Digital Marketing Studio since March 2024, I’ve been involved in developing e-commerce, CRM, and project management applications. I’ve successfully led the design and development of over eight websites, ensuring they are scalable and user-friendly. I’ve worked extensively with RESTful APIs, secure authentication mechanisms, and optimized database queries to enhance application performance. Collaboration with cross-functional teams has been key to meeting project deadlines and ensuring smooth deployment.

Before that, I worked as a Web Developer Intern at Sinss Digital Marketing Studio from December 2023 to March 2024. During this time, I contributed to developing a dynamic website using React.js, improving its front-end performance and responsiveness. I also assisted in integrating React components with back-end services for a seamless user experience.

My core skills include Full Stack Development, Database Management, Agile Methodologies such as Scrum and Kanban, and Version Control. I also excel in web development, with strong communication and collaboration skills that allow me to work effectively in diverse teams.

Thank you for taking the time to learn about me and my work. If you’d like to discuss opportunities or collaborate on a project, don’t hesitate to reach out. I look forward to connecting with you!
     `.trim()

     const content = useMemo(() => {
          switch (activeTab) {
               case 0:
                    return (
                         <button 
                              onClick={handleDownload}
                              className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-600 transition-colors"
                              aria-label="Download Resume"
                         >
                              <Download size={32} className="text-white" />
                         </button>
                    )
               // case 1:
               //      return (
               //           <button 
               //                onClick={handleAudioPlayback}
               //                className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-600 transition-colors"
               //                aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
               //                disabled={audioError}
               //           >
               //                {isPlaying ? (
               //                     <Pause size={32} className="text-white" />
               //                ) : (
               //                     <Headphones size={32} className="text-white" />
               //                )}
               //           </button>
               //      )
               default:
                    return null
          }
     }, [activeTab, isPlaying, audioError])


     // Handle tab switching only
     const handleTabClick = (newTabId) => {
          if (newTabId !== activeTab && !isAnimating) {
               const newDirection = newTabId > activeTab ? 1 : -1
               setDirection(newDirection)
               setActiveTab(newTabId)
               playClickSound()
          }
     }

     // Cleanup audio on component unmount
     useEffect(() => {
          return () => {
               if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.removeEventListener('ended', () => {
                         setIsPlaying(false)
                    })
               }
          }
     }, [])

     const variants = {
          initial: (direction) => ({
               x: 300 * direction,
               opacity: 0,
               filter: "blur(4px)",
          }),
          active: {
               x: 0,
               opacity: 1,
               filter: "blur(0px)",
          },
          exit: (direction) => ({
               x: -300 * direction,
               opacity: 0,
               filter: "blur(4px)",
          }),
     }

     return (
          <div className="flex flex-col items-center pt-4 text-white">
               <div className="flex space-x-1 border border-none rounded-[8px] cursor-pointer bg-neutral-700 px-[3px] py-[3.2px] shadow-inner-shadow">
                    {tabs.map((tab, i) => (
                         <button
                              key={`${tab.id}-i-${i}`}
                              onClick={() => handleTabClick(tab.id)}
                              className={`${activeTab === tab.id ? "text-white" : "hover:text-white-300/60"
                                   } relative rounded-[5px] px-3 py-1.5 text-xs sm:text-sm font-medium text-white-600 transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-blue-light focus-visible:outline-none`}
                              style={{ WebkitTapHighlightColor: "transparent" }}
                         >
                              {activeTab === tab.id && (
                                   <motion.span
                                        layoutId="resume-action-bubble"
                                        className="absolute inset-0 z-10 bg-neutral-800 mix-blend-difference shadow-inner-shadow"
                                        style={{ borderRadius: 5 }}
                                        transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                                   />
                              )}
                              {tab.label}
                         </button>
                    ))}
               </div>
               <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
                    <motion.div
                         className="relative mx-auto my-[10px] w-[60px] md:w-[150px] overflow-hidden"
                         initial={false}
                         animate={{ height: bounds.height }}
                    >
                         <div className="md:p-6 p-2" ref={ref}>
                              <AnimatePresence
                                   custom={direction}
                                   mode="popLayout"
                                   onExitComplete={() => setIsAnimating(false)}
                              >
                                   <motion.div
                                        key={activeTab}
                                        variants={variants}
                                        initial="initial"
                                        animate="active"
                                        exit="exit"
                                        custom={direction}
                                        onAnimationStart={() => setIsAnimating(true)}
                                        onAnimationComplete={() => setIsAnimating(false)}
                                        className="flex items-center justify-center"
                                   >
                                        {content}
                                   </motion.div>
                              </AnimatePresence>
                         </div>
                    </motion.div>
               </MotionConfig>
          </div>
     )
}