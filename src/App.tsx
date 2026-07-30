import RadioApp from "./components/RadioApp";
import { AppLayout } from "./components/LiquidLayout/AppLayout";
import { PRESETS } from "./components/LiquidLayout/background";

import ReleasesGallery from "./components/ReleasesGallery";

function App() {

	return (
		<AppLayout config={PRESETS['subtle_bw']}>
			<RadioApp
				storageBucketBaseURL={import.meta.env.VITE_S3_BUCKET_URL}
			>
				{/* <div className="h-[100dvh] overflow-y-auto overscroll-none "> */}
				<ReleasesGallery />
				{/* </div> */}
			</RadioApp>
		</AppLayout>

	)
}

export default App
