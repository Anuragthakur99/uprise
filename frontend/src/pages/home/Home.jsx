"use client"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Layers, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Testimonials from "@/components/testimonials/Testimonials"

export default function Home() {
  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Elevate Your Learning Journey
            </h1>
            <p className="text-lg sm:text-xl text-gray-200">
              Discover expert-led courses designed to help you master new skills and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/courses" className="inline-flex items-center justify-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Link to="/about" className="inline-flex items-center justify-center">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose UpRise?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a comprehensive learning experience with features designed to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<GraduationCap className="h-10 w-10 text-primary" />}
              title="Expert Instructors"
              description="Learn from industry professionals with years of experience in their fields."
            />
            <FeatureCard
              icon={<Layers className="h-10 w-10 text-primary" />}
              title="Diverse Course Catalog"
              description="Explore a wide range of subjects from web development to data science."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Community Support"
              description="Join a community of learners and get help whenever you need it."
            />
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
