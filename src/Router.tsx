import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { MyPage } from "./pages/mypage/Mypage";
import { EditMyPage } from "./pages/mypage/Edit";
import { Friend } from "./pages/Friend";

export const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/main" element={<MyPage />} />
                <Route path="/main/edit" element={<EditMyPage />} />
                <Route path="/friend" element={<Friend />} />
            </Routes>
        </BrowserRouter>
    );
};
