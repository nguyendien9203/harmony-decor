import { useAuth } from "@/hooks/use-auth";
import { useNavigate, NavLink } from "react-router-dom";
import { getAccountMenuItems } from "@/constants/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AccountSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = getAccountMenuItems(logout, navigate);

  return (
    <aside className="hidden md:block w-full md:w-64 bg-white border p-4 space-y-6 rounded-2xl">
      <div className="text-center flex items-center w-full">
        <div className="flex items-center gap-2 w-full">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={user.avatar || "https://i.pravatar.cc/100"}
              alt="avatar"
            />
            <AvatarFallback>AVT</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-sm">
            Xin chào, {user?.name || "Tài khoản"}
          </p>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-col space-y-1 text-sm">
        {menuItems.map(({ label, path, onClick }, i) =>
          onClick ? (
            <button
              key={i}
              onClick={onClick}
              className="text-left px-3 py-2 rounded-md hover:bg-muted"
            >
              {label}
            </button>
          ) : (
            <NavLink
              key={i}
              to={`/${path}`}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md ",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )
              }
            >
              {label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
};

export default AccountSidebar;
