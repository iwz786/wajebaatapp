'use client'

import { useState } from "react";
import {signIn} from 'next-auth/react'
import { useRouter } from "next/navigation";

export default function LoginForm(props: any) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      console.log("form submitted");

      try {
        const res = await signIn('credentials', {
          username, 
          password,
          redirect: false
        })

        if (res!.error) {
          alert("Error loggin in");
          return;
        }
        router.replace("form")
      } catch(error) {
        console.log(error)
      }
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Wajebaat Portal Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="inline-block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="inline-block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-block mx-auto px-4 py-2 leading-5 text-white font-bold bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
