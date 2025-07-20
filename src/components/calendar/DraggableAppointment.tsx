"use client";

import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, MapPin, User } from "lucide-react";
import type { Appointment } from "./DragDropCalendar";

interface DraggableAppointmentProps {
	appointment: Appointment;
	onClick: () => void;
	statusColor: string;
}

export function DraggableAppointment({
	appointment,
	onClick,
	statusColor,
}: DraggableAppointmentProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: appointment.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const duration = Math.round(
		(appointment.end.getTime() - appointment.start.getTime()) / (1000 * 60),
	);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`group relative cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md ${
				isDragging ? "opacity-50 shadow-lg" : ""
			} ${statusColor}`}
			onClick={onClick}
			{...attributes}
		>
			{/* Drag Handle */}
			<div
				{...listeners}
				className="-translate-y-1/2 absolute top-1/2 left-1 cursor-grab opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
			>
				<GripVertical className="h-4 w-4 text-gray-400" />
			</div>

			<div className="ml-6 space-y-2">
				{/* Patient Name and Status */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<User className="h-4 w-4 text-gray-500" />
						<span className="font-medium text-gray-900 text-sm">
							{appointment.patient.name}
						</span>
					</div>
					{appointment.isRecurring && (
						<Badge variant="outline" className="text-xs">
							Recurring
						</Badge>
					)}
				</div>

				{/* Treatment and Duration */}
				<div className="space-y-1">
					<div className="text-gray-700 text-sm">{appointment.treatment}</div>
					<div className="flex items-center space-x-4 text-gray-500 text-xs">
						<div className="flex items-center space-x-1">
							<Clock className="h-3 w-3" />
							<span>{duration} min</span>
						</div>
						<div className="flex items-center space-x-1">
							<MapPin className="h-3 w-3" />
							<span>{appointment.room}</span>
						</div>
					</div>
				</div>

				{/* Provider */}
				<div className="text-gray-600 text-xs">with {appointment.provider}</div>

				{/* Status Indicator */}
				<div className="flex items-center justify-between">
					<div className="text-gray-500 text-xs">
						{appointment.start.toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "2-digit",
						})}{" "}
						-{" "}
						{appointment.end.toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "2-digit",
						})}
					</div>
					<div
						className={`h-2 w-2 rounded-full ${getStatusDotColor(appointment.status)}`}
					/>
				</div>
			</div>

			{/* Hover Actions */}
			<div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
				<div className="flex space-x-1">
					<button
						type="button"
						className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						onClick={(e) => {
							e.stopPropagation();
							// Handle edit action
						}}
					>
						<svg
							className="h-3 w-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

function getStatusDotColor(status: Appointment["status"]): string {
	switch (status) {
		case "confirmed":
			return "bg-blue-500";
		case "pending":
			return "bg-yellow-500";
		case "checked-in":
			return "bg-green-500";
		case "completed":
			return "bg-gray-500";
		case "cancelled":
			return "bg-red-500";
		case "no-show":
			return "bg-orange-500";
		default:
			return "bg-gray-400";
	}
}
