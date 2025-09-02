export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          type: 'Truck' | 'Van' | 'Motorcycle' | 'Car'
          location_base: 'Depot A' | 'Depot B' | 'Field Office'
          mileage: number
          last_service_date: string
          service_interval: 'Weekly' | 'Bi-weekly' | 'Monthly'
          status: 'Active' | 'In Service' | 'Out of Service'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          type: 'Truck' | 'Van' | 'Motorcycle' | 'Car'
          location_base: 'Depot A' | 'Depot B' | 'Field Office'
          mileage: number
          last_service_date: string
          service_interval: 'Weekly' | 'Bi-weekly' | 'Monthly'
          status?: 'Active' | 'In Service' | 'Out of Service'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'Truck' | 'Van' | 'Motorcycle' | 'Car'
          location_base?: 'Depot A' | 'Depot B' | 'Field Office'
          mileage?: number
          last_service_date?: string
          service_interval?: 'Weekly' | 'Bi-weekly' | 'Monthly'
          status?: 'Active' | 'In Service' | 'Out of Service'
          created_at?: string
          updated_at?: string
        }
      }
      technicians: {
        Row: {
          id: string
          name: string
          assigned_depots: string[]
          active_task_count: number
          max_tasks: number
          email: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          assigned_depots: string[]
          active_task_count?: number
          max_tasks?: number
          email: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          assigned_depots?: string[]
          active_task_count?: number
          max_tasks?: number
          email?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_tasks: {
        Row: {
          id: string
          vehicle_id: string
          technician_id: string | null
          title: string
          description: string
          priority: 'Low' | 'Medium' | 'High' | 'Critical'
          status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue'
          scheduled_date: string
          completed_date: string | null
          estimated_duration: number
          before_photos: string[]
          after_photos: string[]
          parts_used: Json
          digital_signature: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          vehicle_id: string
          technician_id?: string | null
          title: string
          description: string
          priority: 'Low' | 'Medium' | 'High' | 'Critical'
          status?: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue'
          scheduled_date: string
          completed_date?: string | null
          estimated_duration?: number
          before_photos?: string[]
          after_photos?: string[]
          parts_used?: Json
          digital_signature?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          technician_id?: string | null
          title?: string
          description?: string
          priority?: 'Low' | 'Medium' | 'High' | 'Critical'
          status?: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue'
          scheduled_date?: string
          completed_date?: string | null
          estimated_duration?: number
          before_photos?: string[]
          after_photos?: string[]
          parts_used?: Json
          digital_signature?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}