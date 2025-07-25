import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { BoxIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AppCardProps {
  id: string;
  title: string;
  description: string;
  icon: BoxIcon;
  accentColor: string;
  beta?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  path: string;
}
export function AppCard({
  id,
  title,
  description,
  icon: Icon,
  accentColor,
  beta,
  disabled,
  comingSoon,
  path
}: AppCardProps) {
  const navigate = useNavigate();
  const getAccentColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-700';
      case 'green':
        return 'bg-green-100 text-green-700';
      case 'purple':
        return 'bg-purple-100 text-purple-700';
      case 'orange':
        return 'bg-orange-100 text-orange-700';
      case 'teal':
        return 'bg-teal-100 text-teal-700';
      case 'red':
        return 'bg-red-100 text-red-700';
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const handleClick = () => {
    if (!disabled) {
      navigate(path);
    }
  };
  return <Card className={cn('relative overflow-hidden transition-all hover:shadow-lg cursor-pointer', disabled && 'opacity-60 cursor-not-allowed')} onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={cn('p-2 w-12 h-12 rounded-lg', getAccentColor(accentColor))}>
            <Icon className="w-8 h-8" />
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
    </Card>;
}