import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Home, Wrench, Settings, LogOut, User, ChevronDown, FileText, Database, Download, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const user = {
  name: 'John Doe',
  email: 'john@10netzero.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'JD'
};
export function TopNav() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Logout logic would go here
    console.log('Logging out...');
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Left side - Logo/Home */}
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2" onClick={e => {
          e.preventDefault();
          navigate('/');
        }}>
            <span className="font-bold">10NetZero</span>
          </a>
        </div>
        {/* Center - Navigation (optional, can be removed for single-layer nav) */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </nav>
          {/* Right side - Tools, Settings, Profile */}
          <div className="flex items-center space-x-4">
            {/* Tools Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  <Wrench className="mr-2 h-4 w-4" />
                  Tools
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export Reports
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Database className="mr-2 h-4 w-4" />
                  Backup Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download Logs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Terminal className="mr-2 h-4 w-4" />
                  Developer Console
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Settings Button */}
            <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>;
}