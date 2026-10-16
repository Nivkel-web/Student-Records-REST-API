import {
  Student,
  StudentRequestDto,
  SpringBootErrorResponse,
  FieldError,
  PagedResponse,
  QueryLog,
  EnrollmentStatus,
} from '../types/student';
import { INITIAL_STUDENTS } from '../data/mockStudents';

export interface HttpResponse<T> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  latencyMs: number;
}

class SpringBootSimulator {
  private students: Student[] = [...INITIAL_STUDENTS];
  private nextId = 109;
  private queryLogs: QueryLog[] = [];

  constructor() {
    this.addLog('SELECT * FROM students s1_0 ORDER BY s1_0.id ASC', []);
  }

  private addLog(sql: string, parameters: string[] = []): void {
    const log: QueryLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      sql: `Hibernate: ${sql}`,
      parameters,
      executionTimeMs: Math.floor(Math.random() * 8) + 2,
    };
    this.queryLogs.unshift(log);
    if (this.queryLogs.length > 30) {
      this.queryLogs.pop();
    }
  }

  public getQueryLogs(): QueryLog[] {
    return this.queryLogs;
  }

  public resetData(): void {
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.nextId = 109;
    this.addLog('/* Reset In-Memory Database */ TRUNCATE TABLE students; INSERT INTO students (...) VALUES (...)', []);
  }

  public validateRequest(dto: Partial<StudentRequestDto>): FieldError[] {
    const errors: FieldError[] = [];

    // firstName
    if (!dto.firstName || dto.firstName.trim().length === 0) {
      errors.push({
        field: 'firstName',
        rejectedValue: dto.firstName ?? '',
        message: 'First name is mandatory and cannot be empty',
      });
    } else if (dto.firstName.trim().length < 2 || dto.firstName.trim().length > 50) {
      errors.push({
        field: 'firstName',
        rejectedValue: dto.firstName,
        message: 'First name must be between 2 and 50 characters',
      });
    }

    // lastName
    if (!dto.lastName || dto.lastName.trim().length === 0) {
      errors.push({
        field: 'lastName',
        rejectedValue: dto.lastName ?? '',
        message: 'Last name is mandatory and cannot be empty',
      });
    } else if (dto.lastName.trim().length < 2 || dto.lastName.trim().length > 50) {
      errors.push({
        field: 'lastName',
        rejectedValue: dto.lastName,
        message: 'Last name must be between 2 and 50 characters',
      });
    }

    // email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!dto.email || dto.email.trim().length === 0) {
      errors.push({
        field: 'email',
        rejectedValue: dto.email ?? '',
        message: 'Email address is mandatory',
      });
    } else if (!emailRegex.test(dto.email.trim())) {
      errors.push({
        field: 'email',
        rejectedValue: dto.email,
        message: 'Email address must be well-formed (e.g., student@university.edu)',
      });
    }

    // department
    if (!dto.department || dto.department.trim().length === 0) {
      errors.push({
        field: 'department',
        rejectedValue: dto.department ?? '',
        message: 'Department major must be specified',
      });
    } else if (dto.department.trim().length < 2 || dto.department.trim().length > 80) {
      errors.push({
        field: 'department',
        rejectedValue: dto.department,
        message: 'Department name must be between 2 and 80 characters',
      });
    }

    // academicYear
    const validYears = ['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'GRADUATE'];
    if (!dto.academicYear || !validYears.includes(dto.academicYear)) {
      errors.push({
        field: 'academicYear',
        rejectedValue: dto.academicYear ?? null,
        message: 'Academic year classification is required (FRESHMAN, SOPHOMORE, JUNIOR, SENIOR, GRADUATE)',
      });
    }

    // gpa
    if (dto.gpa === undefined || dto.gpa === null || isNaN(Number(dto.gpa))) {
      errors.push({
        field: 'gpa',
        rejectedValue: dto.gpa ?? null,
        message: 'GPA value is mandatory',
      });
    } else {
      const gpaNum = Number(dto.gpa);
      if (gpaNum < 0.0) {
        errors.push({
          field: 'gpa',
          rejectedValue: dto.gpa,
          message: 'GPA cannot be negative (minimum 0.00)',
        });
      } else if (gpaNum > 4.0) {
        errors.push({
          field: 'gpa',
          rejectedValue: dto.gpa,
          message: 'GPA cannot exceed 4.00 maximum',
        });
      }
    }

    // dateOfBirth
    if (!dto.dateOfBirth) {
      errors.push({
        field: 'dateOfBirth',
        rejectedValue: null,
        message: 'Date of birth is mandatory',
      });
    } else {
      const dob = new Date(dto.dateOfBirth);
      const today = new Date();
      if (isNaN(dob.getTime())) {
        errors.push({
          field: 'dateOfBirth',
          rejectedValue: dto.dateOfBirth,
          message: 'Date of birth must be a valid ISO-8601 date string (YYYY-MM-DD)',
        });
      } else if (dob >= today) {
        errors.push({
          field: 'dateOfBirth',
          rejectedValue: dto.dateOfBirth,
          message: 'Date of birth must be a past date',
        });
      }
    }

    // creditsCompleted
    if (dto.creditsCompleted !== undefined && dto.creditsCompleted !== null) {
      if (dto.creditsCompleted < 0) {
        errors.push({
          field: 'creditsCompleted',
          rejectedValue: dto.creditsCompleted,
          message: 'Credits completed must be 0 or positive',
        });
      } else if (dto.creditsCompleted > 300) {
        errors.push({
          field: 'creditsCompleted',
          rejectedValue: dto.creditsCompleted,
          message: 'Credits completed cannot exceed 300',
        });
      }
    }

    return errors;
  }

  // POST /api/v1/students -> 201 Created or 400 Bad Request or 409 Conflict
  public createStudent(req: StudentRequestDto): HttpResponse<Student | SpringBootErrorResponse> {
    const latency = Math.floor(Math.random() * 25) + 15;
    const errors = this.validateRequest(req);

    if (errors.length > 0) {
      this.addLog('/* Validation failed before SQL insertion */', []);
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'Bad Request',
          message: `Input validation failed for ${errors.length} field(s)`,
          path: '/api/v1/students',
          fieldErrors: errors,
        },
      };
    }

    // Duplicate email check
    const emailLower = req.email.trim().toLowerCase();
    this.addLog('select count(*) from students s1_0 where lower(s1_0.email) = ?', [emailLower]);
    const duplicate = this.students.find((s) => s.email.toLowerCase() === emailLower);
    if (duplicate) {
      return {
        status: 409,
        statusText: 'Conflict',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 409,
          error: 'Conflict',
          message: `Student with email '${req.email}' already exists`,
          path: '/api/v1/students',
        },
      };
    }

    const id = this.nextId++;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const studentId = `STU-2024-${randomSuffix}`;
    const now = new Date().toISOString();

    const newStudent: Student = {
      id,
      studentId,
      firstName: req.firstName.trim(),
      lastName: req.lastName.trim(),
      email: emailLower,
      department: req.department.trim(),
      academicYear: req.academicYear,
      gpa: Number(Number(req.gpa).toFixed(2)),
      enrollmentStatus: req.enrollmentStatus || 'ACTIVE',
      dateOfBirth: req.dateOfBirth,
      creditsCompleted: req.creditsCompleted ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    this.students.unshift(newStudent);
    this.addLog(
      'insert into students (academic_year, credits_completed, date_of_birth, department, email, enrollment_status, first_name, gpa, last_name, student_id, created_at, id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newStudent.academicYear,
        String(newStudent.creditsCompleted),
        newStudent.dateOfBirth,
        newStudent.department,
        newStudent.email,
        newStudent.enrollmentStatus,
        newStudent.firstName,
        String(newStudent.gpa),
        newStudent.lastName,
        newStudent.studentId,
        now,
        String(id),
      ]
    );

    return {
      status: 201,
      statusText: 'Created',
      headers: {
        'Content-Type': 'application/json',
        Location: `http://localhost:8080/api/v1/students/${id}`,
      },
      latencyMs: latency,
      data: newStudent,
    };
  }

  // GET /api/v1/students -> 200 OK
  public getAllStudents(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): HttpResponse<PagedResponse<Student>> {
    const latency = Math.floor(Math.random() * 20) + 10;
    this.addLog(`select s1_0.* from students s1_0 order by s1_0.${sortBy} ${sortDir} limit ? offset ?`, [
      String(size),
      String(page * size),
    ]);

    let sorted = [...this.students];
    sorted.sort((a: any, b: any) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (typeof valA === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    const totalElements = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = page * size;
    const content = sorted.slice(start, start + size);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      latencyMs: latency,
      data: {
        content,
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        isFirst: page === 0,
        isLast: page >= totalPages - 1,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      },
    };
  }

  // GET /api/v1/students/{id} -> 200 OK or 404
  public getStudentById(id: number): HttpResponse<Student | SpringBootErrorResponse> {
    const latency = Math.floor(Math.random() * 15) + 10;
    this.addLog('select s1_0.* from students s1_0 where s1_0.id = ?', [String(id)]);

    const student = this.students.find((s) => s.id === id);
    if (!student) {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 404,
          error: 'Not Found',
          message: `Student record not found with ID: ${id}`,
          path: `/api/v1/students/${id}`,
        },
      };
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      latencyMs: latency,
      data: student,
    };
  }

  // GET /api/v1/students/search
  public searchStudents(
    department?: string,
    minGpa?: number,
    status?: EnrollmentStatus,
    page: number = 0,
    size: number = 10
  ): HttpResponse<PagedResponse<Student>> {
    const latency = Math.floor(Math.random() * 20) + 12;
    this.addLog(
      'select s1_0.* from students s1_0 where (? is null or lower(s1_0.department) = lower(?)) and (? is null or s1_0.gpa >= ?) and (? is null or s1_0.enrollment_status = ?)',
      [department || 'null', String(minGpa ?? 'null'), status || 'null']
    );

    let filtered = this.students.filter((s) => {
      if (department && !s.department.toLowerCase().includes(department.toLowerCase())) return false;
      if (minGpa !== undefined && s.gpa < minGpa) return false;
      if (status && s.enrollmentStatus !== status) return false;
      return true;
    });

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = page * size;
    const content = filtered.slice(start, start + size);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      latencyMs: latency,
      data: {
        content,
        pageNumber: page,
        pageSize: size,
        totalElements,
        totalPages,
        isFirst: page === 0,
        isLast: page >= totalPages - 1,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      },
    };
  }

  // PUT /api/v1/students/{id}
  public updateStudent(id: number, req: StudentRequestDto): HttpResponse<Student | SpringBootErrorResponse> {
    const latency = Math.floor(Math.random() * 25) + 15;
    const index = this.students.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 404,
          error: 'Not Found',
          message: `Cannot update; Student not found with ID: ${id}`,
          path: `/api/v1/students/${id}`,
        },
      };
    }

    const errors = this.validateRequest(req);
    if (errors.length > 0) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'Bad Request',
          message: `Input validation failed for ${errors.length} field(s)`,
          path: `/api/v1/students/${id}`,
          fieldErrors: errors,
        },
      };
    }

    const existing = this.students[index];
    const emailLower = req.email.trim().toLowerCase();

    // Collision check if email changed
    if (existing.email.toLowerCase() !== emailLower) {
      const emailCollision = this.students.some((s) => s.id !== id && s.email.toLowerCase() === emailLower);
      if (emailCollision) {
        return {
          status: 409,
          statusText: 'Conflict',
          headers: { 'Content-Type': 'application/json' },
          latencyMs: latency,
          data: {
            timestamp: new Date().toISOString(),
            status: 409,
            error: 'Conflict',
            message: `Email '${req.email}' is already assigned to another student`,
            path: `/api/v1/students/${id}`,
          },
        };
      }
    }

    const now = new Date().toISOString();
    const updated: Student = {
      ...existing,
      firstName: req.firstName.trim(),
      lastName: req.lastName.trim(),
      email: emailLower,
      department: req.department.trim(),
      academicYear: req.academicYear,
      gpa: Number(Number(req.gpa).toFixed(2)),
      enrollmentStatus: req.enrollmentStatus || existing.enrollmentStatus,
      dateOfBirth: req.dateOfBirth,
      creditsCompleted: req.creditsCompleted ?? existing.creditsCompleted,
      updatedAt: now,
    };

    this.students[index] = updated;
    this.addLog(
      'update students set department=?, email=?, first_name=?, gpa=?, last_name=?, updated_at=? where id=?',
      [updated.department, updated.email, updated.firstName, String(updated.gpa), updated.lastName, now, String(id)]
    );

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      latencyMs: latency,
      data: updated,
    };
  }

  // DELETE /api/v1/students/{id} -> 204 No Content or 404
  public deleteStudent(id: number): HttpResponse<null | SpringBootErrorResponse> {
    const latency = Math.floor(Math.random() * 20) + 10;
    const index = this.students.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
        latencyMs: latency,
        data: {
          timestamp: new Date().toISOString(),
          status: 404,
          error: 'Not Found',
          message: `Cannot delete; Student not found with ID: ${id}`,
          path: `/api/v1/students/${id}`,
        },
      };
    }

    this.students.splice(index, 1);
    this.addLog('delete from students where id = ?', [String(id)]);

    return {
      status: 204,
      statusText: 'No Content',
      headers: {},
      latencyMs: latency,
      data: null,
    };
  }

  // Stats
  public getStatistics(): Record<string, any> {
    const totalEnrolled = this.students.length;
    const depts: Record<string, { count: number; totalGpa: number }> = {};
    const statusCounts: Record<string, number> = {};

    this.students.forEach((s) => {
      if (!depts[s.department]) depts[s.department] = { count: 0, totalGpa: 0 };
      depts[s.department].count++;
      depts[s.department].totalGpa += s.gpa;

      statusCounts[s.enrollmentStatus] = (statusCounts[s.enrollmentStatus] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(depts).map(([department, data]) => ({
      department,
      enrolledCount: data.count,
      averageGpa: Math.round((data.totalGpa / data.count) * 100) / 100,
    }));

    return {
      totalEnrolled,
      activeCount: statusCounts['ACTIVE'] || 0,
      departmentBreakdown,
      statusDistribution: statusCounts,
    };
  }
}

export const simulator = new SpringBootSimulator();
