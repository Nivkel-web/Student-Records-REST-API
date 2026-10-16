export const GITHUB_README_MARKDOWN = `# Student Records REST API

[![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Hibernate](https://img.shields.io/badge/Hibernate_Validator-8.0-59666C?style=for-the-badge&logo=hibernate&logoColor=white)](https://hibernate.org/validator/)
[![JPA](https://img.shields.io/badge/Spring_Data-JPA-blue?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-data-jpa)
[![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/)

A production-ready **Spring Boot RESTful microservice** designed for managing university student records. It showcases strict input validation using **Hibernate Validator (JSR-380)**, canonical **HTTP status responses** (200, 201 with \`Location\` header, 204, 400, 404, 409), robust **Spring Data JPA** persistence with pagination and sorting, and centralized RFC-7807 problem detail exception handling.

---

## Screenshots

> **Note**: High-resolution screenshots generated from the built-in Screenshot Studio.

### 1. Interactive Swagger / OpenAPI Documentation
![Swagger UI](docs/screenshots/swagger-ui.png)
*Interactive API documentation and schema explorer available at \`/swagger-ui.html\`.*

### 2. Hibernate Validator Constraint Error (HTTP 400 Bad Request)
![Validation Error 400](docs/screenshots/validation-error-400.png)
*Detailed field-level constraint violations captured by \`@RestControllerAdvice\`.*

### 3. Spring Data JPA Database Records
![Database Records](docs/screenshots/database-records.png)
*In-memory H2 / PostgreSQL relational database records with SQL query tracking.*

---

## Architectural Highlights

- **Spring Boot 3.3.4 & Java 21**: Modern record types, pattern matching, and virtual thread readiness.
- **Strict Input Validation**: Enforced via Hibernate Validator (\`@NotNull\`, \`@NotBlank\`, \`@Size\`, \`@Email\`, \`@Past\`, \`@DecimalMin\`, \`@DecimalMax\`, \`@Digits\`).
- **Canonical HTTP Status Semantics**:
  - \`201 Created\` returns the generated record along with the canonical \`Location: /api/v1/students/{id}\` header.
  - \`204 No Content\` for successful idempotency deletion.
  - \`400 Bad Request\` returns field-by-field validation failure reasons.
  - \`404 Not Found\` for non-existent entities.
  - \`409 Conflict\` on duplicate student email or student ID collisions.
- **Spring Data JPA & Hibernate**:
  - Entity-relationship mapping with audited timestamps (\`@CreatedDate\`, \`@LastModifiedDate\`).
  - Derived finder queries and custom JPQL filters.
  - Native Pagination & Sorting (\`Pageable\`, \`Page<StudentResponseDto>\`).
- **Global Exception Handling**: Centralized \`@RestControllerAdvice\` translating Java exceptions into RFC-7807 problem details.
- **OpenAPI 3.0 (Swagger UI)**: Auto-generated interactive documentation at \`/swagger-ui.html\`.

---

## Entity & Hibernate Validation Constraints

| Field | Java Type | Database Column | Constraints & Error Messages |
| :--- | :--- | :--- | :--- |
| \`id\` | \`Long\` | \`id BIGINT PRIMARY KEY\` | Generated IDENTITY, read-only |
| \`studentId\` | \`String\` | \`student_id VARCHAR(20) UNIQUE\` | \`@NotBlank\`, \`@Pattern(regexp = "^STU-[0-9]{4}-[0-9]{4}$")\` |
| \`firstName\` | \`String\` | \`first_name VARCHAR(50)\` | \`@NotBlank\`, \`@Size(min = 2, max = 50)\` |
| \`lastName\` | \`String\` | \`last_name VARCHAR(50)\` | \`@NotBlank\`, \`@Size(min = 2, max = 50)\` |
| \`email\` | \`String\` | \`email VARCHAR(100) UNIQUE\` | \`@NotBlank\`, \`@Email\` (institutional format check) |
| \`department\` | \`String\` | \`department VARCHAR(80)\` | \`@NotBlank\`, \`@Size(min = 2, max = 80)\` |
| \`academicYear\`| \`Enum\` | \`academic_year VARCHAR(20)\` | \`@NotNull\` (\`FRESHMAN\`, \`SOPHOMORE\`, \`JUNIOR\`, \`SENIOR\`, \`GRADUATE\`) |
| \`gpa\` | \`BigDecimal\`| \`gpa NUMERIC(3,2)\` | \`@NotNull\`, \`@DecimalMin("0.00")\`, \`@DecimalMax("4.00")\` |
| \`enrollmentStatus\` | \`Enum\` | \`enrollment_status VARCHAR(20)\` | \`@NotNull\` (\`ACTIVE\`, \`PROBATION\`, \`GRADUATED\`, \`SUSPENDED\`, \`WITHDRAWN\`) |
| \`dateOfBirth\`| \`LocalDate\` | \`date_of_birth DATE\` | \`@NotNull\`, \`@Past(message = "Date of birth must be in the past")\` |
| \`creditsCompleted\` | \`Integer\` | \`credits_completed INT\` | \`@Min(0)\`, \`@Max(300)\` |

---

## REST Endpoints Matrix

| Method | Endpoint | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/api/v1/students\` | **201 Created** | Creates student record with \`Location\` header. Fails with **400** if invalid, **409** if duplicate email. |
| \`GET\` | \`/api/v1/students\` | **200 OK** | Paginated list of student records. Supports \`page\`, \`size\`, \`sortBy\`, \`sortDir\`. |
| \`GET\` | \`/api/v1/students/{id}\` | **200 OK** / **404** | Retrieves single student record by primary ID. |
| \`GET\` | \`/api/v1/students/identifier/{studentId}\` | **200 OK** / **404** | Retrieves single student record by formatted ID (\`STU-2024-1001\`). |
| \`GET\` | \`/api/v1/students/search\` | **200 OK** | Multi-attribute search by \`department\`, \`minGpa\`, and \`status\`. |
| \`PUT\` | \`/api/v1/students/{id}\` | **200 OK** / **400** | Full update of existing student. Validates constraints. |
| \`DELETE\`| \`/api/v1/students/{id}\` | **204 No Content** | Deletes student. Returns 404 if not found. |
| \`GET\` | \`/api/v1/students/stats\` | **200 OK** | Aggregated department averages and enrollment statistics. |
| \`GET\` | \`/api/v1/students/honor-roll\` | **200 OK** | Top 5 active students ordered by GPA descending. |

---

## Quickstart & cURL Examples

### 1. Create Student (\`201 Created\`)
\`\`\`bash
curl -i -X POST http://localhost:8080/api/v1/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Amara",
    "lastName": "Chen",
    "email": "amara.chen@campus.edu",
    "department": "Computer Science",
    "academicYear": "SENIOR",
    "gpa": 3.92,
    "enrollmentStatus": "ACTIVE",
    "dateOfBirth": "2002-04-18",
    "creditsCompleted": 104
  }'
\`\`\`

**Response:**
\`\`\`http
HTTP/1.1 201 Created
Location: http://localhost:8080/api/v1/students/101
Content-Type: application/json

{
  "id": 101,
  "studentId": "STU-2023-1001",
  "firstName": "Amara",
  "lastName": "Chen",
  "fullName": "Amara Chen",
  "email": "amara.chen@campus.edu",
  "department": "Computer Science",
  "academicYear": "SENIOR",
  "gpa": 3.92,
  "enrollmentStatus": "ACTIVE",
  "dateOfBirth": "2002-04-18",
  "creditsCompleted": 104,
  "createdAt": "2024-10-16T12:00:00Z"
}
\`\`\`

### 2. Validation Failure (\`400 Bad Request\`)
\`\`\`bash
curl -i -X POST http://localhost:8080/api/v1/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "",
    "lastName": "Doe",
    "email": "bad-email-address",
    "department": "Physics",
    "academicYear": "FRESHMAN",
    "gpa": 4.95,
    "dateOfBirth": "2030-01-01"
  }'
\`\`\`

**Response:**
\`\`\`http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "timestamp": "2024-10-16T12:05:32.418Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Input validation failed for 4 field(s)",
  "path": "/api/v1/students",
  "fieldErrors": [
    {
      "field": "firstName",
      "rejectedValue": "",
      "message": "First name is mandatory and cannot be empty"
    },
    {
      "field": "email",
      "rejectedValue": "bad-email-address",
      "message": "Email address must be well-formed (e.g., student@university.edu)"
    },
    {
      "field": "gpa",
      "rejectedValue": 4.95,
      "message": "GPA cannot exceed 4.00 maximum"
    },
    {
      "field": "dateOfBirth",
      "rejectedValue": "2030-01-01",
      "message": "Date of birth must be a past date"
    }
  ]
}
\`\`\`

---

## How to Run Locally

### Prerequisites
- **JDK 21** or later
- **Maven 3.9+** (or use included \`./mvnw\`)

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-username/student-records-api.git
cd student-records-api
\`\`\`

### 2. Build and Run
\`\`\`bash
./mvnw clean spring-boot:run
\`\`\`
The application starts on port **8080**.

### 3. Open Documentation & Database Console
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: \`jdbc:h2:mem:studentdb\`
  - Username: \`sa\`
  - Password: \`password\`

### 4. Run Test Suite
\`\`\`bash
./mvnw test
\`\`\`

---

## License
Distributed under the MIT License. See \`LICENSE\` for more information.
`;
