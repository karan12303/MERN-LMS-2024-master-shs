

import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black animate-gradient">
      <style>{`
        /* Smooth gradient animation */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }

        /* Card futuristic glowing effect */
        .card-glow {
          background: rgba(30, 30, 30, 0.9);
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2), 
                      0 0 40px rgba(128, 90, 213, 0.5),
                      0 0 80px rgba(255, 127, 80, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-glow:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4),
                      0 0 60px rgba(128, 90, 213, 0.7),
                      0 0 100px rgba(255, 127, 80, 0.5);
        }

        /* Input field styling */
        .input-field {
          background-color: rgba(255, 255, 255, 0.1);
          color: gray-300;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          border-radius: 0.25rem;
          width: 100%;
          transition: background-color 0.3s, box-shadow 0.3s;
        }
        .input-field:focus {
          background-color: rgba(255, 255, 255, 0.2);
          outline: none;
          box-shadow: 0 0 0 2px rgba(216, 180, 254, 0.5); /* Purple glow */
        }
      `}</style>
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-700">
        <Link to={"/"} className="flex items-center justify-center text-white">
          <GraduationCap className="h-8 w-8 mr-4 text-purple-400" />
          <span className="font-extrabold text-27px md:text-[30px] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600 hover:scale-125 hover:rotate-3 transition-all duration-500 ease-in-out shadow-lg hover:shadow-2xl cursor-pointer hover:animate-bounce">
  EDUNOVA
</span>


        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
            <TabsTrigger
              value="signin"
              className="text-white hover:bg-purple-700 transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="text-white hover:bg-purple-700 transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4 card-glow rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Sign in to your account
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                  inputClass="bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  buttonClass="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
                  labelClass="text-gray-500"  // Change this line
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4 card-glow rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Create a new account
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
                  inputClass="bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  buttonClass="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
                  labelClass="text-gray-500"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
