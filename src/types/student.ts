export type EnrollmentStatus = 'ACTIVE' | 'PROBATION' | 'GRADUATED' | 'SUSPENDED' | 'WITHDRAWN';
export type AcademicYear = 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'GRADUATE';

export interface Student {
  id: number;
  studentId: string; // e.g., "STU-2024-8891"
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  academicYear: AcademicYear;
  gpa: number; // 0.00 to 4.00
  enrollmentStatus: EnrollmentStatus;
  dateOfBirth: string; // YYYY-MM-DD
  creditsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  academicYear: AcademicYear;
  gpa: number;
  enrollmentStatus?: EnrollmentStatus;
  dateOfBirth: string;
  creditsCompleted?: number;
}

export interface FieldError {
  field: string;
  rejectedValue: any;
  message: string;
}

export interface SpringBootErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: FieldError[];
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface QueryLog {
  id: string;
  timestamp: string;
  sql: string;
  parameters: string[];
  executionTimeMs: number;
}
