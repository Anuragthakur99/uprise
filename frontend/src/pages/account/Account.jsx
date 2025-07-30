"use client"

import { useNavigate } from "react-router-dom"
import { UserData } from "../../context/UserContext"
import { motion } from "framer-motion"
import { LayoutDashboard, LogOut, Shield, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { CourseData } from "../../context/CourseContext"

export default function Account({ user }) {
  const { setIsAuth, setUser } = UserData()
  const { mycourse } = CourseData()
  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.clear()
    setUser([])
    setIsAuth(false)
    toast.success("Logged Out Successfully")
    navigate("/login")
  }

  if (!user) return null

  // Calculate join date
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 bg-primary/10 text-primary ring-4 ring-background mt-4">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {user.role === "admin" ? "Administrator" : "Student"}
              </div>

              <Separator className="my-6" />

              <div className="w-full space-y-2">
                <InfoItem icon={<Calendar className="h-4 w-4" />} label="Joined" value={joinDate} />
                <InfoItem
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Courses Enrolled"
                  value={mycourse?.length || 0}
                />
              </div>

              <Separator className="my-6" />

              <div className="grid w-full gap-3">
                <Button variant="outline" onClick={() => navigate(`/${user._id}/dashboard`)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Dashboard
                </Button>

                {user.role === "admin" && (
                  <Button variant="outline" onClick={() => navigate(`/admin/dashboard`)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                )}

                <Button variant="destructive" onClick={logoutHandler}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField label="Full Name" value={user.name} />
                    <ProfileField label="Email Address" value={user.email} />
                    <ProfileField label="Account Type" value={user.role === "admin" ? "Administrator" : "Student"} />
                    <ProfileField label="Member Since" value={joinDate} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Learning Progress</h3>
                  <div className="bg-muted rounded-lg p-6 text-center">
                    {mycourse && mycourse.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Courses Enrolled" value={mycourse.length} description="Total courses" />
                        <StatCard title="In Progress" value={mycourse.length} description="Currently learning" />
                        <StatCard title="Completed" value="0" description="Finished courses" />
                      </div>
                    ) : (
                      <div className="py-8">
                        <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                        <Button onClick={() => navigate("/courses")}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Browse Courses
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center text-muted-foreground">
      {icon}
      <span className="ml-2 text-sm">{label}</span>
    </div>
    <span className="text-sm font-medium">{value}</span>
  </div>
)

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
)

const StatCard = ({ title, value, description }) => (
  <div className="bg-background rounded-md p-4 shadow-sm">
    <p className="text-3xl font-bold">{value}</p>
    <p className="font-medium">{title}</p>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
)
