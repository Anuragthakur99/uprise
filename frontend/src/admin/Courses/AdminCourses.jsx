"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CourseData } from "../../context/CourseContext"
import CourseCard from "../../components/coursecard/CourseCard"
import toast from "react-hot-toast"
import axios from "axios"
import { server } from "../../main"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Upload } from "lucide-react"
import Layout from "../Utils/Layout"

const categories = ["Web Development", "App Development", "Game Development", "Data Science", "Artificial Intelligence"]

const AdminCourses = ({ user }) => {
  const navigate = useNavigate()

  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (user && user.role === "admin") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      navigate("/")
    }
  }, [user, navigate])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [createdBy, setCreatedBy] = useState("")
  const [duration, setDuration] = useState("")
  const [image, setImage] = useState("")
  const [imagePrev, setImagePrev] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  const changeImageHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setImagePrev(reader.result)
      setImage(file)
    }
  }

  const { courses, fetchCourses } = CourseData()

  const submitHandler = async (e) => {
    e.preventDefault()
    setBtnLoading(true)

    const myForm = new FormData()

    myForm.append("title", title)
    myForm.append("description", description)
    myForm.append("category", category)
    myForm.append("price", price)
    myForm.append("createdBy", createdBy)
    myForm.append("duration", duration)
    myForm.append("file", image)

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })

      toast.success(data.message)
      setBtnLoading(false)
      await fetchCourses()
      setImage("")
      setTitle("")
      setDescription("")
      setDuration("")
      setImagePrev("")
      setCreatedBy("")
      setPrice("")
      setCategory("")
    } catch (error) {
      toast.error(error.response.data.message)
      setBtnLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Course Management</h1>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="add">Add New Course</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>Manage your existing courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground mb-4">No courses available yet</p>
                      <Button onClick={() => document.querySelector('[data-value="add"]').click()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Course
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
                <CardDescription>Create a new course for your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitHandler} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter course title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter course price"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (weeks)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter course duration"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdBy">Instructor</Label>
                      <Input
                        id="createdBy"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        placeholder="Enter instructor name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Course Image</Label>
                      <div className="border rounded-md p-2">
                        <Input
                          id="image"
                          type="file"
                          onChange={changeImageHandler}
                          className="cursor-pointer"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended size: 1280x720px (16:9 ratio)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter course description"
                      rows={5}
                      required
                    />
                  </div>

                  {imagePrev && (
                    <div className="mt-4 border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">Image Preview</p>
                      <img
                        src={imagePrev || "/placeholder.svg"}
                        alt="Course Preview"
                        className="rounded-md max-w-full h-auto max-h-[200px] object-cover"
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={btnLoading} className="w-full">
                    {btnLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Course...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Create Course
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default AdminCourses
