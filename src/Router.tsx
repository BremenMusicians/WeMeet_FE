import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { MyPage } from './pages/mypage/Mypage'
import { EditMyPage } from './pages/mypage/Edit'
import { Friend } from './pages/Friend'
import { Room } from './pages/Room'
import { ConcertRoom } from './pages/ConcertRoom'
import { Drum } from './pages/Drum'

export const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditMyPage />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/main" element={<Room />} />
        <Route path="/concertRoom" element={<ConcertRoom />} />
      </Routes>
    </BrowserRouter>
  )
}
