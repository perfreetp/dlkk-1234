import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Plaza from '@/pages/Plaza'
import Workspace from '@/pages/Workspace'
import Prompts from '@/pages/Prompts'
import Records from '@/pages/Records'
import Team from '@/pages/Team'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/plaza" replace />} />
          <Route path="plaza" element={<Plaza />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="records" element={<Records />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </Router>
  )
}
