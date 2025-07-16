// "use client";

// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Plus, User, Settings, LogOut } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface OrgNavbarProps {
//   onCreateBounty?: () => void;
// }

// export function OrgNavbar({ onCreateBounty }: OrgNavbarProps) {
//   const router = useRouter();

//   const handleSignOut = () => {
//     localStorage.removeItem("bountifi_user");
//     router.push("/");
//   };

//   return (
//     <nav className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center justify-between px-8 relative z-10">
//       <div className="flex items-center space-x-4">
//         {onCreateBounty && (
//           <Button
//             onClick={onCreateBounty}
//             className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold neon-glow transition-all duration-300 hover:scale-105"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Create Bounty
//           </Button>
//         )}
//       </div>

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//             <Avatar className="h-10 w-10 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-colors">
//               <AvatarFallback className="bg-neon-blue/20 text-neon-blue font-semibold">
//                 O
//               </AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className="w-56 bg-card/90 backdrop-blur-sm border-border"
//           align="end"
//         >
//           <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
//             <User className="mr-2 h-4 w-4" />
//             Profile
//           </DropdownMenuItem>
//           <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
//             <Settings className="mr-2 h-4 w-4" />
//             Settings
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             className="hover:bg-muted/50 focus:bg-muted/50 text-red-400"
//             onClick={handleSignOut}
//           >
//             <LogOut className="mr-2 h-4 w-4" />
//             Sign Out
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </nav>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔹 Import Web3Modal Connect Button
import { Web3Button } from "@web3modal/wagmi/react"; // optional: alias w3m-button

interface OrgNavbarProps {
  onCreateBounty?: () => void;
}

export function OrgNavbar({ onCreateBounty }: OrgNavbarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("bountifi_user");
    router.push("/");
  };

  return (
    <nav className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center justify-between px-8 relative z-10">
      <div className="flex items-center space-x-4">
        {onCreateBounty && (
          <Button
            onClick={onCreateBounty}
            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold neon-glow transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Bounty
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* ✅ Web3Modal wallet connect button */}
        <w3m-button />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-colors">
                <AvatarFallback className="bg-neon-blue/20 text-neon-blue font-semibold">
                  O
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-card/90 backdrop-blur-sm border-border"
            align="end"
          >
            <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 focus:bg-muted/50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted/50 focus:bg-muted/50 text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
