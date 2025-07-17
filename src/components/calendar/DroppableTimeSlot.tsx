"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { TimeSlot } from "./DragDropCalendar";

interface DroppableTimeSlotProps {
	timeSlot: TimeSlot;
	onNewAppointment: (timeSlot: string, date: Date) => void;
	children: React.ReactNode;
}

export function DroppableTimeSlot({
	timeSlot,
	onNewAppointment,
	children,
}: DroppableTimeSlotProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: timeSlot.id,
	});

	const handleAddAppointment = () => {
		onNewAppointment(timeSlot.time, timeSlot.date);
	};

	return (
		<div
			ref={setNodeRef}
			className={`relative transition-colors ${
				isOver ? "bg-blue-50 border-blue-200" : ""
			}`}
		>
			{children}
			
			{/* Drop indicator */}
			{isOver && (
				<div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center">
					<div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
						Drop appointment here
					</div>
				</div>
			)}
			
			{/* Empty slot indicator */}
			{timeSlot.appointments.length === 0 && !isOver && (
				<div 
					className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
					onClick={handleAddAppointment}
				>
					<div className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center space-x-1 transition-colors">
						<Plus className="h-3 w-3" />
						<span>Add appointment</span>
					</div>
				</div>
			)}
		</div>
	);
}
