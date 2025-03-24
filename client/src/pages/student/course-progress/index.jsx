

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play, RefreshCw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();
  const [progressPercent, setProgressPercent] = useState(0);

  // Fetching course progress
  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  // Updating course progress
  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  // Rewatch course function
  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  // Calculate the completion progress
  useEffect(() => {
    if (studentCurrentCourseProgress?.progress?.length > 0) {
      const totalLectures =
        studentCurrentCourseProgress?.courseDetails?.curriculum.length;
      const completedLectures = studentCurrentCourseProgress?.progress.filter(
        (progress) => progress.viewed
      ).length;
      const progress = (completedLectures / totalLectures) * 100;
      setProgressPercent(progress);
    }
  }, [studentCurrentCourseProgress?.progress]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-tl from-[#111B1E] via-[#6A1B9A] to-[#D500F9] text-white font-['Roboto', sans-serif] transition-all ease-in-out">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#111B1E] border-b border-gray-700 hover:bg-opacity-80 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-black hover:bg-[#6A1B9A] hover:text-white transition-all duration-300"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-semibold hover:text-[#6A1B9A] transition-all">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5 text-white" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}
        >
          {/* Futuristic Video Player */}
          <div className="relative">
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
              className="rounded-lg shadow-2xl"
            />
            <div
              className="absolute top-2 right-2 p-2 rounded-full bg-[#6A1B9A] opacity-80 hover:opacity-100 cursor-pointer"
              onClick={updateCourseProgress}
            >
              <Play className="h-6 w-6 text-white hover:text-black transition-all" />
            </div>
          </div>

          {/* Course Progress Bar */}
          <div className="mt-4 px-6">
            <h3 className="text-xl font-semibold text-white mb-2">Course Progress</h3>
            <div className="h-2 w-full bg-gray-800 rounded-full">
              <div
                className="h-full bg-[#D500F9] rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{`${Math.round(
              progressPercent
            )}% completed`}</p>
          </div>

          <div className="p-6 bg-[#111B1E]">
            <h2 className="text-2xl font-semibold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#111B1E] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#111B1E] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className="text-white rounded-none h-full hover:bg-[#6A1B9A] transition-all"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-white rounded-none h-full hover:bg-[#6A1B9A] transition-all"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className="flex items-center space-x-2 text-sm text-white font-semibold cursor-pointer hover:text-[#6A1B9A] transition-all"
                        key={item._id}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4 text-[#D500F9]" />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">About this course</h2>
                  <p className="text-gray-400">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px] bg-[#111B1E] border-2 border-[#6A1B9A]">
          <DialogHeader>
            <DialogTitle className="text-[#6A1B9A]">Course Completed!</DialogTitle>
            <DialogDescription className="text-gray-400">
              Congratulations! You have completed the course. You can now review and reset your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-[#6A1B9A] border-[#6A1B9A] hover:bg-[#6A1B9A] hover:text-black"
              onClick={handleRewatchCourse}
            >
              Rewatch Course
            </Button>
            <Button
              size="sm"
              className="bg-[#D500F9] text-white hover:bg-[#6A1B9A]"
              onClick={() => setShowCourseCompleteDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lock Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-[#111B1E] border-2 border-[#D500F9]">
          <DialogHeader>
            <DialogTitle className="text-[#D500F9]">You can't view this page</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please purchase this course to get access.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
