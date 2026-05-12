"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Attendance, PremiumStatusResponse } from "@/lib/types";
import Greeting from "@/components/student/Greeting";
import Logo from "@/components/apps/Logo";
import UpgradeToPremiumCard from "@/components/student/UpgradeToPremiumCard";
import HorizontalBar from "@/components/student/HorizontalBar";
import AppCalendar from "@/components/student/Calender";
import BarGraph from "@/components/student/Graph";
import NumberCard from "@/components/student/NumberCard";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatBot from "@/components/student/ChatBot";
import PremiumFeaturesCard from "@/components/student/PremiumFeaturesCard";
import { showErrorMessage } from "@/lib/helper";
import FirstLoginModal from "@/components/student/FirstLoginModal";
import FaceVerificationModal from "@/components/student/FaceVerificationModal";
import DashboardLoader from "@/components/student/DashboardLoader";
import NotificationBell from "@/components/student/NotificationBell";
import {
  faBookOpen,
  faBullhorn,
  faFile,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import NotificationHandler from "@/components/ui/NotificationHandler";
import SideButtons from "@/components/student/SideButtons";

export default function StudentDashboard() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [needsFaceVerification, setNeedsFaceVerification] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatusResponse | null>(null);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("studentId"); // Use the correct key for student
    localStorage.removeItem("lastCampusSlug"); // Also clear the campus slug
    router.push("/auth/login");
  };

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const campusId = localStorage.getItem("CampusID");
    setLoading(true);
    if (!studentId) {
      showErrorMessage("No student ID found, Login Again.");
      setLoading(false);
      return;
    }
    const fetchStudentData = async () => {
      try {
        const detailsRes = await fetch(
          `/api/student/details?studentId=${studentId}&campusId=${campusId}`,
        );
        const detailsData = await detailsRes.json();
        if (!detailsRes.ok) throw new Error("Failed to fetch user details");

        setStudentDetails(detailsData);
        if (!detailsData.avatarUrl) {
          setIsFirstLogin(true);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTodayAttendance = async () => {
      try {
        const res = await fetch(
          `/api/attendance/today?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setTodayAttendance(data || []);
      } catch (error) {
        console.log("Error fetching today's attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `/api/attendance/statistics?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching attendance statistics:", error);
      }
    };
    const fetchPremiumStatus = async () => {
      try {
        const res = await fetch(
          `/api/student/status?studentId=${studentId}&campusId=${campusId}`,
        );
        const data = await res.json();
        setPremiumStatus(data);
      } catch (error) {
        console.error("Error fetching attendance statistics:", error);
      }
    };
    fetchStats();
    fetchTodayAttendance();
    fetchPremiumStatus();
    fetchStudentData();
    setNeedsFaceVerification(true); //!false for development
  }, []);

  const handleAvatarSuccess = (newAvatarUrl: string) => {
    setStudentDetails((prev: any) => ({ ...prev, avatarUrl: newAvatarUrl }));
    setIsFirstLogin(false);
    setNeedsFaceVerification(true);
  };
  const handleFaceVerificationSuccess = () => {
    setNeedsFaceVerification(false);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DashboardLoader />
      </div>
    );
  }

  return (
    <>
      <NotificationHandler userId={localStorage.getItem("studentId") || ""} />
      {isFirstLogin && studentDetails && (
        <FirstLoginModal
          studentId={studentDetails.id}
          onSuccess={handleAvatarSuccess}
        />
      )}
      {needsFaceVerification && studentDetails?.avatarUrl && (
        <FaceVerificationModal
          studentId={studentDetails.id}
          avatarUrl={studentDetails.avatarUrl} // <-- Pass the avatarUrl
          onSuccess={handleFaceVerificationSuccess}
        />
      )}
      <div className="sm:min-h-screen  sm:p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 2xl:w-[25rem]">
            <div className=" lg:block space-y-3  sm:flex">
              <Logo />
              <Greeting />
            </div>
            <Link
              href="/attendance/scan"
              className="sm:block 2xl:h-17 text-center 2xl:text-xl 2xl:pt-4 lg:mt-5 sm:text-center sm:text-sm bg-gray-200/15 border border-gray-300 hover:bg-gray-300/10 hover:text-gray-500 font-semibold sm:px-3 sm:py-3 rounded-xl transition duration-300 ease-in-out shadow-md"
            >
              Scan QR to Mark Attendance
            </Link>

            <div className="bg-gray-100/15 p-4 rounded-xl lg:mt-10 shadow-sm overflow-hidden">
              <h2 className="text-xs 2xl:text-lg font-semibold mb-4">
                📅 Today's Attendance
              </h2>
              <div className="max-h-64 2xl:text-base sm:max-h-80 lg:max-h-96">
                {loading ? (
                  <p className="text-sm">Loading...</p>
                ) : todayAttendance.length > 0 ? (
                  <ul className="space-y-3 overflow-y-auto max-h-full pr-2">
                    {todayAttendance.map((att, idx) => (
                      <li
                        key={idx}
                        className="p-3 sm:p-4 bg-gradient-to-br from-[#070a0f]/80 to-[#243B55]/80 rounded-xl"
                      >
                        <p className="text-sm">
                          <strong>Subject:</strong> {att.subject}
                        </p>
                        <p className="text-sm">
                          <strong>Status:</strong> {att.status}
                        </p>
                        <p className="text-sm">
                          <strong>Marked By:</strong> {att.markedBy}
                        </p>
                        <p className="text-xs text-gray-100 mt-1">
                          {new Date(att.date).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-200 2xl:text-base text-sm">
                    No attendance marked today.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex 2xl:ml-10 flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Middle Section - Navigation Cards */}
            <div className="w-full lg:w-80 2xl:w-[30rem] xl:w-96 flex flex-col space-y-4">
              {premiumStatus?.isPremium ? (
                <PremiumFeaturesCard
                  studentId={localStorage.getItem("studentId") || ""}
                  CampusId={localStorage.getItem("CampusID") || ""}
                />
              ) : (
                <UpgradeToPremiumCard />
              )}
              <div className="sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-1">
                <HorizontalBar
                  content="Check your past attendance records"
                  linkRef="/attendance/history"
                  title="Attendance History"
                />
                <HorizontalBar
                  content="Track upcoming exams and assignment deadlines"
                  linkRef="/dashboard/student/exams"
                  title="Upcoming Exams"
                />
                <HorizontalBar
                  content="See how many classes you can skip safely"
                  linkRef="/attendance/stats"
                  title="Bunk Manager"
                  locked={!premiumStatus?.features.includes("BUNK_MANAGER")}
                />
                <HorizontalBar
                  content="Get a smart study plan based on your upcoming exams"
                  linkRef="/study-plan"
                  title="Study Plan"
                  locked={!premiumStatus?.features.includes("STUDY_PLAN")}
                />
              </div>
            </div>

            {/* Right Section - Charts and Stats */}
            <div className="flex-1 sm:flex-0 2xl:ml-10 flex flex-col space-y-6 relative">
              <div className="flex flex-row-reverse gap-2">
                <div className="flex flex-col gap-5">
                  <NotificationBell />
                  <SideButtons
                    faIcon={faBookOpen}
                    title="View Assignments"
                    link="/dashboard/student/assignments"
                  />
                  <SideButtons
                    faIcon={faBullhorn}
                    title="View Annoucements"
                    link="/dashboard/student/announcements"
                  />
                  <SideButtons
                    faIcon={faBookOpen}
                    title="View Resources"
                    link="/dashboard/student/resources"
                  />
                  <SideButtons
                    faIcon={faMessage}
                    title="View Messages"
                    link="/chat"
                  />
                </div>
                {/* Bar Graph */}
                <div className="w-full">
                  <BarGraph />
                </div>
              </div>
              {/* Calendar and Number Cards */}
              <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 mr-[8rem]">
                <div className="flex-1">
                  <AppCalendar />
                </div>
                <div className="flex sm:ml-9 flex-row xl:flex-col gap-4 xl:gap-6 xl:w-48">
                  <div className="flex-1">
                    <NumberCard
                      title="Lectures Attended"
                      value={
                        isNaN(Number.parseInt(stats?.presents))
                          ? "..."
                          : Number.parseInt(stats?.presents).toString()
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <NumberCard
                      title="Attendance %"
                      value={
                        isNaN(Number.parseInt(stats?.presentPercentage))
                          ? "..."
                          : Number.parseInt(
                              stats?.presentPercentage,
                            ).toString() + "%"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div
                className="fixed 2xl:hidden top-4 right-4 sm:top-6 sm:right-6 lg:absolute lg:top-0 lg:right-[48rem] group cursor-pointer z-10"
                onClick={() => logout()}
              >
                <div className="relative flex flex-col items-center justify-center p-2 rounded-full transition">
                  <LogOut className="text-cyan-300 w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute top-full mt-1 px-2 py-1 text-xs rounded bg-cyan-500 text-white opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                    Logout
                  </span>
                </div>
              </div>
              <div className="2xl:flex 2xl:gap-13">
                <div
                  className="hidden gap-4 items-center justify-center ring hover:ring-2 w-56 p-3 ml-2 rounded-2xl bg-white/10 backdrop-blur-lg ring-blue-300 transition-all duration-300 hover:bg-blue-500 cursor-pointer 2xl:flex"
                  onClick={() => logout()}
                >
                  <LogOut
                    size={50}
                    className="text-cyan-300 mt-1 text-xl w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <span className="text-xl">Logout</span>
                </div>

                {premiumStatus?.features?.includes("AI_CHATBOT") && (
                  <div
                    className="hidden gap-4 items-center justify-center ring hover:ring-2 w-56 p-3 ml-2 rounded-2xl bg-white/10 backdrop-blur-lg ring-blue-300 transition-all duration-300 hover:bg-blue-500 cursor-pointer 2xl:flex"
                    onClick={() => router.push("/dashboard/student/chat")}
                  >
                    <span className="text-xl">Chat AI</span>
                  </div>
                )}
              </div>
              {/* ChatBot - Only show on larger screens or make it responsive */}
              {premiumStatus?.features?.includes("AI_CHATBOT") && (
                <div className="hidden 2xl:hidden lg:block">
                  <ChatBot />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile ChatBot - Show at bottom on smaller screens */}
        {premiumStatus?.features?.includes("AI_CHATBOT") && (
          <div className="lg:hidden 2xl:hidden fixed bottom-4 right-4 z-20">
            <ChatBot />
          </div>
        )}
      </div>
    </>
  );
}
