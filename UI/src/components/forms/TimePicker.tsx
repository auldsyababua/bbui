import React, { useRef } from 'react';
import { Clock } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}
export function TimePickerDemo({
  date,
  setDate
}: TimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const handleTimeChange = (newTime: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    if (!date) return;
    const newDate = new Date(date);
    if (newTime.hours !== undefined) newDate.setHours(newTime.hours);
    if (newTime.minutes !== undefined) newDate.setMinutes(newTime.minutes);
    if (newTime.seconds !== undefined) newDate.setSeconds(newTime.seconds);
    setDate(newDate);
  };
  return <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <Clock className="mr-2 h-4 w-4" />
          {date ? format(date, 'h:mm a') : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="grid gap-1">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <Input ref={hourRef} id="hours" className="w-16" value={date ? date.getHours() : 12} onChange={e => {
              const hours = parseInt(e.target.value);
              if (isNaN(hours) || hours < 0 || hours > 23) return;
              handleTimeChange({
                hours
              });
              if (e.target.value.length === 2) {
                minuteRef.current?.focus();
              }
            }} max={23} min={0} type="number" />
            </div>
            <span className="text-xl mb-1.5">:</span>
            <div className="grid gap-1">
              <Label htmlFor="minutes" className="text-xs">
                Minutes
              </Label>
              <Input ref={minuteRef} id="minutes" className="w-16" value={date ? date.getMinutes() : 0} onChange={e => {
              const minutes = parseInt(e.target.value);
              if (isNaN(minutes) || minutes < 0 || minutes > 59) return;
              handleTimeChange({
                minutes
              });
              if (e.target.value.length === 2) {
                secondRef.current?.focus();
              }
            }} max={59} min={0} type="number" />
            </div>
            <span className="text-xl mb-1.5">:</span>
            <div className="grid gap-1">
              <Label htmlFor="seconds" className="text-xs">
                Seconds
              </Label>
              <Input ref={secondRef} id="seconds" className="w-16" value={date ? date.getSeconds() : 0} onChange={e => {
              const seconds = parseInt(e.target.value);
              if (isNaN(seconds) || seconds < 0 || seconds > 59) return;
              handleTimeChange({
                seconds
              });
            }} max={59} min={0} type="number" />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => {
            const now = new Date();
            setDate(now);
          }}>
              Now
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => {
              if (!date) return;
              const newDate = new Date(date);
              newDate.setHours(9, 0, 0);
              setDate(newDate);
            }}>
                9:00 AM
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
              if (!date) return;
              const newDate = new Date(date);
              newDate.setHours(12, 0, 0);
              setDate(newDate);
            }}>
                12:00 PM
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
              if (!date) return;
              const newDate = new Date(date);
              newDate.setHours(17, 0, 0);
              setDate(newDate);
            }}>
                5:00 PM
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>;
}