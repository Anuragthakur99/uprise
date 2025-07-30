"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../main"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, Users, Video, TrendingUp, BarChart } from "lucide-react"
import Layout from "../Utils/Layout"

export default function AdminDashboard({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCoures: 0,
    totalLectures: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/")
    } else {
      fetchStats()
    }
  }, [user, navigate])

  async function fetchStats() {
    try {
      setLoading(true)
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Stats"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Courses"
            value={stats.totalCoures}
            description="All courses on the platform"
            icon={<BookOpen className="h-8 w-8 text-primary" />}
          />
          <StatsCard
            title="Total Lectures"
            value={stats.totalLectures}
            description="All lectures across courses"
            icon={<Video className="h-8 w-8 text-primary" />}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            description="Registered platform users"
            icon={<Users className="h-8 w-8 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Growth
              </CardTitle>
              <CardDescription>Monthly user and course growth</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Growth chart will appear here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Course Enrollments
              </CardTitle>
              <CardDescription>Most popular courses by enrollment</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Enrollment chart will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

function StatsCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
