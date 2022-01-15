# Group26 : 多人遊戲大全
## Member
* 電機二江承恩 B09901099
* 電機二陳品睿 B09901194
* 電機二蘇絹淇 B09901199
### Deployed link: 
### Demo video: 
### Github repo: 
## 如何在 localhost 安裝與測試
  1. Install related files by the following command:
  ```
    cd backend && yarn install
    cd frontend && yarn install
  ```
  2. Set the MongoDB url in backend/.env
  ```
    cd backend
    cp .env.defaults .env
    # fill in the MONGO url
  ```
  3. The server can be started by the command:
  ```
    yarn server
  ```
  4. The client can be started by the command:
  ```
    yarn start
  ```
## Introduction
  * 登入頁面：SignInu以及SignUp
  * 遊戲列表
      * 左上角可使用URL更換user的照片，將會連同User's name顯示在遊戲畫面中
      * 四子棋（Connect Four）（一對一對戰）
      * 誰是牛頭王（6 Nimmt）（多人對戰，最多可到10人） // 這是一款桌遊
      * 踩地雷（MineSweeper）（假的，這是我們的未來完成目標）
      * 花札（Hanafuda）（假的，這是我們的未來完成目標）
  * ROOM名稱輸入
      * 若ROOM名稱是新的，則可進入遊戲準備區（Lobby Room）
      * 若ROOM名稱內已有人則成為下一個player（四子棋會直接開始遊戲，誰是牛頭王則會需要進入遊戲準備區（Lobby Room）等待host開始遊戲）
      * 若有已開始的遊戲名稱被使用者要求重新登入，使用者將無法進入，顯示遊戲進行中的訊息
  * 四子棋（Connect Four）
      * 遊戲準備區（Lobby Room）
          * 若有兩位玩家進入就會直接開始遊戲
          * go back按鍵可隨時返回遊戲列表畫面
          * 遊戲規則說明（Instructions）於畫面下方
      * 遊戲進行
          * 輪到玩家時，點選任何一直行即可下棋，當有人四子連線後即獲勝，顯示遊戲結束
          * 若玩家獲勝時，會顯示文字告訴玩家你獲勝了，反之亦然
          * 當平手時，兩邊的玩家都會顯示 game over!
      * 遊戲結束，可選擇：
          * 點選go back回到遊戲列表
          * 重新啟動遊戲進入Lobby Room，若原本的host沒有離開就會續任，反之則由第二位輪替
  * 誰是牛頭王（6 Nimmt）
      * 遊戲準備區（Lobby Room）
          * 由第一位進入者成為host，擁有開始遊戲的權利，會出現start game按鈕可以點選，其他人也可以看到現在有哪些players在裡面
          * go back按鍵可隨時返回遊戲列表畫面
          * 遊戲規則說明（Instructions）
      * 遊戲進行
          * 每人在一開始手中有十張牌，每回合出一張，出完十張即遊戲結束
          * 當你的牌小於任何一列牌尾時，選擇要拿掉哪一牌的方式是按那一列的任意處
          * 請注意，點選手牌時不要快速連點兩下，你會不小心出到兩張牌，造成遊戲錯誤
      * 遊戲結束，可選擇：
          * 點選Back To Home回到遊戲列表
          * 點選Restart重新啟動遊戲進入Lobby Room，若原本的host沒有離開就會續任，反之則由第二位輪替
  *注意事項：我們預設大家都是好玩家，因此不要在遊戲進行中，突然直接關閉整個頁面，如要關閉頁面，請使用go back或是back to home等按鍵回到遊戲列表後才能關閉
## 使用與參考之框架/模組/原始碼：我們當初就是看到board game arena這個網站(https://boardgamearena.com/)，覺得有一個讓大家可以免費上去玩桌遊的平台很讚，所以才決定做這個的，不過因為時間有限沒辦法產出很多桌遊
## 使用之第三方套件、框架、程式碼：
  * 前端：React Hook, react-router-dom
  * 後端：Node.js, websocket, bcrypt, cors, express, dotenv, nodemon
  * 資料庫：MongoDB
  * 第三方套件：Ant Design
## Contribution
  * 電機二江承恩 B09901099: gameboard主畫面前端與後端、四子棋前後端、帳密、整合
  * 電機二陳品睿 B09901194: 誰是牛頭王後端
  * 電機二蘇絹淇 B09901199: 誰是牛頭王前端

