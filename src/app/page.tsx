"use client";

import React from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HeroSectionHeader from "./components/HeroSectionHeader";
import LatestQuestions from "./components/LatestQuestions";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Simple Navbar */}
      {/* <nav className="flex justify-between items-center px-6 py-4 border-b border-white/20">
        <h1 className="text-xl font-semibold">
          <Link href="/">MyApp</Link>
        </h1>
        <ul className="flex gap-4 text-sm">
          <li>
            <Link href="/questions" className="hover:text-orange-400">Questions</Link>
          </li>
          <li>
            <Link href="/ask-question" className="hover:text-orange-400">Ask</Link>
          </li>
          <li>
            <Link href="/users" className="hover:text-orange-400">Users</Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-orange-400">Profile</Link>
          </li>
        </ul>
      </nav> */}

      {/* Empty content area */}
      <section className="flex flex-col items-center justify-center h-[20vh]">
        <p className="text-xl text-gray-400">Welcome to MyApp</p>
      </section>
        {/* <p className="text-xl text-gray-400">Welcome to MyApp</p> */}
      <HeroSectionHeader/>

      {/* because of assyn nature we r not adding this one  */}
      {/* <HeroSection/> */}
      {/* <LatestQuestions/> */}
      <Footer/>

    </main>
  );
}
