import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { FileText, CheckSquare, List, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AppCard_FLRTSProps {
  id: string;
  title: string;
  description: string;
  beta?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
}
export function AppCard_FLRTS({
  id,
  title,
  description,
  beta,
  disabled = false,
  comingSoon
}: AppCard_FLRTSProps) {
  const navigate = useNavigate();
  const flrtsLinks = [{
    title: 'Field Reports',
    icon: FileText,
    href: '/reports',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }, {
    title: 'Lists',
    icon: List,
    href: '/lists',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }, {
    title: 'Tasks',
    icon: CheckSquare,
    href: '/tasks',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }, {
    title: 'Reminders',
    icon: Bell,
    href: '/tasks',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }];
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the card background
    e.stopPropagation();
  };
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    if (!disabled) {
      navigate(href);
    }
  };
  return <Card className={cn('relative overflow-hidden transition-all', disabled && 'opacity-60 cursor-not-allowed', !disabled && 'hover:shadow-lg cursor-pointer')} onClick={handleCardClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-8 h-8" />
          </div>
          <div className="flex gap-2">
            {beta && <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                Beta
              </Badge>}
            {comingSoon && <Badge variant="secondary">Coming Soon</Badge>}
          </div>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {flrtsLinks.map(link => {
          const Icon = link.icon;
          return <div key={link.title} className={cn('flex flex-col items-center justify-center p-3 rounded-lg transition-all', 'hover:scale-105 hover:shadow-sm', link.bgColor, disabled && 'pointer-events-none', 'cursor-pointer')} onClick={e => handleLinkClick(e, link.href)}>
                <Icon className={cn('w-6 h-6 mb-1', link.color)} />
                <span className={cn('text-xs font-medium', link.color)}>
                  {link.title}
                </span>
              </div>;
        })}
        </div>
      </CardContent>
    </Card>;
}