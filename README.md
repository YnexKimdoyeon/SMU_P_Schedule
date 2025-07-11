# 🚀 팀 협업 플랫폼 (Team Collaboration Platform)

현대적이고 직관적인 팀 프로젝트 관리 및 협업 도구입니다. Next.js와 TypeScript로 구축된 이 플랫폼은 팀의 생산성을 극대화하고 원활한 소통을 지원합니다.

![Team Collaboration Platform](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Team+Collaboration+Platform)

## ✨ 주요 기능

### 📋 프로젝트 관리
- **다중 프로젝트 지원**: 여러 프로젝트를 동시에 관리
- **프로젝트 설정**: 이름, 색상, 팀원 관리
- **프로젝트별 권한 관리**: 관리자/멤버 역할 구분

### 📊 업무 관리
- **칸반 보드**: 직관적인 드래그 앤 드롭 인터페이스
- **캘린더 뷰**: 마감일 기반 업무 시각화
- **업무 상태 관리**: 할 일, 진행 중, 완료, 보류
- **우선순위 설정**: 높음, 보통, 낮음
- **담당자 배정**: 다중 담당자 지원
- **댓글 시스템**: 업무별 실시간 소통
- **첨부파일 지원**: 파일 업로드 및 관리

### 💬 실시간 채팅
- **채널 기반 채팅**: 프로젝트별 채널 구성
- **개인 메시지**: 1:1 직접 메시지
- **실시간 알림**: 새 메시지 즉시 알림
- **온라인 상태 표시**: 팀원 접속 상태 확인
- **메시지 히스토리**: 대화 내용 보관

### 🔔 알림 시스템
- **실시간 알림**: 멘션, 배정, 댓글 알림
- **알림 센터**: 읽음/읽지 않음 상태 관리
- **배지 표시**: 읽지 않은 알림 개수 표시

### 👥 팀 관리
- **팀원 초대**: 이메일 기반 초대 시스템
- **역할 관리**: 관리자/멤버 권한 설정
- **프로필 관리**: 사용자 정보 및 아바타

### 🎨 사용자 경험
- **반응형 디자인**: 모든 디바이스에서 최적화
- **다크/라이트 모드**: 사용자 선호에 따른 테마
- **애니메이션**: 부드러운 전환 효과
- **접근성**: WCAG 가이드라인 준수

## 🛠️ 기술 스택

### Frontend
- **Next.js 14**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 현대적인 UI 컴포넌트 라이브러리

### UI/UX
- **@dnd-kit/core**: 드래그 앤 드롭 기능
- **Lucide React**: 아이콘 라이브러리
- **Radix UI**: 접근성 우선 컴포넌트

### 상태 관리
- **React Context**: 전역 상태 관리
- **React Hooks**: 컴포넌트 상태 관리

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 과정

1. **저장소 클론**
```bash
git clone https://github.com/your-username/team-collaboration-platform.git
cd team-collaboration-platform
```

2. **의존성 설치**
```bash
npm install
```

3. **필수 패키지 설치** (누락된 경우)
```bash
# Radix UI 컴포넌트
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs @radix-ui/react-alert-dialog

# 드래그 앤 드롭
npm install @dnd-kit/core

# 아이콘 및 유틸리티
npm install lucide-react class-variance-authority clsx tailwind-merge

# 애니메이션
npm install tailwindcss-animate
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:3000
```

## 🎯 사용법

### 로그인
- **데모 계정**: `demo@example.com` / `123456`
- 또는 새 계정 생성

### 프로젝트 생성
1. 좌측 사이드바에서 "새 프로젝트" 클릭
2. 프로젝트 이름과 색상 선택
3. 팀원 초대 (선택사항)

### 업무 관리
1. **업무 생성**: 각 상태 컬럼에서 "+" 버튼 클릭
2. **업무 이동**: 드래그 앤 드롭으로 상태 변경
3. **상세 보기**: 업무 카드 클릭으로 상세 정보 확인
4. **댓글 작성**: 업무 상세에서 팀원과 소통

### 채팅 사용
1. 우측 상단 채팅 버튼 클릭
2. 채널 또는 팀원 선택
3. 실시간 메시지 교환

