"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Anurag",
    position: "Web Developer",
    message:
      "The courses on UpRise have transformed my career. I went from a beginner to a professional web developer in just a few months.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Yashi Pandey",
    position: "Data Scientist",
    message:
      "The data science curriculum is comprehensive and up-to-date. The instructors are knowledgeable and the community support is exceptional.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Anmol",
    position: "UI/UX Designer",
    message:
      "As a designer, I found the courses incredibly practical. The projects helped me build a portfolio that landed me my dream job.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Akshat Palyal",
    position: "Mobile Developer",
    message:
      "The app development track gave me all the skills I needed to launch my own startup. The mentorship was invaluable to my success.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const Testimonials = () => (
  <section className="py-16 sm:py-24 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear from our community of learners who have transformed their careers through our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Quote className="h-4 w-4" />
                  </div>
                </div>

                <p className="text-muted-foreground italic">{testimonial.message}</p>

                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials
