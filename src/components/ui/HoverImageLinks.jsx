import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";

const navLinks = [
     { id: "01", name: "Home", href: "/" },
     { id: "02", name: "Projects", href: "/projects" },
     { id: "03", name: "About", href: "/about" },
     { id: "04", name: "Contact", href: "/contact" },
     { id: "05", name: "Hobby", href: "/hobby" }
];

export const HoverImageLinks = ({
     isFullScreen = false
}) => {
     return (
          <section
               className={`
                    ${isFullScreen
                         ? 'fixed top-0 left-0 w-full h-full bg-black/90 z-50 flex flex-col justify-center'
                         : 'bg-green-500/10 backdrop-blur-md'}
                    transition-all duration-500 ease-in-out
               `}
          >
               <div className={`
                    ${isFullScreen
                         ? 'w-full px-4 md:px-20'
                         : 'w-full px-4 md:px-20'}
               `}
               >
                    {navLinks.map((link) => (
                         <Link
                              key={link.id}
                              heading={link.name}
                              subheading={`Explore our ${link.name.toLowerCase()}`}
                              imgSrc={`/imgs/random/${parseInt(link.id)}.jpg`}
                              href={link.href}
                              isFullScreen={isFullScreen}
                         />
                    ))}
               </div>
          </section>
     );
};

const Link = ({
     heading,
     imgSrc,
     subheading,
     href,
     isFullScreen = false
}) => {
     const ref = useRef(null);

     const x = useMotionValue(0);
     const y = useMotionValue(0);

     const mouseXSpring = useSpring(x);
     const mouseYSpring = useSpring(y);

     const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
     const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

     const handleMouseMove = (e) => {
          const rect = ref.current.getBoundingClientRect();

          const width = rect.width;
          const height = rect.height;

          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const xPct = mouseX / width - 0.5;
          const yPct = mouseY / height - 0.5;

          x.set(xPct);
          y.set(yPct);
     };

     return (
          <motion.a
               href={href}
               ref={ref}
               onMouseMove={handleMouseMove}
               initial="initial"
               whileHover="whileHover"
               className={`
                    group relative flex items-center justify-between 
                    ${isFullScreen
                         ? 'border-b-2 border-neutral-600 py-6 md:py-4'
                         : 'border-b-2 border-neutral-700 py-4 md:py-2'
                    } 
                    transition-colors duration-500 hover:border-neutral-50
               `}
          >
               <div>
                    <motion.span
                         variants={{
                              initial: { x: 0 },
                              whileHover: { x: -16 },
                         }}
                         transition={{
                              type: "spring",
                              staggerChildren: 0.075,
                              delayChildren: 0.25,
                         }}
                         className={`
                              relative z-10 block 
                              ${isFullScreen
                                   ? 'text-5xl md:text-6xl font-bold text-neutral-300'
                                   : 'text-4xl md:text-4xl font-bold text-neutral-500'
                              } 
                              transition-colors duration-500 group-hover:text-neutral-50
                         `}
                    >
                         {heading.split("").map((l, i) => (
                              <motion.span
                                   variants={{
                                        initial: { x: 0 },
                                        whileHover: { x: 16 },
                                   }}
                                   transition={{ type: "spring" }}
                                   className="inline-block"
                                   key={i}
                              >
                                   {l}
                              </motion.span>
                         ))}
                    </motion.span>
               </div>

               <motion.img
                    style={{
                         top,
                         left,
                         translateX: "-50%",
                         translateY: "-50%",
                         display: isFullScreen ? "none" : "block"
                    }}
                    variants={{
                         initial: { scale: 0, rotate: "-12.5deg" },
                         whileHover: { scale: 1, rotate: "12.5deg" },
                    }}
                    transition={{ type: "spring" }}
                    src={imgSrc}
                    className="absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
                    alt={`Image representing a link for ${heading}`}
               />

               <motion.div
                    variants={{
                         initial: {
                              x: "25%",
                              opacity: 0,
                         },
                         whileHover: {
                              x: "0%",
                              opacity: 1,
                         },
                    }}
                    transition={{ type: "spring" }}
                    className="relative z-10 p-4"
               >
                    <ArrowRight
                         className={`
                              ${isFullScreen
                                   ? 'text-6xl text-neutral-300'
                                   : 'text-5xl text-neutral-50'
                              }
                         `}
                    />
               </motion.div>
          </motion.a>
     );
};