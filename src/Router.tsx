import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { MyPage } from "./pages/mypage/Mypage";
import { EditMyPage } from "./pages/mypage/Edit";
import { Friend } from "./pages/Friend";
import { Room } from "./pages/Room";

export const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/main/edit" element={<EditMyPage />} />
                <Route path="/friend" element={<Friend />} />
                <Route path="/main" element={<Room />} />
            </Routes>
        </BrowserRouter>
    );
};
