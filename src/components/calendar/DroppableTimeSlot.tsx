"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import type { TimeSlot } from "./DragDropCalendar";

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
				isOver ? "border-blue-200 bg-blue-50" : ""
			}`}
		>
			{children}

			{/* Drop indicator */}
			{isOver && (
				<div className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-blue-400 border-dashed bg-blue-50 bg-opacity-50">
					<div className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm">
						Drop appointment here
					</div>
				</div>
			)}

			{/* Empty slot indicator */}
			{timeSlot.appointments.length === 0 && !isOver && (
				<div
					className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
					onClick={handleAddAppointment}
				>
					<div className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm transition-colors hover:bg-gray-200">
						<Plus className="h-3 w-3" />
						<span>Add appointment</span>
					</div>
				</div>
			)}
		</div>
	);
}
