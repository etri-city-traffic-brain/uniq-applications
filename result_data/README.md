# result_data

## od_info
* 베타 테스트를 통해 수집된 이동 정보 데이터 중 OD(Origin-Destination)에 대한 정보
* 날짜별 OD 정보를 CSV 파일로 정리

## od_info_desc.xlsx
* od_info 폴더내 파일들의 컬럼에 대한 설명

## TB_OD_INFO.csv
* 날짜별로 분류된 od_info의 파일을 하나의 CSV 파일로 취합
* 첫마을 교차로 통과 정보, 도로 혼잡 여부 등 데이터가 추가됨

## tracking_info
* od_info의 정보와 매칭되는 실제 주행 기록 정보
* 각 주행별 GPS 좌표와 속도 정보 등이 기록되어 잇음
* 폴더는 데이터 수집 날짜별로 정리되어 있음
* 각 날짜별로 사용자(uuid)의 주행 정보가 주행시작 시간(YYYYMMDDHHmmSS) 형식의 파일 이름으로 된 CSV 파일로 기록되어 있음

## tracking_info_desc.xlsx
* tracking_info 폴더내 파일들의 컬럼에 대한 설명

## tracking_link
* tracking_info의 GPS 좌표를 표준 노드 링크의 링크 정보와 매칭되는 도로 정보로 매핑된 데이터
* 주행시 수집된 GPS(점) 정보를 링크 정보(선) 정보에 매핑함
* GPS 값, 연결 정보 등이 불완전할 경우 링크와 매핑 실패하여 빈 데이터가 존재할 수 있음
* 이동 중 통과한 링크 정보와 링크를 통과한 속도 정보 등이 기록되어 있음
* 폴더는 데이터 수집 날짜별로 정리되어 있음
* 각 날짜별로 사용자(uuid)의 주행 정보가 주행시작 시간(YYYYMMDDHHmmSS) 형식의 파일 이름으로 된 CSV 파일로 기록되어 있음