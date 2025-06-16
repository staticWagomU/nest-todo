import { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import TodoPage from "./routes/_index/route";
import "./tailwind.css";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<TodoPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}