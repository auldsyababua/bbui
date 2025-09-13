import React from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Menu, Home, Settings, User, LogOut, FileText, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const user = {
  name: 'John Doe',
  email: 'john@10netzero.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'JD'
};
export function MobileNav() {
  const navigate = useNavigate();
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur md:hidden">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] sm:w-[385px]">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="flex items-center space-x-2 text-lg font-semibold" onClick={e => {
              e.preventDefault();
              navigate('/');
            }}>
                10NetZero
              </a>
              <Separator />
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground px-2">
                  Tools
                </h4>
                <Button variant="ghost" className="justify-start w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
                <Button variant="ghost" className="justify-start w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Data
                </Button>
              </div>
              <Separator />
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Separator />
              <Button variant="ghost" className="justify-start text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center">
          <span className="font-semibold cursor-pointer" onClick={() => navigate('/')}>
            10NetZero
          </span>
        </div>
        <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate('/profile')}>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>;
}