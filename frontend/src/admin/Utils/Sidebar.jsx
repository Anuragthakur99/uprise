import { Link, useLocation } from "react-router-dom"
import { UserData } from "../../context/UserContext"
import { LayoutDashboard, BookOpen, Users, LogOut, ChevronRight, FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

const Sidebar = () => {
  const { user } = UserData()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="h-full w-64 border-r bg-card">
      <div className="flex flex-col h-full py-4">
        <div className="px-4 py-2 mb-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>

        <nav className="space-y-1 px-2 flex-1">
          <NavItem
            to="/admin/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={isActive("/admin/dashboard")}
          />

          <NavItem
            to="/admin/course"
            icon={<BookOpen size={18} />}
            label="Courses"
            active={isActive("/admin/course")}
          />

          <NavItem
            to="/admin/quiz"
            icon={<FileQuestion size={18} />}
            label="Quizzes"
            active={isActive("/admin/quiz")}
          />

          {user && user.mainrole === "superadmin" && (
            <NavItem to="/admin/users" icon={<Users size={18} />} label="Users" active={isActive("/admin/users")} />
          )}
        </nav>

        <div className="px-2 py-4 mt-auto border-t">
          <NavItem to="/account" icon={<LogOut size={18} />} label="Back to Account" active={false} />
        </div>
      </div>
    </div>
  )
}

const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
    )}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
    <ChevronRight
      size={16}
      className={cn("ml-auto transition-transform", active ? "opacity-100 rotate-90" : "opacity-0")}
    />
  </Link>
)

export default Sidebar
