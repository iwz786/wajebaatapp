
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/login/LoginForm";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth";


export default async function Home() {

  const session = await getServerSession(authOptions);

  if (session) redirect("/form");

  return (
    <main>
      <ToastContainer className="no-print"/>
      <LoginForm/>
    </main>
  );
}