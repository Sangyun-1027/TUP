-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: TUP_project
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_id` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contests`
--

DROP TABLE IF EXISTS `contests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `start` date DEFAULT NULL,
  `organizer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contests`
--

LOCK TABLES `contests` WRITE;
/*!40000 ALTER TABLE `contests` DISABLE KEYS */;
INSERT INTO `contests` VALUES (1,'2025 AWS x Codetree 프로그래밍 경진대회','클라우드 환경에서의 문제 해결 프로그래밍','프로그래밍, 클라우드','2025-05-16','2025-04-21','AWS / 코드트리','/aws.png'),(2,'제7회 서울교육 데이터 분석·활용 아이디어 공모전','교육 데이터를 활용한 분석 및 시각화','데이터/코딩','2025-06-01','2025-04-21','서울특별시교육청','/seoul.png'),(3,'2025년 경기도서관 크리에이티브 시너지 공모전','공공도서관 시스템 개선 아이디어 공모','IT기획/프로그래밍','2025-06-30','2025-04-09','경기도 / 경기도서관','/creative.png'),(4,'2025 GH 공간복지 청년 공모전','공간 기술 기반의 아이디어 및 프로토타입 공모','공간IT/UX설계','2025-06-29','2025-06-02','경기주택도시공사','/gh.png'),(5,'제6회 뉴스읽기 뉴스일기 공모전','뉴스 데이터를 활용한 콘텐츠 기획','미디어/코딩교육','2025-07-31','2025-04-07','한국언론진흥재단','/news.png'),(6,'XRPL HACKATHON SEOUL 2025','Web3 및 핀테크에 관심 있는 개발자 대상 해커톤','게임/소프트웨어','2025-09-20','2025-08-04','XRPL Korea','/xrpl.png'),(8,'2025 제5회 청소년 IT경시대회','전국 초·중·고 재학생 대상 IT 경시대회 (프로그래밍 언어, 알고리즘, 인공지능 데이터 분석 등 다양한 부문)','게임/소프트웨어','2025-09-10','2025-08-18','한국정보기술진흥원(주)','/kitpa.png'),(9,'AI Co-Scientist : 2025 Samsung AI Challenge','AI Agent가 주도하는 시스템을 설계하고 운영하는 챌린지. 개인 또는 팀 (최대 3명)으로 참여 가능.','게임/소프트웨어','2025-09-12','2025-08-04','삼성전자 AI센터','/samsungai.png'),(10,'토스 게임 공모전 - 토스 HTML5 게임 챌린지 with 넵튠','HTML5 기반 창작 게임 공모. 하이퍼 캐주얼부터 RPG까지 가능하며, 총 상금 8천만원 규모.','게임/소프트웨어, HTML5 게임, 창작게임','2025-11-03','2025-08-25','(주)비바리퍼블리카','/tossgame.png'),(11,'2025 디스플레이 챌린지(Display Challenge) 공모전','문화와 기술이 만나는 곳, 디스플레이로 상상하는 내일. 영화, 공연, 게임, 미디어아트 등 응용분야와 제품/콘텐츠 아이디어 제안.','게임/소프트웨어, 기획/아이디어, 문화기술','2025-08-31','2025-08-04','한국디스플레이연구조합','/display.png'),(12,'2025 동원 AI Challenge','소비자 페르소나 기반 동원 신제품 월별 수요 예측 AI 대회. 만 19세 이상 참여 가능하며 자동채점 및 오프라인 발표 심사를 거쳐 총 7천만 원 상금 지급.','게임/소프트웨어, 인공지능, 데이터 분석','2025-09-01','2025-07-21','동원그룹','/dongwon.png'),(13,'데이콘 K intelligence 해커톤 2025','AI Agent 개발과 프롬프트 엔지니어링 트랙으로 구성된 해커톤으로, 누구나 참여 가능하며 최대 2,000만원의 상금이 수여됨.','게임/소프트웨어, AI개발, 해커톤','2025-09-08','2025-08-12','데이콘(주)','/dacon_k_intel_hackathon.png');
/*!40000 ALTER TABLE `contests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `is_agree` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_id` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_id` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewarded`
--

DROP TABLE IF EXISTS `rewarded`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewarded` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `is_rewarded` tinyint(1) DEFAULT NULL,
  `granted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `rewarded_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewarded`
--

LOCK TABLES `rewarded` WRITE;
/*!40000 ALTER TABLE `rewarded` DISABLE KEYS */;
INSERT INTO `rewarded` VALUES (1,21,1,'2025-07-28 15:57:47','오지유'),(2,13,1,'2025-07-28 15:57:47','이하준'),(3,7,1,'2025-07-28 15:57:47','한지민'),(4,40,1,'2025-07-28 15:57:47','박지원'),(5,1,1,'2025-07-28 15:57:47','홍길동'),(6,10,1,'2025-07-28 15:57:47','임수정'),(7,19,1,'2025-07-28 15:57:47','한서연'),(8,2,1,'2025-07-28 15:57:47','김철수'),(9,35,1,'2025-07-28 15:57:47','이동건'),(10,8,1,'2025-07-28 15:57:47','최성민');
/*!40000 ALTER TABLE `rewarded` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_leader`
--

