import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { RevealLinks } from "../components/common/RevealLinks";
import shakehand from '../assets/images/shakehands.svg'
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { ReactLenis } from 'lenis/react';
import SEO from "../components/SEO";

export const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEO
        title="Contact"
        description="Welcome to my portfolio website. I'm a Full Stack Developer specializing in modern web technologies."
        path="/contact"
      />
      <ReactLenis root>
        <section className={twMerge(
          "sticky top-0 grid min-h-screen w-full place-content-center overflow-hidden bg-[#f5f5f5]",
          "lenis-section"
        )}>
          <h2 className="relative z-0 text-[14vw] font-black text-[#333] md:text-[200px]">
            Contact<span className="text-[#ff6b6b]">.</span>
          </h2>
        </section>
        <section className={twMerge(
          "sticky top-0 min-h-screen w-full place-content-center overflow-hidden bg-[#e8e2e2] rounded-t-3xl",
          "lenis-section"
        )}>
          <div className="">
            <div className="w-40 rounded-full bg-[#d4d4d4] mx-auto">
              <img src={shakehand} alt="hand shake image" className="w-40 mx-auto" />
            </div>
            <h3 className="text-6xl max-w-xl mx-auto text-center font-bold my-4 text-[#333]">Tell me about your next project</h3>
            <div className="flex justify-center space-x-4">
              <Link
                to="mailto:thoqb123456@gmail.com"
                className={twMerge(
                  "bg-[#333] flex gap-2 text-white px-6 py-3 rounded-full hover:bg-[#4d4d4d] font-semibold transition-colors",
                  "lenis-link"
                )}
              >
                <Mail />Email Me
              </Link>
              {/* <Link
                to="https://api.whatsapp.com/send?phone=9607541611&text=Hello%20there!"
                className={twMerge(
                  "bg-[#25d366] text-white px-6 py-3 rounded-full hover:bg-[#34c95b] font-semibold transition-colors",
                  "lenis-link"
                )}
              >
                WhatsApp
              </Link> */}

            </div>
          </div>
        </section>
        <section className={twMerge(
          "sticky top-0  place-content-center overflow-hidden",
          "lenis-section"
        )}>
          <RevealLinks />
        </section>
      </ReactLenis>
    </>
  );
};