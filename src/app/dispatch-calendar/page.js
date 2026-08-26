'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { supabase } from '@/lib/supabase'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ScheduleDetailsModal from "@/components/ScheduleDetailsModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import toast from 'react-hot-toast'

export default function DispatchCalendar() {

const [events, setEvents] = useState([])
const [selectedSchedule, setSelectedSchedule] = useState(null)
const [scheduleToDelete, setScheduleToDelete] = useState(null)
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    loadSchedules()
  }, [])

  async function loadSchedules() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } =
      await supabase
        .from('Profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!profile) return

    const { data: schedules } =
      await supabase
        .from('Schedules')
        .select('*')
        .eq(
          'organization_id',
          profile.organization_id
        )

    const { data: meters } =
      await supabase
        .from('meters')
        .select(`
          id,
          meter_id_tag,
          location
        `)

    const { data: technicianList } =
  await supabase
    .from("Technicians")
    .select(`
      id,
      name
    `)

    setTechnicians(technicianList || []);

    const calendarEvents =
      (schedules || []).map(schedule => {

        const meter =
          meters?.find(
            m => m.id === schedule.meter_id
          )

        const technician =
  technicianList?.find(
    t => t.id === schedule.technician_id
  )

        return {

          id: schedule.id,

          title:
            `${meter?.meter_id_tag || 'Meter'} - ${technician?.name || 'Unassigned'}`,

          start: schedule.scheduled_date,

          allDay: true,

          backgroundColor:
            schedule.status === 'Completed'
              ? '#22c55e'
              : '#3b82f6',

          borderColor:
            schedule.status === 'Completed'
              ? '#22c55e'
              : '#3b82f6',

          extendedProps: {

            schedule: {

              ...schedule,

              meterTag:
                meter?.meter_id_tag,

              location:
                meter?.location,

              technician:
                technician?.name,

            }

          }

        }

      })

    setEvents(calendarEvents)

  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>

          Dispatch Calendar

        </h1>

        <br />

       <div
  className="card"
  style={{
    padding: "20px",
  }}
>

  <FullCalendar

    plugins={[
      dayGridPlugin,
      interactionPlugin,
    ]}

    initialView="dayGridMonth"

    height="auto"

    events={events}

    eventClick={(info) => {

      setSelectedSchedule(
        info.event.extendedProps.schedule
      )

    }}

  />

</div>

        <ScheduleDetailsModal
  technicians={technicians}
          open={!!selectedSchedule}
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onStartProve={() => {
            window.location.href = `/log-prove?id=${selectedSchedule.meter_id}`;
          }}
          onEdit={async (updatedSchedule) => {

            const { error } = await supabase
              .from("Schedules")
              .update({
  technician_id: updatedSchedule.technician_id,
  scheduled_date: updatedSchedule.scheduled_date,
  scheduled_time: updatedSchedule.scheduled_time,
  notes: updatedSchedule.notes,
  status: updatedSchedule.status,
})
              .eq("id", updatedSchedule.id);

            if (error) {
              console.error(error);
              toast.error("Unable to update schedule.");
              return;
            }

            await loadSchedules();

            setSelectedSchedule(null);

            toast.success("Schedule updated successfully!");

          }}
          onDelete={() => {

  setScheduleToDelete(selectedSchedule);

  setSelectedSchedule(null);

  setShowDeleteModal(true);

}}
        />

        <DeleteConfirmModal
          open={showDeleteModal}
          title="Delete Schedule"
          message={
  scheduleToDelete
    ? `Are you sure you want to delete the scheduled job for "${scheduleToDelete.meterTag}"? This action cannot be undone.`
    : ""
}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {

           if (!scheduleToDelete) return;

const { error } = await supabase
  .from("Schedules")
  .delete()
  .eq("id", scheduleToDelete.id);

            if (error) {
              console.error(error);
              toast.error("Unable to delete schedule.");
              return;
            }

            setShowDeleteModal(false);

setScheduleToDelete(null);

setSelectedSchedule(null);

await loadSchedules();

           toast.success("Schedule deleted successfully!");

          }}
        />

      </div>

    </ProtectedRoute>

  )

}