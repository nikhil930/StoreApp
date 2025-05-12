import { auth } from "@/auth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.action";
import { UserIcon } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon className="mr-2" />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex-center justify-center bg-gray-200"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" forceMount align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuContent>
        <DropdownMenuItem className="p-0 mb-1">
          <form action={signOutUser} className="w-full">
            <Button
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