### 캘린더 뷰
1. 상단 캘린더 아이콘 클릭
2. 월별 업무 일정 확인
3. 마감일 임박 업무 강조 표시

## 📁 프로젝트 구조

```
team-collaboration-platform/
├── app/                          # Next.js App Router
│   ├── globals.css              # 전역 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 메인 페이지
├── components/                   # 재사용 가능한 컴포넌트
│   ├── auth/                    # 인증 관련 컴포넌트
│   │   ├── login-form.tsx       # 로그인 폼
│   │   └── user-menu.tsx        # 사용자 메뉴
│   ├── ui/                      # shadcn/ui 컴포넌트
│   ├── calendar-view.tsx        # 캘린더 뷰
│   ├── chat-panel.tsx           # 채팅 패널
│   ├── notifications-popover.tsx # 알림 팝오버
│   ├── project-sidebar.tsx      # 프로젝트 사이드바
│   ├── project-settings-dialog.tsx # 프로젝트 설정
│   ├── task-board.tsx           # 칸반 보드
│   ├── task-card.tsx            # 업무 카드
│   ├── task-detail-panel.tsx    # 업무 상세 패널
│   └── team-management-dialog.tsx # 팀 관리
├── contexts/                     # React Context
│   └── auth-context.tsx         # 인증 컨텍스트
├── hooks/                       # 커스텀 훅
├── lib/                         # 유틸리티 함수
│   └── utils.ts                 # 공통 유틸리티
├── public/                      # 정적 파일
├── tailwind.config.ts           # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
└── package.json                # 프로젝트 의존성
```

## 🎨 컴포넌트 상세

### TaskCard
업무를 시각적으로 표현하는 카드 컴포넌트
- 드래그 앤 드롭 지원
- 우선순위 및 상태 배지
- 담당자 아바타
- 댓글 및 첨부파일 개수 표시

### ChatPanel
실시간 채팅 기능을 제공하는 패널
- 채널 및 DM 지원
- 실시간 메시지 전송
- 온라인 상태 표시
- 읽지 않은 메시지 카운트

### CalendarView
월별 캘린더 형태로 업무를 표시
- 마감일 기반 업무 배치
- 우선순위별 색상 구분
- 긴급 업무 강조 표시
- 드래그 앤 드롭 지원

## 🔧 커스터마이징

### 테마 변경
`app/globals.css`에서 CSS 변수 수정:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* 기타 색상 변수 */
}
```

### 새로운 상태 추가
`app/page.tsx`의 `statusColumns` 배열에 새 상태 추가:
```typescript
const statusColumns = [
  { id: "todo", title: "할 일", color: "bg-gray-100" },
  { id: "review", title: "검토", color: "bg-orange-100" }, // 새 상태
  // 기존 상태들...
]
```

## 🚀 배포

### Vercel 배포
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 자동 배포 완료

### 기타 플랫폼
- **Netlify**: `npm run build` 후 `out` 폴더 배포
- **Docker**: Dockerfile 작성 후 컨테이너 배포

## 🔮 향후 계획

### 단기 목표
- [ ] WebSocket 기반 실시간 동기화
- [ ] 파일 업로드 기능 구현
- [ ] 이메일 알림 시스템
- [ ] 모바일 앱 (React Native)

### 장기 목표
- [ ] AI 기반 업무 추천
- [ ] 고급 분석 대시보드
- [ ] 타임 트래킹 기능
- [ ] 간트 차트 뷰
- [ ] API 문서화 및 공개

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

### 개발 가이드라인
- TypeScript 사용 필수
- ESLint 및 Prettier 설정 준수
- 컴포넌트별 단위 테스트 작성
- 접근성 가이드라인 준수

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/team-collaboration-platform/issues)
- **기능 요청**: [GitHub Discussions](https://github.com/your-username/team-collaboration-platform/discussions)
- **이메일**: support@yourproject.com

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide](https://lucide.dev/)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!

**Made with ❤️ by [Your Name]**
```

이 README는 프로젝트의 모든 주요 기능과 기술적 세부사항을 포함하고 있습니다. 필요에 따라 GitHub 저장소 URL, 이메일 주소, 라이선스 정보 등을 실제 정보로 수정하시면 됩니다!
