"use client";
import React from "react";
import BackButton from "@/components/BackButton";

function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-6">About</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <p className="text-lg text-gray-700 mb-4 text-center">
          Welcome to our platform—the first of a suite of applications designed to
          make life easier for students and residents of TRNC. Here, you'll find a
          community-driven space that connects people and provides solutions.
        </p>
        <p className="text-lg text-gray-700 mb-4 text-center">
          Our marketplace allows you to find or list apartments, buy and sell
          products like electronics, books, or furniture, and offer or request
          services such as tutoring and freelance work. Whether you need a place
          to live, items for daily life, or specific services, this platform is
          here to help.
        </p>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Built with <span className="text-red-500">❤️</span> by <span className="font-semibold text-blue-600">The Airbenders</span>, we hope this platform makes life more
          convenient and fosters meaningful connections within the TRNC community.
        </p>
        <p className="text-center text-lg font-semibold text-blue-500">
          We hope you love it as much as we do!
        </p>
      </div>
    </div>
  );
}

export default About;
