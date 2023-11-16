# app_server

- 앱 서버로 우회 경로 정보 알림 앱 서비스 사용자 관리 및 전체 데이터 관리
- 엣지 서버(가상)의 정보 관리 수행

## 사전 준비

- node js 설치(v16.17.0 이상)

## app_server 동작

- app_server 폴더에서 "npm install" 명령 실행
- app_server/bin/www 파일을 실행하여 서버 구동(node, pm2 등 활용)
- # app_server/daemon/calRoadSpeed_bypass.js 파일을 실행하여 도시교통 브레인 시스템과 연동된 교차로 속도 정보 생성 데몬 실행(node, pm2 등 활용)

# express-jwt-mysql2-starter
