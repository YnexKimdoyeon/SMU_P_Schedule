# Team Collaboration Platform Backend

Spring Boot 기반의 팀 협업 플랫폼 백엔드 API입니다.

## 기술 스택

- **Spring Boot 3.2.0**
- **Spring Security** - 인증 및 권한 관리
- **Spring Data JPA** - 데이터베이스 접근
- **H2 Database** - 인메모리 데이터베이스 (개발용)
- **JWT** - 토큰 기반 인증
- **Maven** - 빌드 도구

## 주요 기능

### 🔐 인증 및 권한 관리
- JWT 토큰 기반 인증
- 사용자 등록/로그인
- 역할 기반 권한 관리 (ADMIN, MEMBER)

### 👥 사용자 관리
- 사용자 CRUD
- 사용자명/이메일 중복 확인
- 프로필 정보 수정

### 📋 프로젝트 관리
- 프로젝트 생성/수정/삭제
- 프로젝트 멤버 관리
- 프로젝트 검색

### ✅ 태스크 관리
- 태스크 CRUD
- 태스크 상태 관리 (TODO, IN_PROGRESS, COMPLETED, HOLD)
- 태스크 우선순위 설정
- 태스크 담당자 할당
- 마감일 기반 태스크 조회

### 💬 댓글 및 첨부파일
- 태스크별 댓글 기능
- 파일 첨부 기능

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입

### 사용자
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/{id}` - 사용자 상세 조회
- `GET /api/users/me` - 현재 사용자 정보
- `PUT /api/users/{id}` - 사용자 정보 수정
- `DELETE /api/users/{id}` - 사용자 삭제

### 프로젝트
- `GET /api/projects` - 모든 프로젝트 조회
- `GET /api/projects/{id}` - 프로젝트 상세 조회
- `GET /api/projects/my` - 내 프로젝트 조회
- `POST /api/projects` - 프로젝트 생성
- `PUT /api/projects/{id}` - 프로젝트 수정
- `DELETE /api/projects/{id}` - 프로젝트 삭제
- `POST /api/projects/{projectId}/members/{userId}` - 프로젝트 멤버 추가
- `DELETE /api/projects/{projectId}/members/{userId}` - 프로젝트 멤버 제거

### 태스크
- `GET /api/tasks` - 모든 태스크 조회
- `GET /api/tasks/{id}` - 태스크 상세 조회
- `GET /api/tasks/project/{projectId}` - 프로젝트별 태스크 조회
- `GET /api/tasks/my` - 내 태스크 조회
- `POST /api/tasks` - 태스크 생성
- `PUT /api/tasks/{id}` - 태스크 수정
- `PUT /api/tasks/{id}/status` - 태스크 상태 변경
- `DELETE /api/tasks/{id}` - 태스크 삭제
- `POST /api/tasks/{taskId}/assignees/{userId}` - 태스크 담당자 추가
- `DELETE /api/tasks/{taskId}/assignees/{userId}` - 태스크 담당자 제거

## 실행 방법

### 1. Java 17 설치
```bash
# Java 17 이상이 필요합니다
java -version
```

### 2. Maven 설치
```bash
# Maven이 필요합니다
mvn -version
```

### 3. 프로젝트 빌드 및 실행
```bash
# 프로젝트 디렉토리로 이동
cd backend

# Maven으로 빌드
mvn clean install

# 애플리케이션 실행
mvn spring-boot:run
```

### 4. 접속
- **애플리케이션**: http://localhost:8080
- **H2 콘솔**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (비어있음)

## 초기 데이터

애플리케이션 시작 시 다음 초기 데이터가 자동으로 생성됩니다:

### 사용자
- **admin** / admin123 (관리자)
- **user1** / user123 (김철수)
- **user2** / user123 (이영희)
- **user3** / user123 (박민수)

### 프로젝트
- 웹사이트 리뉴얼
- 모바일 앱 개발

### 태스크
- 홈페이지 레이아웃 디자인
- 사용자 인증 시스템 구현
- 앱 아이콘 디자인

## 개발 환경 설정

### IntelliJ IDEA
1. 프로젝트를 IntelliJ에서 열기
2. Maven 프로젝트로 인식되도록 설정
3. Run Configuration에서 `TeamCollaborationApplication` 실행

### VS Code
1. Java Extension Pack 설치
2. Spring Boot Extension 설치
3. `TeamCollaborationApplication.java`에서 실행

## API 테스트

### Postman 또는 curl 사용

#### 로그인 예시
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### 프로젝트 조회 예시
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## CORS 설정

프론트엔드와의 연동을 위해 CORS가 설정되어 있습니다:
- 모든 Origin 허용
- GET, POST, PUT, DELETE, OPTIONS 메서드 허용
- 모든 헤더 허용

## 보안 설정

- JWT 토큰 기반 인증
- BCrypt 패스워드 암호화
- CSRF 비활성화 (JWT 사용으로 인해)
- 세션 무상태(Stateless) 설정 