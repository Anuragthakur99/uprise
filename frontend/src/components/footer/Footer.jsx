import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, GraduationCap } from "lucide-react"

const Footer = () => (
  <footer className="bg-card border-t">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">UpRise</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering learners worldwide with quality education and skills for the future.
          </p>
          <div className="flex space-x-4">
            <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
            <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
            <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
            <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/courses" label="Courses" />
            <FooterLink href="/about" label="About Us" />
            <FooterLink href="/login" label="Login" />
            <FooterLink href="/register" label="Register" />
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <ul className="space-y-2">
            <FooterLink href="/courses" label="Web Development" />
            <FooterLink href="/courses" label="App Development" />
            <FooterLink href="/courses" label="Data Science" />
            <FooterLink href="/courses" label="Artificial Intelligence" />
            <FooterLink href="/courses" label="Game Development" />
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Mail className="h-5 w-5 mr-2 mt-0.5 text-primary" />
              <span className="text-sm">support@uprise.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} UpRise Learning Platform. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  </footer>
)

const SocialLink = ({ href, icon, label }) => (
  <Link to={href} className="text-muted-foreground hover:text-primary transition-colors" aria-label={label}>
    {icon}
  </Link>
)

const FooterLink = ({ href, label }) => (
  <li>
    <Link to={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
      {label}
    </Link>
  </li>
)

export default Footer
