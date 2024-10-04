// src/app/apps/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import AudiobookshelfIcon from '@/assets/icons/Audiobookshelf.svg';
import PlexIcon from '@/assets/icons/Plex.svg'; // Ensure this is imported
import DiscordIcon from '@/assets/icons/Discord.svg';
import SonarrIcon from '@/assets/icons/Sonarr.png';
import RadarrIcon from '@/assets/icons/Radarr.png';
import ReadarrIcon from '@/assets/icons/Readarr.png';
import SabnzbIcon from '@/assets/icons/SABnzb.svg';
import TautulliIcon from '@/assets/icons/Tautulli.png';
import React from 'react';
import AppLink from '@/app/components/AppLink'; // Adjust the path if needed

const AppsPage = () => {
  return (
    <div>
      <h1>Apps</h1>
      <div>
        {/* Updated Plex Section */}
        <AppLink 
          icon={PlexIcon} 
          name="Open Plex" 
          appUrl="plex://" 
          storeUrl="https://apps.apple.com/app/id324789451" 
        />

        {/* Other app links/icons */}
        <div>
          <Link href="https://audiobookshelf.com" passHref>
            <Image src={AudiobookshelfIcon} alt="Audiobookshelf" width={40} height={40} />
            <span>Audiobookshelf</span>
          </Link>
        </div>
        <div>
          <Link href="https://discord.com" passHref>
            <Image src={DiscordIcon} alt="Discord" width={40} height={40} />
            <span>Discord</span>
          </Link>
        </div>
        <div>
          <Link href="https://sonarr.tv" passHref>
            <Image src={SonarrIcon} alt="Sonarr" width={40} height={40} />
            <span>Sonarr</span>
          </Link>
        </div>
        <div>
          <Link href="https://radarr.video" passHref>
            <Image src={RadarrIcon} alt="Radarr" width={40} height={40} />
            <span>Radarr</span>
          </Link>
        </div>
        <div>
          <Link href="https://readarr.com" passHref>
            <Image src={ReadarrIcon} alt="Readarr" width={40} height={40} />
            <span>Readarr</span>
          </Link>
        </div>
        <div>
          <Link href="https://sabnzbd.org" passHref>
            <Image src={SabnzbIcon} alt="SABnzb" width={40} height={40} />
            <span>SABnzb</span>
          </Link>
        </div>
        <div>
          <Link href="https://tautulli.com" passHref>
            <Image src={TautulliIcon} alt="Tautulli" width={40} height={40} />
            <span>Tautulli</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppsPage;