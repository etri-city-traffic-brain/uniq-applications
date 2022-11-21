# bypass
* 도시교통 브레인 시스템과 연동하여 교통 혼잡 및 우회 경로 정보 제공을 위한 리액트네이티브 앱

## 사전 준비
  * 안드로이드 스튜디오 설치
  * macOS가 설치된 PC 준비

## 앱 빌드 및 실행
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