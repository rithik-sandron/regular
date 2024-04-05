import AppLayout from '@/components/AppLayout'
import '../css/app.css'
import '../css/timeline.css'
import '../css/avail.css'

const App = ({ Component, pageProps }) => <AppLayout><Component {...pageProps} /></AppLayout>

export default App
