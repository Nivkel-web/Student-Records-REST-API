export interface CodeFile {
  path: string;
  name: string;
  language: 'java' | 'xml' | 'yaml' | 'sql' | 'markdown';
  description: string;
  content: string;
}

export const SPRING_CODE_FILES: CodeFile[] = [
  {
    path: 'src/main/java/com/university/studentrecords/StudentRecordsApplication.java',
    name: 'StudentRecordsApplication.java',
    language: 'java',
    description: 'Spring Boot main entry point with OpenAPI annotations',
    content: `package com.university.studentrecords;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application entry point for the Student Records REST API.
 * Demonstrates Spring Boot 3, Spring Data JPA, Hibernate Validator,
 * and comprehensive HTTP status code semantics.
 */
@SpringBootApplication
@EnableJpaAuditing
@OpenAPIDefinition(
    info = @Info(
        title = "Student Records REST API",
        version = "1.0.0",
        description = "Production microservice for university student records management with Bean Validation and Spring Data JPA",
        contact = @Contact(name = "Engineering Team", email = "api-team@university.edu"),
        license = @License(name = "MIT License", url = "https://opensource.org/licenses/MIT")
    )
)
public class StudentRecordsApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentRecordsApplication.class, args);
    }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/model/Student.java',
    name: 'Student.java',
    language: 'java',
    description: 'JPA Entity mapped to "students" table with Hibernate Validator rules',
    content: `package com.university.studentrecords.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a student record stored in the database.
 * Includes column mappings, uniqueness constraints, and Hibernate Validator rules.
 */
@Entity
@Table(
    name = "students",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_id", columnNames = "student_id"),
        @UniqueConstraint(name = "uk_student_email", columnNames = "email")
    },
    indexes = {
        @Index(name = "idx_student_dept", columnNames = "department"),
        @Index(name = "idx_student_status", columnNames = "enrollment_status")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student ID identifier is mandatory")
    @Pattern(regexp = "^STU-[0-9]{4}-[0-9]{4}$", message = "Student ID must match format STU-YYYY-XXXX (e.g., STU-2024-1001)")
    @Column(name = "student_id", nullable = false, length = 20)
    private String studentId;

    @NotBlank(message = "First name must not be blank")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Valid institutional email format required (e.g. name@campus.edu)")
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Department must not be blank")
    @Size(min = 2, max = 80, message = "Department must be between 2 and 80 characters")
    @Column(nullable = false, length = 80)
    private String department;

    @NotNull(message = "Academic year classification is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "academic_year", nullable = false, length = 20)
    private AcademicYear academicYear;

    @NotNull(message = "Grade Point Average (GPA) is mandatory")
    @DecimalMin(value = "0.00", message = "GPA cannot be lower than 0.00")
    @DecimalMax(value = "4.00", message = "GPA cannot exceed 4.00")
    @Digits(integer = 1, fraction = 2, message = "GPA must have at most 1 integer digit and 2 decimal places")
    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal gpa;

    @NotNull(message = "Enrollment status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "enrollment_status", nullable = false, length = 20)
    private EnrollmentStatus enrollmentStatus = EnrollmentStatus.ACTIVE;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be a past date")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Min(value = 0, message = "Credits completed cannot be negative")
    @Max(value = 300, message = "Credits completed cannot exceed 300")
    @Column(name = "credits_completed", nullable = false)
    private Integer creditsCompleted = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor for JPA
    public Student() {}

    public Student(String studentId, String firstName, String lastName, String email,
                   String department, AcademicYear academicYear, BigDecimal gpa,
                   EnrollmentStatus enrollmentStatus, LocalDate dateOfBirth, Integer creditsCompleted) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.academicYear = academicYear;
        this.gpa = gpa;
        this.enrollmentStatus = enrollmentStatus;
        this.dateOfBirth = dateOfBirth;
        this.creditsCompleted = creditsCompleted != null ? creditsCompleted : 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }
    public BigDecimal getGpa() { return gpa; }
    public void setGpa(BigDecimal gpa) { this.gpa = gpa; }
    public EnrollmentStatus getEnrollmentStatus() { return enrollmentStatus; }
    public void setEnrollmentStatus(EnrollmentStatus enrollmentStatus) { this.enrollmentStatus = enrollmentStatus; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public Integer getCreditsCompleted() { return creditsCompleted; }
    public void setCreditsCompleted(Integer creditsCompleted) { this.creditsCompleted = creditsCompleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/model/EnrollmentStatus.java',
    name: 'EnrollmentStatus.java',
    language: 'java',
    description: 'Enumeration representing active lifecycle status',
    content: `package com.university.studentrecords.model;

public enum EnrollmentStatus {
    ACTIVE,
    PROBATION,
    GRADUATED,
    SUSPENDED,
    WITHDRAWN
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/model/AcademicYear.java',
    name: 'AcademicYear.java',
    language: 'java',
    description: 'Enumeration for student undergraduate/graduate standing',
    content: `package com.university.studentrecords.model;

public enum AcademicYear {
    FRESHMAN,
    SOPHOMORE,
    JUNIOR,
    SENIOR,
    GRADUATE
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/dto/StudentRequestDto.java',
    name: 'StudentRequestDto.java',
    language: 'java',
    description: 'Data Transfer Object with Bean Validation annotations for POST and PUT bodies',
    content: `package com.university.studentrecords.dto;

import com.university.studentrecords.model.AcademicYear;
import com.university.studentrecords.model.EnrollmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Incoming payload DTO for creating or updating a student record.
 * Validated in controller via @Valid to prevent bad state insertion.
 */
@Schema(description = "Request body payload for creating or updating a student record")
public record StudentRequestDto(

    @Schema(description = "Legal given first name", example = "Amara")
    @NotBlank(message = "First name is mandatory and cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,

    @Schema(description = "Family last name", example = "Chen")
    @NotBlank(message = "Last name is mandatory and cannot be empty")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    String lastName,

    @Schema(description = "Institutional university email", example = "amara.chen@campus.edu")
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email address must be well-formed (e.g., student@university.edu)")
    String email,

    @Schema(description = "Academic major department", example = "Computer Science")
    @NotBlank(message = "Department major must be specified")
    @Size(min = 2, max = 80, message = "Department name must be between 2 and 80 characters")
    String department,

    @Schema(description = "Academic class year", example = "SENIOR")
    @NotNull(message = "Academic year classification is required")
    AcademicYear academicYear,

    @Schema(description = "Cumulative GPA between 0.00 and 4.00", example = "3.92")
    @NotNull(message = "GPA value is mandatory")
    @DecimalMin(value = "0.00", message = "GPA cannot be negative (minimum 0.00)")
    @DecimalMax(value = "4.00", message = "GPA cannot exceed 4.00 maximum")
    @Digits(integer = 1, fraction = 2, message = "GPA must follow format X.XX with up to 2 decimal places")
    BigDecimal gpa,

    @Schema(description = "Current enrollment standing", example = "ACTIVE", defaultValue = "ACTIVE")
    EnrollmentStatus enrollmentStatus,

    @Schema(description = "Date of birth in ISO-8601 format (must be in past)", example = "2002-04-18")
    @NotNull(message = "Date of birth is mandatory")
    @Past(message = "Date of birth must be a past date")
    LocalDate dateOfBirth,

    @Schema(description = "Total course credits completed", example = "104", defaultValue = "0")
    @Min(value = 0, message = "Credits completed must be 0 or positive")
    @Max(value = 300, message = "Credits completed cannot exceed 300")
    Integer creditsCompleted
) {}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/dto/StudentResponseDto.java',
    name: 'StudentResponseDto.java',
    language: 'java',
    description: 'Outbound REST response DTO with formatted fields and metadata',
    content: `package com.university.studentrecords.dto;

import com.university.studentrecords.model.AcademicYear;
import com.university.studentrecords.model.EnrollmentStatus;
import com.university.studentrecords.model.Student;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Standard outbound DTO returned by REST endpoints to shield entity internals.
 */
public record StudentResponseDto(
    Long id,
    String studentId,
    String firstName,
    String lastName,
    String fullName,
    String email,
    String department,
    AcademicYear academicYear,
    BigDecimal gpa,
    EnrollmentStatus enrollmentStatus,
    LocalDate dateOfBirth,
    Integer creditsCompleted,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static StudentResponseDto fromEntity(Student s) {
        return new StudentResponseDto(
            s.getId(),
            s.getStudentId(),
            s.getFirstName(),
            s.getLastName(),
            s.getFirstName() + " " + s.getLastName(),
            s.getEmail(),
            s.getDepartment(),
            s.getAcademicYear(),
            s.getGpa(),
            s.getEnrollmentStatus(),
            s.getDateOfBirth(),
            s.getCreditsCompleted(),
            s.getCreatedAt(),
            s.getUpdatedAt()
        );
    }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/dto/ApiErrorResponse.java',
    name: 'ApiErrorResponse.java',
    language: 'java',
    description: 'Standardized RFC-7807 problem detail payload for HTTP error responses',
    content: `package com.university.studentrecords.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Consistent error schema following RFC-7807 Problem Details.
 * Returned when Hibernate Validator triggers MethodArgumentNotValidException (400),
 * or when resource not found (404), or duplicate conflict (409).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path,
    List<FieldErrorItem> fieldErrors
) {
    public record FieldErrorItem(
        String field,
        Object rejectedValue,
        String message
    ) {}

    public static ApiErrorResponse of(int status, String error, String message, String path) {
        return new ApiErrorResponse(LocalDateTime.now(), status, error, message, path, null);
    }

    public static ApiErrorResponse withFieldErrors(int status, String error, String message, String path, List<FieldErrorItem> fieldErrors) {
        return new ApiErrorResponse(LocalDateTime.now(), status, error, message, path, fieldErrors);
    }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/repository/StudentRepository.java',
    name: 'StudentRepository.java',
    language: 'java',
    description: 'Spring Data JPA Repository with derived queries, JPQL, and Pagination',
    content: `package com.university.studentrecords.repository;

import com.university.studentrecords.model.AcademicYear;
import com.university.studentrecords.model.EnrollmentStatus;
import com.university.studentrecords.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository interface.
 * Implements JpaRepository and JpaSpecificationExecutor to provide
 * type-safe CRUD, derived query methods, custom JPQL queries, and pagination.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    // Derived finder queries
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);

    // Filter by department with pagination
    Page<Student> findByDepartmentIgnoreCase(String department, Pageable pageable);

    // Filter by status
    Page<Student> findByEnrollmentStatus(EnrollmentStatus status, Pageable pageable);

    // Custom JPQL query for high-achieving student searches
    @Query("""
        SELECT s FROM Student s 
        WHERE (:department IS NULL OR LOWER(s.department) = LOWER(:department))
          AND (:minGpa IS NULL OR s.gpa >= :minGpa)
          AND (:status IS NULL OR s.enrollmentStatus = :status)
    """)
    Page<Student> searchStudents(
        @Param("department") String department,
        @Param("minGpa") BigDecimal minGpa,
        @Param("status") EnrollmentStatus status,
        Pageable pageable
    );

    // Aggregation query: average GPA per department
    @Query("""
        SELECT s.department, AVG(s.gpa), COUNT(s) 
        FROM Student s 
        WHERE s.enrollmentStatus = 'ACTIVE' 
        GROUP BY s.department
    """)
    List<Object[]> findDepartmentGpaStats();

    // Find top performers
    List<Student> findTop5ByEnrollmentStatusOrderByGpaDesc(EnrollmentStatus status);
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/service/StudentService.java',
    name: 'StudentService.java',
    language: 'java',
    description: 'Service contract for student business transactions',
    content: `package com.university.studentrecords.service;

import com.university.studentrecords.dto.StudentRequestDto;
import com.university.studentrecords.dto.StudentResponseDto;
import com.university.studentrecords.model.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface StudentService {
    StudentResponseDto createStudent(StudentRequestDto request);
    StudentResponseDto getStudentById(Long id);
    StudentResponseDto getStudentByStudentId(String studentId);
    Page<StudentResponseDto> getAllStudents(Pageable pageable);
    Page<StudentResponseDto> searchStudents(String department, BigDecimal minGpa, EnrollmentStatus status, Pageable pageable);
    StudentResponseDto updateStudent(Long id, StudentRequestDto request);
    void deleteStudent(Long id);
    Map<String, Object> getAcademicStatistics();
    List<StudentResponseDto> getHonorRollStudents();
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/service/StudentServiceImpl.java',
    name: 'StudentServiceImpl.java',
    language: 'java',
    description: 'Transactional service implementation with entity mappings & conflict checks',
    content: `package com.university.studentrecords.service;

import com.university.studentrecords.dto.StudentRequestDto;
import com.university.studentrecords.dto.StudentResponseDto;
import com.university.studentrecords.exception.DuplicateResourceException;
import com.university.studentrecords.exception.ResourceNotFoundException;
import com.university.studentrecords.model.EnrollmentStatus;
import com.university.studentrecords.model.Student;
import com.university.studentrecords.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentResponseDto createStudent(StudentRequestDto request) {
        // Business check: unique institutional email
        if (studentRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Student with email '" + request.email() + "' already exists");
        }

        // Generate unique student ID sequence (e.g. STU-2024-XXXX)
        String generatedId = generateUniqueStudentId();

        Student student = new Student(
            generatedId,
            request.firstName().trim(),
            request.lastName().trim(),
            request.email().toLowerCase().trim(),
            request.department().trim(),
            request.academicYear(),
            request.gpa(),
            request.enrollmentStatus() != null ? request.enrollmentStatus() : EnrollmentStatus.ACTIVE,
            request.dateOfBirth(),
            request.creditsCompleted() != null ? request.creditsCompleted() : 0
        );

        Student saved = studentRepository.save(student);
        return StudentResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student record not found with ID: " + id));
        return StudentResponseDto.fromEntity(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with identifier: " + studentId));
        return StudentResponseDto.fromEntity(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDto> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(StudentResponseDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDto> searchStudents(String department, BigDecimal minGpa, EnrollmentStatus status, Pageable pageable) {
        return studentRepository.searchStudents(department, minGpa, status, pageable)
            .map(StudentResponseDto::fromEntity);
    }

    @Override
    public StudentResponseDto updateStudent(Long id, StudentRequestDto request) {
        Student existing = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cannot update; Student not found with ID: " + id));

        // If email is changed, ensure no collision with another record
        if (!existing.getEmail().equalsIgnoreCase(request.email()) && studentRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email '" + request.email() + "' is already assigned to another student");
        }

        existing.setFirstName(request.firstName().trim());
        existing.setLastName(request.lastName().trim());
        existing.setEmail(request.email().toLowerCase().trim());
        existing.setDepartment(request.department().trim());
        existing.setAcademicYear(request.academicYear());
        existing.setGpa(request.gpa());
        if (request.enrollmentStatus() != null) {
            existing.setEnrollmentStatus(request.enrollmentStatus());
        }
        existing.setDateOfBirth(request.dateOfBirth());
        if (request.creditsCompleted() != null) {
            existing.setCreditsCompleted(request.creditsCompleted());
        }

        Student updated = studentRepository.save(existing);
        return StudentResponseDto.fromEntity(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete; Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAcademicStatistics() {
        long totalStudents = studentRepository.count();
        List<Object[]> deptStats = studentRepository.findDepartmentGpaStats();
        
        List<Map<String, Object>> departmentMetrics = deptStats.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("department", row[0]);
            map.put("averageGpa", Math.round(((Double) row[1]) * 100.0) / 100.0);
            map.put("enrolledCount", row[2]);
            return map;
        }).toList();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEnrolled", totalStudents);
        stats.put("departmentBreakdown", departmentMetrics);
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getHonorRollStudents() {
        return studentRepository.findTop5ByEnrollmentStatusOrderByGpaDesc(EnrollmentStatus.ACTIVE)
            .stream()
            .map(StudentResponseDto::fromEntity)
            .toList();
    }

    private String generateUniqueStudentId() {
        int currentYear = Year.now().getValue();
        String generated;
        do {
            int randomSeq = ThreadLocalRandom.current().nextInt(1000, 9999);
            generated = String.format("STU-%d-%d", currentYear, randomSeq);
        } while (studentRepository.existsByStudentId(generated));
        return generated;
    }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/controller/StudentController.java',
    name: 'StudentController.java',
    language: 'java',
    description: 'REST Controller with @Valid, ResponseEntity semantics, and standard HTTP statuses',
    content: `package com.university.studentrecords.controller;

import com.university.studentrecords.dto.ApiErrorResponse;
import com.university.studentrecords.dto.StudentRequestDto;
import com.university.studentrecords.dto.StudentResponseDto;
import com.university.studentrecords.model.EnrollmentStatus;
import com.university.studentrecords.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Spring REST Controller exposing CRUD operations on student records.
 * Demonstrates proper HTTP status codes:
 *  - 200 OK: Successful retrieval or update
 *  - 201 Created: Successful creation with Location header
 *  - 204 No Content: Successful deletion
 *  - 400 Bad Request: Triggered automatically by @Valid when constraints fail
 *  - 404 Not Found: When querying an unassigned student ID
 *  - 409 Conflict: When email address already exists
 */
@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Student Records", description = "Endpoints for university student lifecycle and record management")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @Operation(summary = "Create a new student record", description = "Validates payload with Hibernate Validator and persists entity")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Student created successfully; Location header provided"),
        @ApiResponse(responseCode = "400", description = "Validation constraints violated (bad email, GPA out of range, blank name)",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "409", description = "Conflict: Email address is already registered",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(
            @Valid @RequestBody StudentRequestDto request) {
        
        StudentResponseDto created = studentService.createStudent(request);

        // Build canonical REST Location URI: /api/v1/students/{id}
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Get a student by primary database ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student record found and returned"),
        @ApiResponse(responseCode = "404", description = "Student not found with specified ID",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(
            @Parameter(description = "Primary numeric database ID") @PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @Operation(summary = "Get a student by public Student ID format (e.g., STU-2024-1001)")
    @GetMapping("/identifier/{studentId}")
    public ResponseEntity<StudentResponseDto> getStudentByIdentifier(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }

    @Operation(summary = "List all student records with pagination & sorting")
    @GetMapping
    public ResponseEntity<Page<StudentResponseDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(studentService.getAllStudents(pageable));
    }

    @Operation(summary = "Search and filter student records by department, minimum GPA, or status")
    @GetMapping("/search")
    public ResponseEntity<Page<StudentResponseDto>> searchStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) BigDecimal minGpa,
            @RequestParam(required = false) EnrollmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "gpa") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(studentService.searchStudents(department, minGpa, status, pageable));
    }

    @Operation(summary = "Update an existing student record")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Record updated successfully"),
        @ApiResponse(responseCode = "400", description = "Validation failed for fields",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Student does not exist",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDto request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @Operation(summary = "Delete a student record by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Student deleted; No content returned"),
        @ApiResponse(responseCode = "404", description = "Student not found with specified ID",
                     content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get aggregated university academic metrics")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(studentService.getAcademicStatistics());
    }

    @Operation(summary = "Get top 5 highest GPA active students")
    @GetMapping("/honor-roll")
    public ResponseEntity<List<StudentResponseDto>> getHonorRoll() {
        return ResponseEntity.ok(studentService.getHonorRollStudents());
    }
}
`,
  },
  {
    path: 'src/main/java/com/university/studentrecords/exception/GlobalExceptionHandler.java',
    name: 'GlobalExceptionHandler.java',
    language: 'java',
    description: 'Centralized @RestControllerAdvice converting validation exceptions to 400 Bad Request',
    content: `package com.university.studentrecords.exception;

import com.university.studentrecords.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

/**
 * Global exception interceptor translating exceptions into clean,
 * standardized HTTP response bodies with appropriate status codes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Intercepts Hibernate Validator validation errors from @Valid @RequestBody.
     * Maps each field error into a readable FieldErrorItem with 400 BAD REQUEST.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        BindingResult bindingResult = ex.getBindingResult();

        List<ApiErrorResponse.FieldErrorItem> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(err -> new ApiErrorResponse.FieldErrorItem(
                        err.getField(),
                        err.getRejectedValue(),
                        err.getDefaultMessage()
                ))
                .toList();

        ApiErrorResponse response = ApiErrorResponse.withFieldErrors(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Input validation failed for " + fieldErrors.size() + " field(s)",
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles 404 NOT FOUND when a record does not exist.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handles 409 CONFLICT when a unique constraint or business check fails.
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateResource(
            DuplicateResourceException ex, HttpServletRequest request) {

        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handles database constraint violations (e.g. unique SQL index collision).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                "Data Integrity Violation",
                "Database constraint violation occurred: duplicate unique key or constraint failure",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handles path parameter type mismatches (e.g. /students/abc instead of /students/123).
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {

        String message = String.format("Parameter '%s' should be of type '%s'",
                ex.getName(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "valid type");

        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Catch-all fallback for uncaught 500 INTERNAL SERVER ERROR.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneralException(
            Exception ex, HttpServletRequest request) {

        ApiErrorResponse response = ApiErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected internal error occurred: " + ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
`,
  },
  {
    path: 'src/main/resources/application.yml',
    name: 'application.yml',
    language: 'yaml',
    description: 'Spring Boot application configuration with H2 in-memory DB and JPA logging',
    content: `server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: student-records-service
  
  # H2 In-Memory Database Configuration for instant development
  datasource:
    url: jdbc:h2:mem:studentdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        web-allow-others: false
  
  # Spring Data JPA & Hibernate settings
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        jdbc:
          batch_size: 25
    open-in-view: false

# Springdoc OpenAPI 3 / Swagger UI config
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: method
    display-request-duration: true

# Logging configuration
logging:
  level:
    root: INFO
    com.university.studentrecords: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
`,
  },
  {
    path: 'pom.xml',
    name: 'pom.xml',
    language: 'xml',
    description: 'Maven Build configuration with Spring Boot 3.3, JPA, Hibernate Validator & OpenAPI',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    
    <groupId>com.university</groupId>
    <artifactId>student-records-api</artifactId>
    <version>1.0.0</version>
    <name>Student Records REST API</name>
    <description>Spring Boot RESTful microservice with Hibernate Validator, JPA repository, and HTTP status codes</description>
    
    <properties>
        <java.version>21</java.version>
        <springdoc.version>2.6.0</springdoc.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web Starter for RESTful controllers -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate ORM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Hibernate Validator (Bean Validation JSR-380) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- H2 In-Memory Relational Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- PostgreSQL Driver (Optional for Production) -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- OpenAPI 3.0 & Swagger UI documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Spring Boot Testing Starter (JUnit 5, Mockito, MockMvc) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`,
  },
  {
    path: 'src/test/java/com/university/studentrecords/StudentControllerTest.java',
    name: 'StudentControllerTest.java',
    language: 'java',
    description: 'Unit & integration tests verifying HTTP status codes and validation errors',
    content: `package com.university.studentrecords;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.university.studentrecords.dto.StudentRequestDto;
import com.university.studentrecords.model.AcademicYear;
import com.university.studentrecords.model.EnrollmentStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/students returns 201 Created with Location header when valid")
    void testCreateStudentSuccess() throws Exception {
        StudentRequestDto validStudent = new StudentRequestDto(
            "Sophia",
            "Patel",
            "sophia.patel@campus.edu",
            "Computer Science",
            AcademicYear.SOPHOMORE,
            new BigDecimal("3.85"),
            EnrollmentStatus.ACTIVE,
            LocalDate.of(2003, 5, 12),
            45
        );

        mockMvc.perform(post("/api/v1/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validStudent)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.studentId").value(startsWith("STU-")))
                .andExpect(jsonPath("$.email").value("sophia.patel@campus.edu"))
                .andExpect(jsonPath("$.gpa").value(3.85));
    }

    @Test
    @DisplayName("POST /api/v1/students returns 400 Bad Request when Hibernate Validator constraints fail")
    void testCreateStudentValidationFailure() throws Exception {
        // Invalid payload: blank name, malformed email, GPA exceeding 4.00, future date of birth
        StudentRequestDto invalidStudent = new StudentRequestDto(
            "", // Blank firstName -> fails @NotBlank
            "Tester",
            "not-an-email", // Invalid email format -> fails @Email
            "Biology",
            AcademicYear.FRESHMAN,
            new BigDecimal("4.85"), // GPA > 4.00 -> fails @DecimalMax
            EnrollmentStatus.ACTIVE,
            LocalDate.of(2030, 1, 1), // Future date -> fails @Past
            10
        );

        mockMvc.perform(post("/api/v1/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidStudent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.fieldErrors", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItems("firstName", "email", "gpa", "dateOfBirth")));
    }

    @Test
    @DisplayName("GET /api/v1/students/99999 returns 404 Not Found")
    void testGetNonExistentStudent() throws Exception {
        mockMvc.perform(get("/api/v1/students/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }
}
`,
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    language: 'sql',
    description: 'Relational DDL schema with constraints and indexes',
    content: `-- Relational DDL Schema for University Student Records
CREATE TABLE IF NOT EXISTS students (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(80) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    gpa NUMERIC(3, 2) NOT NULL CHECK (gpa >= 0.00 AND gpa <= 4.00),
    enrollment_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    date_of_birth DATE NOT NULL,
    credits_completed INTEGER NOT NULL DEFAULT 0 CHECK (credits_completed >= 0 AND credits_completed <= 300),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_dept ON students(department);
CREATE INDEX IF NOT EXISTS idx_student_status ON students(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_student_gpa ON students(gpa DESC);
`,
  }
];
