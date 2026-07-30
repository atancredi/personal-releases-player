import { useCallback, useContext, useEffect, useRef, useState } from 'react';
// import { AppLayout } from './components/AppLayout';
// import { PRESETS } from './config/background';
// import ScrollingText from './ScrollingText/ScrollingText';
import { PauseIcon, PlayIcon } from './icons/PlayPauseIcon';
import { RadioContext, RadioDispatchContext, RadioPlayerRefContext, type ITrack } from './RadioApp';

export default function RadioMiniPlayer() {

	const radioApp = useContext(RadioContext);
	const radioAppDispatch = useContext(RadioDispatchContext);
	const playerRef = useContext(RadioPlayerRefContext); // Added player reference

	const togglePlayPause = () => {
		radioAppDispatch({
			type: 'togglePlayPause'
		})
	}

	// const stop = () => {
	// 	radioAppDispatch({
	// 		type: 'stop'
	// 	})
	// }

	// const [currentSeekTrack, setCurrentSeekTrack] = useState<ITrack>();
	const [_, setCurrentSeekTrack] = useState<ITrack>();

	const isPlaying = radioApp.isPlaying;

	const [isPlayerInfoOpen, setIsPlayerInfoOpen] = useState(false);
	// TODO merge logic of these two states
	const [progress, setProgress] = useState(0);
	const [timeProgress, setTimeProgress] = useState(0);

	const [isDragging, setIsDragging] = useState(false);
	const progressBarRef = useRef<HTMLDivElement>(null);

	// 1. Real Track Progress Sync Logic (Replaces Simulated Interval)
	useEffect(() => {
		let animationFrameId: number;

		const updatePosition = () => {
			// Only update if playing, NOT dragging, and player exists
			if (playerRef?.current && !isDragging) {
				const currentSeek = playerRef.current.seek();
				const duration = playerRef.current.duration();

				if (typeof currentSeek === 'number' && typeof duration === 'number' && duration > 0) {

					setProgress((currentSeek / duration) * 100);
					setTimeProgress(currentSeek)

					// update loadedTrack on when track is playing
					if (radioApp.loadedRelease && radioApp.loadedRelease.tracks) {
						let seekedTrack = radioApp.loadedRelease.tracks.filter((x) => x.timestamp != undefined && x.timestamp < currentSeek).slice(-1)[0];

						setCurrentSeekTrack(seekedTrack)
					}

				}
			}




			animationFrameId = requestAnimationFrame(updatePosition);
		};

		if (isPlaying && !isDragging) {
			animationFrameId = requestAnimationFrame(updatePosition);
		}

		return () => {
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, [isPlaying, isDragging, playerRef]);

	useEffect(() => {
		// Reset player state!
		if (radioApp.loadedRelease?.tracks?.length) {
			setCurrentSeekTrack(radioApp.loadedRelease?.tracks[0])
			setProgress(0);
			setTimeProgress(0);
		}
	}, [radioApp.loadedRelease])

	// 2. Seek Bar Interaction Logic Connected to Audio Player
	const updateProgress = useCallback((clientX: number, commitSeek: boolean = false) => {
		if (progressBarRef.current) {
			const rect = progressBarRef.current.getBoundingClientRect();
			// Calculate X position relative to the bar, constrained between 0 and width
			const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
			const percentage = (x / rect.width) * 100;

			setProgress(percentage);

			if (playerRef?.current) {
				const duration = playerRef.current.duration();
				if (typeof duration === 'number' && duration > 0) {
					setTimeProgress((percentage / 100) * duration)
				}
			}


			// Commit the actual track seek to Howler
			if (commitSeek && playerRef?.current) {
				const duration = playerRef.current.duration();
				if (typeof duration === 'number' && duration > 0) {
					playerRef.current.seek((percentage / 100) * duration);
					setTimeProgress((percentage / 100) * duration)
				}
			}
		}
	}, [playerRef]);

	const handlePointerDown = (e: any) => {
		setIsDragging(true);
		updateProgress(e.clientX, true); // Seek immediately on tap
	};

	// Attach window listeners for smooth dragging outside the element bounds
	useEffect(() => {
		const handlePointerMove = (e: any) => {
			if (isDragging) {
				// Update visually on drag
				if (((e.offsetY) < -45) || ((e.offsetY - 24) > 45)) {
					e.preventDefault();
					setIsDragging(false);
				} else {
					updateProgress(e.clientX, false)
				}
			}
		};
		const handlePointerUp = (e: any) => {
			if (isDragging) {
				updateProgress(e.clientX, true); // Commit seek on release
				setIsDragging(false);
			}
		};

		if (isDragging) {
			window.addEventListener('pointermove', handlePointerMove);
			window.addEventListener('pointerup', handlePointerUp);
		}
		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
		};
	}, [isDragging, updateProgress]);


	const renderDuration = () => {
		// Source - https://stackoverflow.com/a/1322798
		// Posted by T.J. Crowder, modified by community. See post 'Timeline' for change history
		// Retrieved 2026-07-30, License - CC BY-SA 4.0

		let totalSeconds = timeProgress;

		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;

		let minutesString = minutes < 10 ? "0" + minutes.toFixed(0) : minutes.toFixed(0);
		let secondsString = parseInt(seconds.toFixed(0)) < 10 ? "0" + seconds.toFixed(0) : seconds.toFixed(0);

		if (hours > 0)
			return hours.toFixed(0) + ":" + minutesString + ":" + secondsString
		else
			return minutesString + ":" + secondsString

	}

	return radioApp.loadedRelease != undefined && (
		<div className="flex flex-col bg-black/20 backdrop-blur-md rounded-t-xl border-t border-white/20 fixed bottom-0 w-[100dvw] z-50 text-white font-sans antialiased shadow-2xl select-none">

			{/* ROW 1: Controls & Interactive Seek Bar */}
			<div className='h-[60px] px-(--space-2) flex flex-row items-center gap-4 border-b border-white/10'>
				<button
					className='w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none'
					onClick={() => togglePlayPause()}
				>
					{isPlaying ? <PauseIcon /> : <PlayIcon />}
				</button>

				{/* ASCII-style Interactive Seek Bar */}
				<div
					className='flex-grow h-full flex items-center cursor-pointer group touch-none'
					ref={progressBarRef}
					onPointerDown={handlePointerDown}
				>
					<div className="relative w-full flex items-center h-6">
						{/* The "---" Background (Dashed Line) */}
						<div className="absolute w-full border-b-2 border-dashed border-white/30"></div>

						{/* The Filled Track */}
						<div
							className="absolute border-b-2 border-solid border-white transition-none"
							style={{ width: `${progress}%` }}
						></div>

						{/* The "|" Thumb */}
						<div
							className={`absolute w-1.5 h-6 bg-white shadow-md ${isDragging ? 'scale-y-110' : ''} group-hover:scale-y-110 transition-transform`}
							style={{
								left: `${progress}%`,
								transform: `translateX(-50%) ${isDragging ? 'scaleY(1.1)' : 'scaleY(1)'}`
							}}
						></div>
					</div>
				</div>

				<div 
					style={{flexBasis: "44px"}}>
					{renderDuration()}
				</div>
			</div>

			{/* ROW 2: Track Info & Cover */}
			<div
				className='h-[72px] px-(--space-2) flex flex-row items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors'
				onClick={() => { setIsPlayerInfoOpen(!isPlayerInfoOpen) }}
			>
				<div className='h-full p-(--space-1) flex-shrink-0 overflow-hidden shadow-sm'>
					{radioApp.loadedRelease?.cover != undefined && (<img className='w-full h-full object-cover opacity-90 rounded-md'
						src={new URL(radioApp.loadedRelease.cover, import.meta.env.VITE_S3_BUCKET_URL).href}
						alt={radioApp.loadedRelease.artist + " - " + radioApp.loadedRelease.title}
					/>)}
				</div>

				<div className='overflow-hidden flex flex-col justify-center flex-grow'>
					<div className="text-base font-bold text-white truncate">
						{/* <ScrollingText> */}
						{radioApp.loadedRelease?.title}
						{/* </ScrollingText> */}
					</div>
					<div className="text-sm text-white/60 font-medium truncate mt-0.5">
						{radioApp.loadedRelease?.artist}
					</div>
				</div>
			</div>

			{/* EXPANDED INFO */}
			{isPlayerInfoOpen
			// && (
			// 	<div className='h-[144px] px-4 py-4 flex flex-col gap-2 w-full border-t border-white/10 bg-white/5 relative'>
			// 		<div className="text-base font-medium">Current track: {currentSeekTrack?.title}</div>
			// 		{/* <div className="text-sm text-white/70">This has been brought to you by the BELPRANZO authority yeahh.</div> */}

			// 		<div className='absolute right-4 bottom-4'>
			// 			<button
			// 				onClick={() => setIsPlayerInfoOpen(false)}
			// 				className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium transition-colors"
			// 			>
			// 				Close
			// 			</button>
			// 		</div>
			// 	</div>
			// )
			}

		</div>
	);
}