DROP TABLE IF EXISTS `team_leader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_leader` (
  `id` int NOT NULL,
  `leader` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `main_role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sub_role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `looking_for` json DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `max_members` int DEFAULT NULL,
  `intro` text COLLATE utf8mb4_general_ci,
  `keywords` json DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `participation` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_leader`
--

LOCK TABLES `team_leader` WRITE;
/*!40000 ALTER TABLE `team_leader` DISABLE KEYS */;
INSERT INTO `team_leader` VALUES (1,'김민수','PM','프론트엔드 개발','[\"React\", \"Node.js\"]','[\"디자이너\", \"기획자\"]','웹/앱 서비스 개발','모집중',4,'열정 가득한 팀장입니다.','[\"기획력\", \"리더십\"]',4,2),(2,'이수현','PM','기획자','[\"Vue.js\", \"Django\"]','[\"백엔드 개발자\", \"디자이너\"]','AI 기반 추천 시스템 개발','모집중',5,'효율적인 시스템을 함께 만들어가요!','[\"분석력\", \"실행력\"]',4.5,3),(3,'정세윤','백엔드 개발자','AI 설계','[\"Python\", \"FastAPI\"]','[\"프론트엔드 개발자\", \"디자이너\"]','AI 기반 분석 플랫폼','모집중',5,'데이터 흐름을 중심으로 설계하는 팀입니다.','[\"논리력\", \"집중력\", \"소통\"]',4.2,3),(4,'이지은','프론트엔드 개발자','UI 설계','[\"React\", \"TailwindCSS\"]','[\"백엔드 개발자\", \"기획자\"]','사용자 맞춤형 쇼핑 플랫폼','모집중',4,'사용자 경험을 최우선으로 생각합니다.','[\"창의력\", \"실행력\", \"공감력\"]',4.6,3),(5,'박상은','AI 엔지니어','데이터 전처리','[\"Python\", \"TensorFlow\"]','[\"프론트엔드 개발자\", \"디자이너\"]','AI 기반 챗봇 서비스','모집중',5,'정확한 데이터 기반의 AI를 지향합니다.','[\"논리력\", \"책임감\", \"분석력\"]',4.8,6),(6,'강민기','디자이너','UX 기획','[\"Figma\", \"Photoshop\"]','[\"프론트엔드 개발자\", \"기획자\"]','감성 중심 사용자 경험 디자인','모집중',4,'사용자 입장에서 공감하는 디자인을 만듭니다.','[\"공감력\", \"창의력\", \"소통\"]',4.6,5),(7,'나상현','백엔드 개발자','DB 설계','[\"Node.js\", \"MySQL\"]','[\"프론트엔드 개발자\", \"디자이너\"]','실시간 데이터 처리 시스템','모집중',5,'안정성과 확장성을 고려한 시스템을 설계합니다.','[\"문제해결\", \"책임감\", \"전략적 사고\"]',4.3,4),(8,'문수진','모바일 앱 개발자','UI/UX 설계','[\"Flutter\", \"Firebase\"]','[\"백엔드 개발자\", \"디자이너\"]','헬스케어 맞춤 앱 개발','모집중',4,'직관적인 모바일 앱을 만드는 데 집중합니다.','[\"실행력\", \"창의력\", \"기획력\"]',4.5,3),(9,'정유경','데이터 분석가','시각화 설계','[\"Python\", \"Pandas\"]','[\"백엔드 개발자\", \"기획자\"]','소비 패턴 분석 플랫폼','모집중',5,'숫자 뒤에 숨겨진 의미를 찾아냅니다.','[\"분석력\", \"논리력\", \"집중력\"]',4.4,2),(10,'서혜림','브랜딩 기획자','콘텐츠 편집','[\"Illustrator\", \"Figma\"]','[\"기획자\", \"프론트엔드 개발자\"]','MZ세대를 위한 브랜드 런칭','모집중',4,'감성과 전략이 어우러진 브랜딩을 추구합니다.','[\"기획력\", \"감각\", \"설득력\"]',4.2,5);
/*!40000 ALTER TABLE `team_leader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('leader','member') COLLATE utf8mb4_general_ci DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_id` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `leader_id` int NOT NULL,
  `matching_type` enum('auto','manual') COLLATE utf8mb4_general_ci NOT NULL,
  `is_finalized` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leader_id` (`leader_id`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `main_role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sub_role` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `intro` text COLLATE utf8mb4_general_ci,
  `skills` json DEFAULT NULL,
  `keywords` json DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `participation` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `has_reward` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'홍길동','기획 아이디어 제안자','기술 설계 서포트','프론트엔드에 강한 자신감!','[\"React\", \"JavaScript\"]','[\"소통\", \"책임감\", \"창의력\"]',4.2,2,'2025-07-18 15:05:11',0),(2,'김철수','데이터 분석','API 설계','데이터 분석은 저에게 맡겨주세요','[\"Python\", \"Django\"]','[\"분석력\", \"실행력\", \"논리력\"]',4.3,2,'2025-07-18 15:05:11',0),(3,'이영희','백엔드 개발','문서 작성','열심히 하겠습니다!','[\"Java\", \"Spring\"]','[\"끈기\", \"전략적 사고\", \"소통\"]',3.9,1,'2025-07-18 15:05:11',0),(4,'박민수','기술 구현','자료 조사','알고리즘 척척박사','[\"C++\", \"알고리즘\"]','[\"문제해결\", \"집중력\", \"논리력\"]',4.8,4,'2025-07-18 15:05:11',0),(5,'최지우','디자인 리더','콘텐츠 편집','웹 디자인은 맡겨만 주십쇼','[\"UI/UX\", \"Figma\"]','[\"창의력\", \"공감력\", \"소통\"]',4.6,3,'2025-07-18 15:05:11',0),(6,'정우성','백엔드 개발','DB 구축','프론트엔드에 강한 자신감!','[\"Node.js\", \"Express\"]','[\"시간관리\", \"자기주도성\", \"실행력\"]',3.2,2,'2025-07-18 15:06:35',0),(7,'한지민','DB 설계','데이터 정리','데이터 엔지니어링 달인','[\"DB\", \"SQL\"]','[\"분석력\", \"꼼꼼함\", \"책임감\"]',4.9,5,'2025-07-18 15:06:35',0),(8,'최성민','프론트엔드 구현','디자인 피드백','프론트엔드는 자신감~!','[\"React\", \"TypeScript\"]','[\"기획력\", \"도전정신\", \"창의력\"]',3.6,3,'2025-07-18 15:06:35',0),(9,'오세훈','AI 모델 구현','데이터 수집','세훈PT라고 불러주십쇼','[\"AI\", \"TensorFlow\"]','[\"논리력\", \"전략적 사고\", \"문제해결\"]',4.1,3,'2025-07-18 15:06:35',0),(10,'임수정','모바일 앱 개발','테스트 및 QA','모바일 앱 박사','[\"Flutter\", \"모바일\"]','[\"열정\", \"소통\", \"친절함\"]',3.2,1,'2025-07-18 15:07:23',0),(11,'홍수아','브랜딩 기획','비주얼 편집','편집왕','[\"UI/UX\", \"Figma\"]','[\"공감력\", \"기획력\", \"설득력\"]',3.5,1,'2025-07-18 15:07:23',0),(12,'김현우','서버 개발자','배포 지원','서버개발은 저만 믿어주세요!','[\"Java\", \"Spring Boot\"]','[\"논리력\", \"적응력\", \"책임감\"]',4.3,2,'2025-07-18 15:07:23',0),(13,'이하준','백엔드 개발','UI 피드백','끈기있는 개발자!','[\"Java\", \"Spring\"]','[\"끈기\", \"실행력\", \"분석력\"]',4.7,1,'2025-07-18 15:07:23',0),(14,'김서윤','백엔드 개발','디자인 보조','열심히하겠습니다~!','[\"DB\", \"SQL\"]','[\"자기주도성\", \"친절함\"]',3.3,5,'2025-07-18 15:07:24',0),(15,'박도현','백엔드 개발','프론트 보조','신선한 개발자','[\"UI/UX\", \"Figma\"]','[\"기획력\", \"창의력\"]',4.4,2,'2025-07-18 15:08:33',0),(16,'최예린','기획자','디자인 보조','기획회사도 울고갈 창의력!!','[\"Java\", \"Spring\"]','[\"적응력\", \"끈기\"]',2.9,6,'2025-07-18 15:08:33',0),(17,'정하늘','UX 디자이너','프론트 보조','소통하는 디자이너!','[\"UI/UX\", \"Figma\"]','[\"소통\", \"창의력\", \"실행력\"]',3.9,6,'2025-07-18 15:08:33',0),(18,'윤지후','프론트엔드 구현','데이터 수집','말하는대로~','[\"DB\", \"SQL\"]','[\"소통\", \"리더십\"]',3.6,1,'2025-07-18 15:08:33',0),(19,'한서연','기획자','디자인 보조','원하는 방향으로 이끌어줄게요!','[\"React\", \"TypeScript\"]','[\"발표력\", \"분석력\", \"적응력\"]',4.6,6,'2025-07-18 15:08:33',0),(20,'장민준','AI 모델링','프론트 보조','로봇보다 한 수 위!','[\"UI/UX\", \"Figma\"]','[\"리더십\", \"열정\"]',4.3,3,'2025-07-18 15:08:33',0),(21,'오지유','백엔드 개발','테스트 및 QA','파워 J 개발자!','[\"Java\", \"Spring\"]','[\"분석력\", \"실행력\", \"시간관리\"]',4.9,4,'2025-07-18 15:08:33',0),(22,'서하람','백엔드 개발','문서 정리','최선을 다하겠습니다!','[\"React\", \"TypeScript\"]','[\"끈기\", \"친절함\"]',4.1,6,'2025-07-18 15:08:33',0),(23,'신유찬','프론트엔드 구현','콘텐츠 편집','친절한 유찬씨!','[\"AI\", \"TensorFlow\"]','[\"자기주도성\", \"논리력\", \"친절함\"]',2.8,1,'2025-07-18 15:08:33',0),(24,'백지안','UX 디자이너','콘텐츠 편집','ENFJ 디자이너','[\"C++\", \"알고리즘\"]','[\"공감력\", \"끈기\"]',4.8,4,'2025-07-18 15:08:33',0),(25,'노지후','UX 디자이너','데이터 수집','AI 뺨치는 디자이너!','[\"C++\", \"알고리즘\"]','[\"분석력\", \"창의력\"]',3.9,5,'2025-07-18 15:08:33',0),(26,'강수빈','기술 설계','문서 정리','인간 설계도','[\"AI\", \"TensorFlow\"]','[\"발표력\", \"공감력\"]',3.7,4,'2025-07-18 15:08:33',0),(27,'유시우','모바일 앱 개발','콘텐츠 편집','열심히 하겠습니다!!','[\"Java\", \"Spring\"]','[\"책임감\", \"분석력\", \"창의력\"]',2.2,6,'2025-07-18 15:08:33',0),(28,'조예나','백엔드 개발','데이터 수집','뭐든 꼼꼼하게!','[\"Java\", \"Spring\"]','[\"꼼꼼함\", \"기획력\", \"공감력\"]',4.6,4,'2025-07-18 15:08:33',0),(29,'문하진','모바일 앱 개발','콘텐츠 편집','최선을 다하겠습니다!','[\"UI/UX\", \"Figma\"]','[\"창의력\", \"실행력\"]',4.4,1,'2025-07-18 15:08:33',0),(30,'안다율','브랜딩 기획','배포 지원','ChapGPT도 제가 만든거에유~','[\"React\", \"TypeScript\"]','[\"문제해결\", \"실행력\"]',3.8,4,'2025-07-18 15:08:34',0),(31,'이건희','데이터 분석','데이터 수집','늘 새로움을 추구합니다!','[\"JavaScript\", \"Node.js\"]','[\"분석력\", \"창의력\", \"리더십\"]',4.8,0,'2025-07-18 16:12:50',0),(32,'심동해','기획자','데이터 수집','기술로 세상을 바꾸고 싶어요','[\"Java\", \"React\"]','[\"적응력\", \"책임감\", \"분석력\"]',4.6,5,'2025-07-18 16:12:50',0),(33,'엄재헌','데이터 분석','디자인 보조','함께 성장하는 개발자','[\"Figma\", \"Python\"]','[\"집중력\", \"창의력\", \"분석력\"]',3.1,6,'2025-07-18 16:12:50',0),(34,'엄지민','프론트엔드 개발','배포 지원','도전이 저의 원동력입니다!','[\"C++\", \"Spring\"]','[\"전략적 사고\", \"소통\", \"분석력\"]',3.2,0,'2025-07-18 16:12:50',0),(35,'이동건','기획자','테스트 및 QA','기획부터 구현까지! 자신있어요','[\"SQL\", \"Node.js\"]','[\"실행력\", \"전략적 사고\", \"책임감\"]',3.5,5,'2025-07-18 16:12:52',0),(36,'서명욱','디자인 리더','UI 피드백','아이디어 뱅크입니다','[\"Figma\", \"Photoshop\"]','[\"창의력\", \"책임감\", \"집중력\"]',3.7,0,'2025-07-18 16:13:27',0),(37,'김대현','DB 설계','테스트 및 QA','정확하고 깔끔하게!','[\"DB\", \"SQL\"]','[\"책임감\", \"리더십\", \"분석력\"]',4.9,6,'2025-07-18 16:13:27',0),(38,'이영채','백엔드 개발','DB 구축','빠른 실행이 장점입니다','[\"Node.js\", \"Express\"]','[\"유연함\", \"실행력\", \"친절함\"]',4.1,1,'2025-07-18 16:13:27',0),(39,'박유나','브랜딩 기획','디자인 보조','브랜딩의 모든 것을 책임집니다','[\"Figma\", \"Photoshop\"]','[\"공감력\", \"창의력\", \"기획력\"]',4.3,2,'2025-07-18 16:13:27',0),(40,'박지원','서버 개발자','콘텐츠 편집','성능 최적화 전문가입니다','[\"Spring Boot\", \"Java\"]','[\"분석력\", \"집중력\", \"논리력\"]',3.8,4,'2025-07-18 16:13:28',0),(41,'윤주은','AI 모델링','데이터 정리','아이디어와 기술의 다리 역할','[\"Python\", \"AI\"]','[\"창의력\", \"표현력\", \"기획력\"]',3.5,2,'2025-07-18 16:13:41',0),(42,'기태연','프론트엔드 개발','테스트 및 QA','모든 기획을 구현할 수 있어요','[\"JavaScript\", \"HTML/CSS\"]','[\"소통\", \"기획력\", \"실행력\"]',3.9,3,'2025-07-18 16:13:41',0),(43,'김시원','DB 설계','자료 조사','데이터 아키텍트로 성장 중입니다','[\"SQL\", \"NoSQL\"]','[\"전략적 사고\", \"유연함\", \"끈기\"]',4.4,4,'2025-07-18 16:13:41',0),(44,'정준원','기획자','데이터 수집','무엇이든 열심히 해보겠습니다','[\"Java\", \"Spring\"]','[\"리더십\", \"책임감\", \"친절함\"]',4,1,'2025-07-18 16:13:41',0),(45,'한재윤','모바일 앱 개발','UI 피드백','직관적인 UI에 자신 있어요!','[\"Flutter\", \"Firebase\"]','[\"분석력\", \"공감력\", \"실행력\"]',4.2,2,'2025-07-18 16:13:42',0),(46,'김민우','UX 디자이너','디자인 피드백','사용자 경험에 진심입니다!','[\"UI/UX\", \"Figma\"]','[\"공감력\", \"집중력\", \"창의력\"]',3.6,1,'2025-07-18 16:13:56',0),(47,'김윤하','프론트엔드 구현','테스트 및 QA','버그를 사냥하는 개발자','[\"Vue.js\", \"TypeScript\"]','[\"실행력\", \"유연함\", \"책임감\"]',3.9,0,'2025-07-18 16:13:56',0),(48,'서윤경','기획자','콘텐츠 편집','스토리텔링은 제 전문입니다','[\"PowerPoint\", \"Notion\"]','[\"창의력\", \"소통\", \"설득력\"]',4.7,3,'2025-07-18 16:13:56',0),(49,'김은채','백엔드 개발','DB 구축','안정성과 효율성을 추구합니다','[\"Java\", \"MySQL\"]','[\"논리력\", \"끈기\", \"분석력\"]',4.5,5,'2025-07-18 16:13:56',0),(50,'박주은','디자인 리더','프론트 보조','센스있는 디자인을 추구해요!','[\"Photoshop\", \"Illustrator\"]','[\"창의력\", \"기획력\", \"집중력\"]',4.6,2,'2025-07-18 16:13:58',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waiting_users`
--

DROP TABLE IF EXISTS `waiting_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waiting_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `skills` json NOT NULL,
  `main_role` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `sub_role` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keywords` json NOT NULL,
  `has_reward` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waiting_users`
--

LOCK TABLES `waiting_users` WRITE;
/*!40000 ALTER TABLE `waiting_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `waiting_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-01 14:48:57
