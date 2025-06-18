import { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { MantineProvider, Container, Loader } from '@mantine/core';
import '@mantine/core/styles.css';
import TodoPage from './routes/_index/route';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container size="md" py="md">
      {children}
    </Container>
  );
}

export default function App() {
  return (
    <MantineProvider>
      <Layout>
        <Suspense fallback={<Loader size="lg" />}>
          <Routes>
            <Route path="/" element={<TodoPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </MantineProvider>
  );
}
