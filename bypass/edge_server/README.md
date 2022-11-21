# edge_server
* 담당 구역별 정보 수집, 푸시 전송용 서버
* 구역별 edge_server 프로젝트를 복제하여 생성 후 사용

## 사전 준비
  * node js 설치(v16.17.0 이상)

## edge_server
  * 엣지 서버 답당 구역별 프로젝트 복제
  * edge_server 폴더에서 "npm install" 명령 실행
  * edge_server/bin/www 파일을 실행하여 서버 구동(node, pm2 등 활용)
  * edge_server/daemon/calRoadSpeed.js 파일을 실행하여 담당 영역내 이동 속도 계산 데몬 실행(node, pm2 등 활용)
  * edge_server/daemon/push2Client.js 파일을 실행하여 엣지 서버 이동 대상 푸시 전송 데몬 실행(node, pm2 등 활용)