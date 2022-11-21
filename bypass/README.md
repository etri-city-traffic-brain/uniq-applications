# bypass
* 도시교통 브레인 시스템과 연동하여 교통 혼잡 및 우회 경로 정보 제공

## 구성
  * app_server
    * 앱 서버로 우회 경로 정보 알림 앱 서비스 사용자 관리 및 전체 데이터 관리
    * 엣지 서버(가상)의 정보 관리 수행
  * edge_server
    * 담당 구역별 정보 수집, 푸시 전송용 서버
    * 구역별 edge_server 프로젝트를 복제하여 생성 후 사용
  * bypass
    * 우회경로 전송용 앱
    * 현재 이동 정보를 수집하고 서버로부터 전송된 우회경로 정보를 전송

## 사전 준비
  * node js 설치(v16.17.0 이상)
  * 안드로이드 스튜디오 설치
  * macOS가 설치된 PC 준비

## app_server 동작
  * app_server 폴더에서 "npm install" 명령 실행
  * app_server/bin/www 파일을 실행하여 서버 구동(node, pm2 등 활용)
  * app_server/daemon/calRoadSpeed_bypass.js 파일을 실행하여 도시교통 브레인 시스템과 연동된 교차로 속도 정보 생성 데몬 실행(node, pm2 등 활용)

## edge_server
  * 엣지 서버 답당 구역별 프로젝트 복제
  * edge_server 폴더에서 "npm install" 명령 실행
  * edge_server/bin/www 파일을 실행하여 서버 구동(node, pm2 등 활용)
  * edge_server/daemon/calRoadSpeed.js 파일을 실행하여 담당 영역내 이동 속도 계산 데몬 실행(node, pm2 등 활용)
  * edge_server/daemon/push2Client.js 파일을 실행하여 엣지 서버 이동 대상 푸시 전송 데몬 실행(node, pm2 등 활용)

## bypass
  * 안드로이드 앱 실행 : npx react-native run-android
  * iOS 앱 실행 : npx react-native run-ios
  * abb 파일로 빌드
    * cd android
    * ./gradlew bundleRelease
    * app > build > ouputs > bundle > app-release.aab 파일 생성
  * apk 파일로 빌드
    * cd android
    * ./gradlew app:assembleRelease
    * app > build > outputs > apk > app-releas.apk 파일 생성
  * iOS 앱 빌드
    * ios > bypass.xcodeproj 파일 실행 > xcode 실행
    * Product > Archive로 배포용 파일 빌드