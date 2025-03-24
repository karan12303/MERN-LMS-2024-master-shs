import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [animate, setAnimate] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  const handleEDUNOVAClick = () => {
    setAnimate(true);
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 3000); // Stop animation after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-7" />
          <span className="font-extrabold text-27px] md:text-[30px] bg-gradient-to-r from-black via-red-600 to-yellow-400 text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-black hover:via-red-500 hover:to-yellow-300 hover:scale-125 hover:rotate-3 transition-all duration-500 ease-in-out shadow-lg hover:shadow-2xl cursor-pointer hover:animate-bounce">
  EDUNOVA
</span>







        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-[14px] md:text-[16px] ml-3 font-medium"
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="font-extrabold md:text-xl text-[14px]">My Courses</span>
            <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
          </div>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
