import Image from 'next/image';
import AudiobookshelfIcon from '@/assets/icons/Audiobookshelf.svg';
import PlexIcon from '@/assets/icons/Plex.svg';
import DiscordIcon from '@/assets/icons/Discord.svg';
import SonarrIcon from '@/assets/icons/Sonarr.png';
import RadarrIcon from '@/assets/icons/Radarr.png';
import ReadarrIcon from '@/assets/icons/Readarr.png';
import SabnzbIcon from '@/assets/icons/SABnzb.svg';
import TautulliIcon from '@/assets/icons/Tautulli.png';
import SyncthingIcon from '@/assets/icons/Syncthing.svg';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Deep North</h1>
      <div className="grid grid-cols-3 gap-8">
        {/* Top Row */}
        <a href="https://abs.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <AudiobookshelfIcon className="w-16 h-16 text-white" />
        </a>
        <a href="https://app.plex.tv" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <PlexIcon className="w-16 h-16 text-white" />
        </a>
        <a href="https://discord.gg/dXwYnad" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <DiscordIcon className="w-16 h-16 text-white" />
        </a>
        {/* Middle Row */}
        <a href="https://sonarr.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <Image src={SonarrIcon} alt="Sonarr" width={64} height={64} />
        </a>
        <a href="https://radarr.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <Image src={RadarrIcon} alt="Radarr" width={64} height={64} />
        </a>
        <a href="https://readarr.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <Image src={ReadarrIcon} alt="Readarr" width={64} height={64} />
        </a>
        {/* Bottom Row */}
        <a href="https://sab.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <SabnzbIcon className="w-16 h-16 text-white" />
        </a>
        <a href="https://tautulli.deepnorth.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <Image src={TautulliIcon} alt="Tautulli" width={64} height={64} />
        </a>
        <a href="https://syncthing.net" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg hover:shadow-gray-500/50 hover:scale-105 transition-all duration-300">
          <SyncthingIcon className="w-16 h-16 text-white" />
        </a>
      </div>
    </div>
  );
}