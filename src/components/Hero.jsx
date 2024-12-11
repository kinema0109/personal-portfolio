'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import ImageMouseTrail from './common/mousetrail'
import { FlipWords } from './ui/flip-words'
import { ArrowRight, Mail } from 'lucide-react'
import AnimatedShinyText from './ui/animated-shiny-text'


const images = [
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format',
]


export default function Hero() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const y = useTransform(scrollY, [0, 200], [0, 100])
  const words = ["creative", "interactive", "beautiful", "modern"]

  return (
    <div className="relative min-h-[90vh] flex items-center">
      <ImageMouseTrail
        items={images}
        maxNumberOfImages={5}
        distance={25}
        imgClass="sm:w-40 w-28 sm:h-48 h-36"
      >
        <motion.div
          style={{ opacity, y }}
          className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {/* <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-green-300/50 text-primary text-sm font-medium"
                >
                  🎉 | Available for freelance work
                </motion.div> */}


                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold  text-primary sm:text-5xl lg:text-6xl "
                >
                  Hi, I&apos;m Hoàng Công Thọ<span className="text-green-300">.</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-4xl text-black font-medium"
                >
                  I build{' '}
                  <FlipWords
                    className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-xl shadow-lg"
                    words={words}
                  />{' '}
                  <span className="block sm:inline text-black">websites and apps</span>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </motion.div>
      </ImageMouseTrail>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:[background:radial-gradient(#1a1a1a_1px,transparent_1px)]" />
    </div>
  )
}