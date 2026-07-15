import { apiClient } from '@/api/client';

export interface MasterTimeSlotRequest {
  slotDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  isBooked: boolean;
}

export interface MasterTimeSlotResponse {
  id?: number;
  organizationId: number;
  masterId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export async function getTimeSlots(): Promise<MasterTimeSlotResponse[]> {
  return await apiClient.get(
    '/master-time-slot/get-by-master-and-organization',
  );
}

export async function createTimeSlot(
  data: MasterTimeSlotRequest,
): Promise<MasterTimeSlotResponse> {
  const payload = {
    ...data,
    startTime:
      data.startTime.includes(':') && data.startTime.split(':').length === 2
        ? `${data.startTime}:00`
        : data.startTime,
    endTime:
      data.endTime.includes(':') && data.endTime.split(':').length === 2
        ? `${data.endTime}:00`
        : data.endTime,
  };
  return await apiClient.post('/master-time-slot', payload);
}

export async function deleteTimeSlot(
  id: number,
): Promise<{ message: string; id: number }> {
  return await apiClient.delete(`/master-time-slot/${id}`);
}
