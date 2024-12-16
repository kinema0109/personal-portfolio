'use client'

import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { projects } from '../lib/projects'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import FuzzyOverlay from '../components/FuzzyOverlay'
import SEO from '../components/SEO'

const ProjectDetails = () => {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const statsRef = useRef(null)
  const infoRef = useRef(null)
  const descriptionRef = useRef(null)
  const imageRef = useRef(null)

  const statsInView = useInView(statsRef, { once: true })
  const infoInView = useInView(infoRef, { once: true })
  const descriptionInView = useInView(descriptionRef, { once: true })
  const imageInView = useInView(imageRef, { once: true })

  return (
    <>
    <SEO
        title={project.name}
        description={project.name}
        path={`/projects/${project.slug}`}
      />
    <div className="bg-gray-50">
      <div className="relative overflow-hidden rounded-b-[80px]">
        <section className="relative grid h-[70vh] w-full place-content-center overflow-hidden bg-[#fff]">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center z-0 text-[10vw] font-black text-neutral-800 md:text-[60px]"
          >
            {project.name}<span className="text-orange-500">.</span>
          </motion.h2>
        </section>
        <FuzzyOverlay />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          ref={statsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {/* {[
            { value: "5520", label: "Elements created" },
            { value: "4688", label: "Lines of code" },
            { value: "TBA", label: "Awards & Mentions" },
            { value: "35", label: "Total Project Days" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl font-bold text-orange-500">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))} */}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16">
          <motion.div 
            ref={infoRef}
            initial={{ opacity: 0, x: -50 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:w-1/3"
          >
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Project Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">BRAND</h4>
                  <p>{project.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold">TYPE</h4>
                  <p>{project.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold">TECHNOLOGY</h4>
                  <ul className='flex flex-wrap gap-2'>
                    {project.techStack.map((tech, index) => (
                      <li className='bg-green-200 p-1 rounded-lg px-2 ' key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Web Design</li>
                <li>Web Development</li>
                <li>Animations</li>
                <li>Branding</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            ref={descriptionRef}
            initial={{ opacity: 0, x: 50 }}
            animate={descriptionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:w-2/3"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Project Description</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <ul className="list-disc list-inside space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Links</h2>
              <a 
                href={`https://${project.liveLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Visit {project.type}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, y: 50 }}
          animate={imageInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <img
            src={project.image}
            alt={project.name}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
    </>
  )
}

export default ProjectDetails