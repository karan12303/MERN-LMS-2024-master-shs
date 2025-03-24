
import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black animate-gradient overflow-x-hidden">
      <style>{`
        /* Smooth gradient animation */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite; /* Faster gradient speed */
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Header - Futuristic Glow Effect */
        .futuristic-heading {
          font-family: 'Orbitron', sans-serif;
          font-size: 4rem;
          font-weight: bolder;
          background: linear-gradient(to right, #ff4d4d, #9b59b6, #3498db);
          -webkit-background-clip: text;
          color: transparent;
          animation: gradientShift 4s ease infinite;
          text-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 127, 80, 0.8);
        }

        /* Button Hover effect */
        .button-glow {
          background-color: rgba(128, 90, 213, 1);
          transition: background-color 0.15s ease, box-shadow 0.15s ease;
        }
        .button-glow:hover {
          background-color: rgba(255, 127, 80, 1);
          box-shadow: 0 0 12px rgba(255, 127, 80, 0.7), 0 0 35px rgba(255, 127, 80, 0.5);
        }

        /* Course Card Glowing Effect */
        .course-card {
          background: rgba(30, 30, 30, 0.9);
          box-shadow: 0 4px 25px rgba(255, 255, 255, 0.2), 
                      0 0 40px rgba(128, 90, 213, 0.5),
                      0 0 80px rgba(255, 127, 80, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          overflow: hidden;
          backdrop-filter: blur(12px);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .course-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 50px rgba(255, 255, 255, 0.4),
                      0 0 60px rgba(128, 90, 213, 0.8),
                      0 0 120px rgba(255, 127, 80, 0.6);
        }

        /* Course Category Section Background */
        .course-category-section {
          background: rgba(0, 0, 0, 0.8);
          padding: 40px 0;
          border-radius: 1rem;
        }

        /* Course Category Buttons */
        .category-button {
          background: rgba(30, 30, 30, 0.7);
          border-radius: 1rem;
          color: white;
          transition: transform 0.1s ease;
        }
        .category-button:hover {
          background: rgba(255, 127, 80, 0.7);
          transform: scale(1.05);
        }

        /* Fade In Effects for Page Load */
        .fade-in {
          opacity: 0;
          animation: fadeIn 2s ease-out forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Smooth scroll content animation */
        .scroll-animation {
          opacity: 0;
          transform: translateY(50px);
          animation: fadeUp 1s ease-out forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 fade-in">
        <div className="lg:w-1/2 lg:pr-12 scroll-animation">
          <h1 className="futuristic-heading mb-4">Learning that gets you</h1>
          <p className="text-xl text-gray-300">Skills for your present and your future. Get Started with US</p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0 scroll-animation">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="course-category-section py-8 px-4 lg:px-8 fade-in">
        <h2 className="text-2xl font-bold mb-6 text-white">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="category-button justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 px-4 lg:px-8 fade-in">
        <h2 className="text-2xl font-bold mb-6 text-white">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="course-card cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2 text-white">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{courseItem?.instructorName}</p>
                  <p className="font-bold text-[16px] text-gray-200">${courseItem?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-white">No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
